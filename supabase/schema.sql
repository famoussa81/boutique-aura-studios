-- ============================================================
-- AURA STUDIOS — Schéma Supabase
-- Colle ce bloc dans Supabase → SQL Editor puis clic "Run".
-- Le script est idempotent : il peut être rejoué sans risque.
-- ============================================================

-- ---------- Tables ----------

create table if not exists public.products (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id integer primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  ref text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Liste d'attente : demandes « prévenez-moi quand c'est disponible ».
-- C'est de la demande captée sur un produit en rupture : sans elle, ces
-- visiteurs sont perdus sans laisser de trace.
create table if not exists public.waitlist (
  id bigserial primary key,
  product_id text not null,
  product_name text not null,
  size text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  unique (product_id, size, phone)
);

-- Brouillon privé de l'administration et dix dernières publications.
-- Le site public ne lit jamais ces tables.
create table if not exists public.admin_drafts (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version > 0),
  dirty boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);

-- `create table if not exists` ne complète pas une installation déjà en
-- production : cette migration garde les boutiques existantes compatibles.
alter table public.admin_drafts add column if not exists dirty boolean not null default false;

create table if not exists public.store_revisions (
  id uuid primary key default gen_random_uuid(),
  version integer not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid()
);

-- Comptes explicitement autorisés à administrer cette boutique.  Une simple
-- session Supabase ne suffit jamais : les commandes contiennent des données
-- personnelles et les fonctions ci-dessous modifient le stock.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Limites côté serveur des formulaires publics. Elles ne sont jamais
-- accessibles par REST : seules les fonctions atomiques les consultent.
create table if not exists public.public_request_limits (
  scope text not null,
  fingerprint text not null,
  window_started timestamptz not null default now(),
  attempts integer not null default 0 check (attempts >= 0),
  primary key (scope, fingerprint)
);

-- Séquence serveur des références de commande : garantit l'unicité
-- entre tous les appareils (un compteur navigateur ne le peut pas).
create sequence if not exists public.order_seq start with 1;

-- Ligne de réglages par défaut
insert into public.settings (id, data) values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- ---------- RLS ----------

alter table public.products    enable row level security;
alter table public.settings    enable row level security;
alter table public.orders      enable row level security;
alter table public.subscribers enable row level security;
alter table public.waitlist     enable row level security;
alter table public.admin_drafts enable row level security;
alter table public.store_revisions enable row level security;
alter table public.admin_users enable row level security;
alter table public.public_request_limits enable row level security;

drop policy if exists "products_select_public" on public.products;
drop policy if exists "settings_select_public" on public.settings;
drop policy if exists "orders_insert_public"   on public.orders;
drop policy if exists "products_write_auth"    on public.products;
drop policy if exists "settings_write_auth"    on public.settings;
drop policy if exists "orders_read_auth"       on public.orders;
drop policy if exists "orders_write_auth"      on public.orders;
drop policy if exists "subscribers_insert_public" on public.subscribers;
drop policy if exists "subscribers_read_auth"     on public.subscribers;
drop policy if exists "waitlist_insert_public"    on public.waitlist;
drop policy if exists "waitlist_read_auth"        on public.waitlist;
drop policy if exists "admin_drafts_auth"          on public.admin_drafts;
drop policy if exists "store_revisions_auth"       on public.store_revisions;

-- La fonction est SECURITY DEFINER pour pouvoir lire la liste privée sans
-- jamais l'exposer au navigateur. Le SQL est fixe et le search_path fermé.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path to 'public'
as $$
  select auth.uid() is not null
     and exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.enforce_public_rate_limit(
  limit_scope text,
  limit_fingerprint text,
  max_attempts integer,
  limit_window interval
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_started timestamptz; v_attempts integer;
begin
  if limit_fingerprint is null or length(limit_fingerprint) < 8 then
    raise exception 'Requête invalide' using errcode = '22023';
  end if;
  select window_started, attempts into v_started, v_attempts
    from public.public_request_limits
   where scope = limit_scope and fingerprint = limit_fingerprint
   for update;
  if not found then
    insert into public.public_request_limits(scope, fingerprint, attempts)
    values (limit_scope, limit_fingerprint, 1);
  elsif v_started <= now() - limit_window then
    update public.public_request_limits
       set window_started = now(), attempts = 1
     where scope = limit_scope and fingerprint = limit_fingerprint;
  elsif v_attempts >= max_attempts then
    raise exception 'Trop de demandes. Réessayez plus tard.' using errcode = '22023';
  else
    update public.public_request_limits
       set attempts = attempts + 1
     where scope = limit_scope and fingerprint = limit_fingerprint;
  end if;
end;
$$;
revoke all on function public.enforce_public_rate_limit(text, text, integer, interval) from public, anon, authenticated;

-- Lecture catalogue et réglages : tout le monde (la boutique en a besoin).
-- Aucun secret ne doit être stocké dans `settings` : son contenu est public.
create policy "products_select_public" on public.products
  for select using (true);

create policy "settings_select_public" on public.settings
  for select using (true);

-- Les commandes ne sont JAMAIS insérables directement par le public :
-- le seul chemin autorisé est la fonction `place_order` ci-dessous, qui
-- valide les données, recalcule les prix et décrémente le stock.
-- (Aucune politique d'insertion publique n'est donc créée.)

create policy "subscribers_read_auth" on public.subscribers
  for select using (public.is_admin());

create policy "waitlist_read_auth" on public.waitlist
  for select using (public.is_admin());

create policy "orders_read_auth" on public.orders
  for select using (public.is_admin());

-- Les écritures sensibles passent uniquement par les fonctions atomiques
-- définies plus bas. Une requête REST authentifiée ne peut donc pas contourner
-- les contrôles de stock, l'archivage ou la gestion des versions.
create policy "admin_drafts_auth" on public.admin_drafts
  for select using (public.is_admin());

create policy "store_revisions_auth" on public.store_revisions
  for select using (public.is_admin());

-- Les formulaires publics passent par ces fonctions : validation et limite
-- de débit restent alors côté serveur, même depuis un script externe.
create or replace function public.subscribe_newsletter(raw_email text)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_email text := lower(trim(coalesce(raw_email, '')));
begin
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$' or length(v_email) > 254 then
    raise exception 'Adresse e-mail invalide' using errcode = '22023';
  end if;
  perform public.enforce_public_rate_limit('newsletter', md5(v_email), 3, interval '24 hours');
  insert into public.subscribers(email) values (v_email) on conflict (email) do nothing;
  return true;
end;
$$;
revoke all on function public.subscribe_newsletter(text) from public;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;

create or replace function public.join_waitlist_request(raw_product_id text, raw_product_name text, raw_size text, raw_phone text)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_product_id text := trim(coalesce(raw_product_id, ''));
  v_product_name text := trim(coalesce(raw_product_name, ''));
  v_size text := trim(coalesce(raw_size, ''));
  v_phone text := regexp_replace(coalesce(raw_phone, ''), '\D', '', 'g');
begin
  if v_phone !~ '^[0-9]{8}$' or length(v_product_id) not between 1 and 64
     or length(v_product_name) not between 1 and 200 or length(v_size) not between 1 and 200 then
    raise exception 'Demande invalide' using errcode = '22023';
  end if;
  perform public.enforce_public_rate_limit('waitlist', md5(v_phone), 5, interval '24 hours');
  insert into public.waitlist(product_id, product_name, size, phone)
  values (v_product_id, v_product_name, v_size, v_phone)
  on conflict (product_id, size, phone) do nothing;
  return true;
end;
$$;
revoke all on function public.join_waitlist_request(text, text, text, text) from public;
grant execute on function public.join_waitlist_request(text, text, text, text) to anon, authenticated;

-- ---------- Brouillons, publication et stock ----------

drop function if exists public.save_admin_draft(uuid, integer, jsonb);
create or replace function public.save_admin_draft(draft_id uuid, expected_version integer, payload jsonb, mark_dirty boolean default true)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_draft public.admin_drafts%rowtype;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  if jsonb_typeof(payload->'settings') <> 'object' or jsonb_typeof(payload->'products') <> 'array' then
    raise exception 'Brouillon incomplet';
  end if;
  if payload::text ~ '"data:image/[^" ]+;base64,' then
    raise exception 'Une photo locale doit être envoyée avant la synchronisation';
  end if;
  -- Défense en profondeur : ces clés ont existé dans d'anciennes copies
  -- locales. Elles ne doivent jamais pouvoir rejoindre `settings`, qui est
  -- lisible publiquement par la boutique.
  payload := jsonb_set(
    payload,
    '{settings}',
    (payload->'settings') - array['password','adminPassword','adminEmail','anonKey','serviceKey'],
    true
  );
  select * into v_draft from public.admin_drafts where id = draft_id for update;
  if found then
    if v_draft.version <> expected_version then
      raise exception 'Ce brouillon a été modifié sur un autre appareil';
    end if;
    update public.admin_drafts set data = payload, version = version + 1,
      dirty = dirty or coalesce(mark_dirty, true),
      updated_at = now(), updated_by = auth.uid() where id = draft_id returning * into v_draft;
  else
    if expected_version <> 0 then raise exception 'Ce brouillon a été supprimé ou remplacé'; end if;
    insert into public.admin_drafts(id, data, version, dirty, updated_by)
      values (draft_id, payload, 1, coalesce(mark_dirty, true), auth.uid()) returning * into v_draft;
  end if;
  return to_jsonb(v_draft);
end;
$$;

create or replace function public.publish_store(draft_id uuid, expected_version integer)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_draft public.admin_drafts%rowtype;
  v_snapshot jsonb;
  v_product jsonb;
  v_current jsonb;
  v_revision uuid;
  v_key text;
  v_variant jsonb;
  v_clean_variants jsonb;
  v_ids text[];
  v_product_count integer;
  v_distinct_count integer;
  v_public_settings jsonb;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  select * into v_draft from public.admin_drafts where id = draft_id for update;
  if not found then raise exception 'Brouillon introuvable'; end if;
  if v_draft.version <> expected_version then
    raise exception 'Ce brouillon a été modifié sur un autre appareil';
  end if;
  if jsonb_typeof(v_draft.data->'settings') <> 'object'
     or jsonb_typeof(v_draft.data->'products') <> 'array' then
    raise exception 'Brouillon incomplet';
  end if;
  if v_draft.data::text ~ '"data:image/[^" ]+;base64,' then
    raise exception 'Une photo locale doit être envoyée avant la publication';
  end if;

  if exists (
    select 1 from jsonb_array_elements(v_draft.data->'products') p
    where nullif(trim(p->>'id'), '') is null
  ) then
    raise exception 'Produit sans identifiant';
  end if;
  select count(*), count(distinct p->>'id'),
         coalesce(array_agg(p->>'id' order by p->>'id'), array[]::text[])
    into v_product_count, v_distinct_count, v_ids
    from jsonb_array_elements(v_draft.data->'products') p;
  if v_product_count <> v_distinct_count then
    raise exception 'Identifiant produit présent plusieurs fois';
  end if;

  -- La commande publique verrouille ses produits dans l'ordre du panier.
  -- Une publication touche potentiellement tout le catalogue : ce verrou
  -- bref la fait attendre les commandes déjà commencées et bloque les
  -- nouvelles écritures de stock jusqu'au commit, sans interblocage entre
  -- deux produits pris dans un ordre différent.
  lock table public.products in share row exclusive mode;

  -- Tous les verrous produits sont pris dans le même ordre pour réduire le
  -- risque d'interblocage avec une modification de commande ou de stock.
  perform 1 from public.products
   where id = any(v_ids)
   order by id
   for update;

  select jsonb_build_object(
    'settings', coalesce((select data from public.settings where id = 1), '{}'::jsonb),
    'products', coalesce((select jsonb_agg(data order by id) from public.products), '[]'::jsonb)
  ) into v_snapshot;

  insert into public.store_revisions(version, data, created_by)
  values (v_draft.version, v_snapshot, auth.uid()) returning id into v_revision;

  v_public_settings := (v_draft.data->'settings')
    - array['password','adminPassword','adminEmail','anonKey','serviceKey'];
  insert into public.settings(id, data, updated_at)
  values (1, v_public_settings, now())
  on conflict (id) do update set data = excluded.data, updated_at = now();

  -- Une révision représente la vitrine complète. Les produits créés après
  -- cette révision doivent donc disparaître de la vitrine quand elle est
  -- restaurée, sans effacer leur stock ni l'historique des commandes.
  update public.products
     set data = jsonb_set(
                  jsonb_set(data, '{active}', 'false'::jsonb, true),
                  '{archived}', 'true'::jsonb, true
                ),
         updated_at = now()
   where not (id = any(v_ids));

  for v_product in select value from jsonb_array_elements(v_draft.data->'products') loop
    if nullif(v_product->>'id', '') is null then raise exception 'Produit sans identifiant'; end if;
    select data into v_current from public.products where id = v_product->>'id' for update;
    if found then
      for v_key, v_variant in select key, value from jsonb_each(coalesce(v_current->'variants', '{}'::jsonb)) loop
        if coalesce((v_variant->>'r')::integer, 0) > 0
           and not (coalesce(v_product->'variants', '{}'::jsonb) ? v_key) then
          raise exception 'La variante % du produit % est réservée par une commande', v_key, v_product->>'name';
        end if;
      end loop;
      -- Le stock, les réservations et un masquage d'urgence ne sont jamais
      -- remplacés par une ancienne copie du brouillon.
      v_product := jsonb_set(v_product, '{variants}', coalesce(v_current->'variants', v_product->'variants', '{}'::jsonb), true);
      v_product := jsonb_set(v_product, '{active}', coalesce(v_current->'active', v_product->'active', 'true'::jsonb), true);
      if v_current ? 'archived' then
        v_product := jsonb_set(v_product, '{archived}', v_current->'archived', true);
      end if;
    else
      if jsonb_typeof(v_product->'variants') <> 'object' then
        raise exception 'Stock invalide pour le nouveau produit %', v_product->>'name';
      end if;
      v_clean_variants := '{}'::jsonb;
      for v_key, v_variant in select key, value from jsonb_each(v_product->'variants') loop
        v_clean_variants := v_clean_variants || jsonb_build_object(
          v_key,
          jsonb_build_object('s', greatest(0, coalesce((v_variant->>'s')::integer, 0)), 'r', 0)
        );
      end loop;
      v_product := jsonb_set(v_product, '{variants}', v_clean_variants, true);
    end if;
    insert into public.products(id, data, updated_at)
    values (v_product->>'id', v_product, now())
    on conflict (id) do update set data = excluded.data, updated_at = now();
  end loop;

  update public.admin_drafts
  set version = version + 1, dirty = false, updated_at = now(), updated_by = auth.uid()
  where id = draft_id returning * into v_draft;

  delete from public.store_revisions
  where id not in (select id from public.store_revisions order by created_at desc limit 10);

  return jsonb_build_object('revision_id', v_revision, 'version', v_draft.version, 'published_at', now());
end;
$$;

drop function if exists public.restore_revision_as_draft(uuid);
create or replace function public.restore_revision_as_draft(revision_id uuid, expected_version integer)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_data jsonb; v_draft public.admin_drafts%rowtype;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  select data into v_data from public.store_revisions where id = revision_id;
  if not found then raise exception 'Publication introuvable'; end if;
  select * into v_draft from public.admin_drafts order by updated_at desc limit 1 for update;
  if found then
    if v_draft.version <> expected_version then
      raise exception 'Ce brouillon a été modifié sur un autre appareil';
    end if;
    update public.admin_drafts set data = v_data, version = version + 1, dirty = true,
      updated_at = now(), updated_by = auth.uid() where id = v_draft.id returning * into v_draft;
  else
    if expected_version <> 0 then raise exception 'Ce brouillon a été supprimé ou remplacé'; end if;
    insert into public.admin_drafts(data, dirty, updated_by) values (v_data, true, auth.uid()) returning * into v_draft;
  end if;
  return to_jsonb(v_draft);
end;
$$;

create or replace function public.set_inventory(product_id text, new_variants jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_data jsonb; v_old jsonb; v_merged jsonb := '{}'::jsonb; v_key text; v_value jsonb; v_reserved integer; v_stock integer;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  if jsonb_typeof(new_variants) <> 'object' then raise exception 'Stock invalide'; end if;
  select data into v_data from public.products where id = product_id for update;
  if not found then raise exception 'Produit introuvable'; end if;
  v_old := coalesce(v_data->'variants', '{}'::jsonb);
  for v_key, v_value in select key, value from jsonb_each(v_old) loop
    v_reserved := greatest(0, coalesce((v_value->>'r')::integer, 0));
    if v_reserved > 0 and not (new_variants ? v_key) then
      raise exception 'La variante % est réservée par une commande', v_key;
    end if;
  end loop;
  for v_key, v_value in select key, value from jsonb_each(new_variants) loop
    v_stock := greatest(0, coalesce((v_value->>'s')::integer, 0));
    v_reserved := greatest(0, coalesce((v_old->v_key->>'r')::integer, 0));
    if v_stock < v_reserved then raise exception 'Le stock de % est inférieur aux réservations', v_key; end if;
    v_merged := v_merged || jsonb_build_object(v_key, jsonb_build_object('s', v_stock, 'r', v_reserved));
  end loop;
  v_data := jsonb_set(v_data, '{variants}', v_merged, true);
  update public.products set data = v_data, updated_at = now() where id = product_id;
  return v_data;
end;
$$;

create or replace function public.set_product_visibility(product_id text, visible boolean)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_data jsonb;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  select data into v_data from public.products where id = product_id for update;
  if not found then raise exception 'Produit introuvable'; end if;
  v_data := jsonb_set(v_data, '{active}', to_jsonb(visible), true);
  if visible then v_data := jsonb_set(v_data, '{archived}', 'false'::jsonb, true); end if;
  update public.products set data = v_data, updated_at = now() where id = product_id;
  return v_data;
end; $$;

create or replace function public.archive_product(product_id text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_data jsonb;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  select data into v_data from public.products where id = product_id for update;
  if not found then raise exception 'Produit introuvable'; end if;
  v_data := jsonb_set(jsonb_set(v_data, '{active}', 'false'::jsonb, true), '{archived}', 'true'::jsonb, true);
  update public.products set data = v_data, updated_at = now() where id = product_id;
  return v_data;
end; $$;

-- Met à jour une commande ET son impact sur le stock dans la même
-- transaction. Le navigateur ne réécrit jamais le catalogue complet : un
-- brouillon de prix ou de photo ne peut donc pas partir en boutique au détour
-- d'un changement de statut.
create or replace function public.admin_save_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_ref text := trim(coalesce(payload->>'ref', ''));
  v_old jsonb;
  v_old_status text;
  v_old_reserved boolean;
  v_new_reserved boolean;
  v_new_status text := coalesce(payload->>'status', '');
  v_item jsonb;
  v_old_item jsonb;
  v_prod jsonb;
  v_field text;
  v_key text;
  v_qty integer;
  v_stock integer;
  v_reserved integer;
  v_lines jsonb := '[]'::jsonb;
  v_subtotal integer := 0;
  v_delivery integer := 0;
  v_freefrom integer := 0;
  v_result jsonb;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  if v_ref = '' then raise exception 'Référence de commande manquante'; end if;
  if v_new_status not in ('PENDING','CONFIRMED','SHIPPING','DELIVERED','CANCELLED') then
    raise exception 'Statut de commande invalide';
  end if;

  select data into v_old from public.orders where ref = v_ref for update;
  if not found then raise exception 'Commande introuvable'; end if;
  v_old_status := coalesce(v_old->>'status', 'PENDING');
  -- Les commandes historiques réservaient le stock et n'ont pas ce champ :
  -- elles restent donc traitées comme réservées jusqu'à leur résolution.
  v_old_reserved := v_old_status = 'PENDING'
    and coalesce((v_old->>'stockReserved')::boolean, true);
  v_new_reserved := v_new_status = 'PENDING' and v_old_reserved;

  if jsonb_typeof(payload->'items') <> 'array' or jsonb_array_length(payload->'items') = 0 then
    raise exception 'Une commande doit garder au moins un article';
  end if;
  if exists (
    select 1
      from jsonb_array_elements(payload->'items') item
     group by item->>'id', coalesce(item->>'variant', item->>'size', '')
    having count(*) > 1
  ) then
    raise exception 'Une ligne de commande est présente plusieurs fois';
  end if;

  perform 1 from public.products
   where id in (
     select distinct item->>'id'
       from jsonb_array_elements(coalesce(v_old->'items', '[]'::jsonb)) item
   )
   order by id
   for update;

  -- Annule d'abord l'impact exact de l'ancienne commande. Toute erreur plus
  -- bas annule automatiquement ces changements grâce à la transaction SQL.
  for v_item in select value from jsonb_array_elements(coalesce(v_old->'items', '[]'::jsonb)) loop
    v_qty := greatest(0, coalesce((v_item->>'qty')::integer, 0));
    select data into v_prod from public.products where id = v_item->>'id' for update;
    if not found then raise exception 'Produit de commande introuvable : %', v_item->>'id'; end if;
    v_field := case when v_prod ? 'variants' then 'variants' else 'sizes' end;
    v_key := coalesce(v_item->>'variant', v_item->>'size', '');
    if not (v_prod->v_field) ? v_key then
      if v_key = '' and (v_prod->v_field) ? 'TU' then v_key := 'TU';
      elsif v_key = 'TU' and (v_prod->v_field) ? '' then v_key := '';
      else raise exception 'Variante de commande introuvable : %', v_key;
      end if;
    end if;
    v_stock := coalesce((v_prod->v_field->v_key->>'s')::integer, 0);
    v_reserved := coalesce((v_prod->v_field->v_key->>'r')::integer, 0);
    if v_old_reserved then
      if v_reserved < v_qty then raise exception 'Réservation incohérente pour %', v_item->>'id'; end if;
      v_reserved := v_reserved - v_qty;
    elsif v_old_status <> 'CANCELLED' then
      v_stock := v_stock + v_qty;
    end if;
    v_prod := jsonb_set(v_prod, array[v_field, v_key], jsonb_build_object('s', v_stock, 'r', v_reserved), true);
    update public.products set data = v_prod, updated_at = now() where id = v_item->>'id';
  end loop;

  -- Les lignes autorisées proviennent obligatoirement de la commande
  -- originale. Le navigateur peut en retirer, mais pas injecter un produit,
  -- un prix ou une quantité arbitraires.
  for v_item in select value from jsonb_array_elements(payload->'items') loop
    select value into v_old_item
      from jsonb_array_elements(coalesce(v_old->'items', '[]'::jsonb))
     where value->>'id' = v_item->>'id'
       and coalesce(value->>'variant', value->>'size', '') = coalesce(v_item->>'variant', v_item->>'size', '')
     limit 1;
    if v_old_item is null then raise exception 'Article non autorisé dans la commande'; end if;
    v_qty := greatest(0, coalesce((v_item->>'qty')::integer, 0));
    if v_qty = 0 or v_qty > coalesce((v_old_item->>'qty')::integer, 0) then
      raise exception 'Quantité de commande invalide';
    end if;
    v_old_item := jsonb_set(v_old_item, '{qty}', to_jsonb(v_qty), true);
    v_lines := v_lines || v_old_item;
    v_subtotal := v_subtotal + coalesce((v_old_item->>'price')::integer, 0) * v_qty;

    select data into v_prod from public.products where id = v_old_item->>'id' for update;
    v_field := case when v_prod ? 'variants' then 'variants' else 'sizes' end;
    v_key := coalesce(v_old_item->>'variant', v_old_item->>'size', '');
    if not (v_prod->v_field) ? v_key then
      if v_key = '' and (v_prod->v_field) ? 'TU' then v_key := 'TU';
      elsif v_key = 'TU' and (v_prod->v_field) ? '' then v_key := '';
      else raise exception 'Variante de commande introuvable : %', v_key;
      end if;
    end if;
    v_stock := coalesce((v_prod->v_field->v_key->>'s')::integer, 0);
    v_reserved := coalesce((v_prod->v_field->v_key->>'r')::integer, 0);
    if v_new_reserved then
      if v_stock - v_reserved < v_qty then raise exception 'Stock insuffisant pour %', v_old_item->>'name'; end if;
      v_reserved := v_reserved + v_qty;
    elsif v_new_status <> 'CANCELLED' then
      if v_stock - v_reserved < v_qty then raise exception 'Stock insuffisant pour %', v_old_item->>'name'; end if;
      v_stock := v_stock - v_qty;
    end if;
    v_prod := jsonb_set(v_prod, array[v_field, v_key], jsonb_build_object('s', v_stock, 'r', v_reserved), true);
    update public.products set data = v_prod, updated_at = now() where id = v_old_item->>'id';
  end loop;

  select coalesce((data->>'deliveryFee')::integer, 0), coalesce((data->>'freeFrom')::integer, 0)
    into v_delivery, v_freefrom from public.settings where id = 1;
  if v_freefrom > 0 and v_subtotal >= v_freefrom then v_delivery := 0; end if;

  v_result := v_old || jsonb_build_object(
    'client', trim(coalesce(payload->>'client', v_old->>'client')),
    'phone', regexp_replace(coalesce(payload->>'phone', v_old->>'phone'), '\D', '', 'g'),
    'quartier', trim(coalesce(payload->>'quartier', v_old->>'quartier')),
    'items', v_lines,
    'subtotal', v_subtotal,
    'delivery', coalesce(v_delivery, 0),
    'total', v_subtotal + coalesce(v_delivery, 0),
    'status', v_new_status,
    'stockReserved', v_new_reserved
  );
  if length(v_result->>'client') < 2 or length(v_result->>'phone') < 8 or length(v_result->>'quartier') < 2 then
    raise exception 'Coordonnées de livraison invalides';
  end if;
  update public.orders set data = v_result where ref = v_ref;
  return v_result;
end;
$$;

create or replace function public.admin_delete_order(order_ref text)
returns boolean
language plpgsql
security definer
set search_path to 'public'
as $$
declare v_order jsonb;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;
  select data into v_order from public.orders where ref = order_ref for update;
  if not found then raise exception 'Commande introuvable'; end if;
  perform public.admin_save_order(jsonb_set(v_order, '{status}', '"CANCELLED"'::jsonb, true));
  delete from public.orders where ref = order_ref;
  return true;
end;
$$;

-- Réservations orphelines : du stock immobilisé par une commande qui
-- n'existe plus. Une commande effacée hors de l'application, une base
-- restaurée à mi-chemin, et des paires deviennent invendables sans que
-- rien ne le signale. `set_inventory` refuse d'y toucher — c'est voulu,
-- il ne doit jamais libérer une quantité promise à un client. Cette
-- fonction recalcule donc chaque réservation à partir des commandes
-- réellement en attente : elle ne devine rien, elle recompte.
create or replace function public.rebuild_reservations()
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_product record;
  v_field text;
  v_key text;
  v_value jsonb;
  v_merged jsonb;
  v_reserved integer;
  v_corrections jsonb := '[]'::jsonb;
begin
  if not public.is_admin() then raise exception 'Accès administrateur requis'; end if;

  for v_product in select id, data from public.products for update loop
    v_merged := '{}'::jsonb;
    -- Les anciennes fiches portent encore `sizes`. Ne jamais leur ajouter
    -- un `variants` vide : `place_order` le choisirait alors et la paire
    -- deviendrait impossible à commander.
    v_field := case when v_product.data ? 'variants' then 'variants' else 'sizes' end;

    for v_key, v_value in
      select key, value from jsonb_each(coalesce(v_product.data->v_field, '{}'::jsonb))
    loop
      select coalesce(sum((item->>'qty')::integer), 0) into v_reserved
      from public.orders o,
           lateral jsonb_array_elements(coalesce(o.data->'items', '[]'::jsonb)) item
      where o.data->>'status' = 'PENDING'
        and coalesce(o.data->>'stockReserved', 'true') = 'true'
        and item->>'id' = v_product.id
        and coalesce(item->>'variant', '') = v_key;

      if v_reserved <> coalesce((v_value->>'r')::integer, 0) then
        v_corrections := v_corrections || jsonb_build_object(
          'product_id', v_product.id,
          'variant', v_key,
          'avant', coalesce((v_value->>'r')::integer, 0),
          'apres', v_reserved
        );
      end if;

      v_merged := v_merged || jsonb_build_object(
        v_key,
        jsonb_build_object('s', greatest(0, coalesce((v_value->>'s')::integer, 0)), 'r', v_reserved)
      );
    end loop;

    update public.products
    set data = jsonb_set(v_product.data, array[v_field], v_merged, true), updated_at = now()
    where id = v_product.id;
  end loop;

  return jsonb_build_object('corrections', v_corrections);
end;
$$;

grant execute on function public.publish_store(uuid, integer) to authenticated;
grant execute on function public.save_admin_draft(uuid, integer, jsonb, boolean) to authenticated;
grant execute on function public.restore_revision_as_draft(uuid, integer) to authenticated;
grant execute on function public.set_inventory(text, jsonb) to authenticated;
grant execute on function public.set_product_visibility(text, boolean) to authenticated;
grant execute on function public.archive_product(text) to authenticated;
grant execute on function public.admin_save_order(jsonb) to authenticated;
grant execute on function public.admin_delete_order(text) to authenticated;
grant execute on function public.rebuild_reservations() to authenticated;
revoke execute on function public.save_admin_draft(uuid, integer, jsonb, boolean) from public, anon;
revoke execute on function public.publish_store(uuid, integer) from public, anon;
revoke execute on function public.restore_revision_as_draft(uuid, integer) from public, anon;
revoke execute on function public.set_inventory(text, jsonb) from public, anon;
revoke execute on function public.set_product_visibility(text, boolean) from public, anon;
revoke execute on function public.archive_product(text) from public, anon;
revoke execute on function public.admin_save_order(jsonb) from public, anon;
revoke execute on function public.admin_delete_order(text) from public, anon;
revoke execute on function public.rebuild_reservations() from public, anon;

-- ---------- Passage de commande (transaction serveur) ----------
-- Résout trois problèmes que le navigateur ne peut pas résoudre seul :
--   1. les prix sont relus depuis la table `products` (pas de manipulation
--      des montants depuis la console) ;
--   2. le stock est vérifié de façon atomique ; une demande WhatsApp ne le
--      bloque pas avant confirmation par le commerçant ;
--   3. la référence vient d'une séquence serveur (pas de collision entre
--      appareils, donc pas d'écrasement de commande).
create or replace function public.place_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_client   text := trim(coalesce(payload->>'client', ''));
  v_phone    text := regexp_replace(coalesce(payload->>'phone', ''), '\D', '', 'g');
  v_quartier text := trim(coalesce(payload->>'quartier', ''));
  v_items    jsonb := coalesce(payload->'items', '[]'::jsonb);
  v_item     jsonb;
  v_prod     jsonb;
  v_key      text;
  v_champ    text;
  v_lib      text;
  v_suffixe  text;
  v_brand    text;
  v_colls    jsonb;
  v_qty      int;
  v_avail    int;
  v_price    int;
  v_lines    jsonb := '[]'::jsonb;
  v_subtotal int := 0;
  v_delivery int;
  v_freefrom int;
  v_ref      text;
  v_order    jsonb;
begin
  if length(v_client) < 2 then
    raise exception 'Nom du client invalide' using errcode = '22023';
  end if;
  if length(v_phone) < 8 then
    raise exception 'Numéro de téléphone invalide' using errcode = '22023';
  end if;
  -- Même si le formulaire est appelé directement, un numéro ne peut pas
  -- créer une rafale de demandes. La limite globale borne aussi l'écriture
  -- en base en cas de robots qui inventent des numéros.
  perform public.enforce_public_rate_limit('order-phone', md5(v_phone), 3, interval '30 minutes');
  perform public.enforce_public_rate_limit('order-global', md5('all'), 120, interval '1 hour');
  if length(v_quartier) < 2 then
    raise exception 'Quartier de livraison invalide' using errcode = '22023';
  end if;
  if jsonb_array_length(v_items) = 0 or jsonb_array_length(v_items) > 50 then
    raise exception 'Panier vide ou trop volumineux' using errcode = '22023';
  end if;

  -- Les marques vivent dans les réglages. Lues une fois pour la commande
  -- entière : renommer une marque plus tard ne réécrit pas l'historique.
  select coalesce(data->'collections', '[]'::jsonb) into v_colls
    from public.settings where id = 1;
  v_colls := coalesce(v_colls, '[]'::jsonb);

  for v_item in select * from jsonb_array_elements(v_items) loop
    v_qty := greatest(0, coalesce((v_item->>'qty')::int, 0));
    if v_qty = 0 then
      continue;
    end if;

    select data into v_prod
      from public.products
     where id = v_item->>'id'
       for update;

    if v_prod is null then
      raise exception 'Produit introuvable : %', v_item->>'id' using errcode = '22023';
    end if;
    if coalesce((v_prod->>'active')::boolean, false) is not true then
      raise exception 'Produit indisponible : %', v_prod->>'name' using errcode = '22023';
    end if;

    -- Le champ de stock dépend du modèle du produit, pas de celui du client :
    -- `variants` pour le modèle à deux axes, `sizes` pour les produits créés
    -- avant lui. Les deux cohabitent sans réécriture de la base.
    v_champ := case when v_prod ? 'variants' then 'variants' else 'sizes' end;

    -- La clé arrive sous « variant » (modèle neuf) ou « size » (ancien).
    v_key := coalesce(v_item->>'variant', v_item->>'size', '');
    -- Un produit sans axe porte la clé vide ; un ancien produit à taille
    -- unique la porte sous « TU ». On rattrape les deux sens.
    if not (v_prod->v_champ) ? v_key then
      if v_key = '' and (v_prod->v_champ) ? 'TU' then
        v_key := 'TU';
      elsif v_key = 'TU' and (v_prod->v_champ) ? '' then
        v_key := '';
      else
        raise exception 'Variante indisponible : % (%)', v_prod->>'name', v_key
          using errcode = '22023';
      end if;
    end if;

    v_avail := coalesce((v_prod->v_champ->v_key->>'s')::int, 0)
             - coalesce((v_prod->v_champ->v_key->>'r')::int, 0);
    if v_avail < v_qty then
      v_suffixe := case when v_key = '' then '' else ' (' || v_key || ')' end;
      raise exception 'Stock insuffisant : %', (v_prod->>'name') || v_suffixe
        using errcode = '22023';
    end if;

    -- Marque du produit, résolue par sa clé de collection. Deux marques
    -- peuvent vendre un modèle du même nom : sans elle, le commerçant ne
    -- sait pas quoi expédier. Dérivée du produit, jamais du navigateur.
    v_brand := '';
    if coalesce(v_prod->>'collection', '') <> '' then
      select coalesce(c->>'label', '') into v_brand
        from jsonb_array_elements(v_colls) as c
       where c->>'key' = v_prod->>'collection'
       limit 1;
      v_brand := coalesce(v_brand, '');
    end if;

    v_price := coalesce((v_prod->>'price')::int, 0);
    v_subtotal := v_subtotal + v_price * v_qty;
    v_lib := coalesce(nullif(v_item->>'variantLabel', ''), nullif(v_key, ''), '');

    v_lines := v_lines || jsonb_build_object(
      'id',           v_prod->>'id',
      'name',         v_prod->>'name',
      'brand',        v_brand,
      'variant',      v_key,
      'variantLabel', v_lib,
      'size',         v_lib,
      'qty',          v_qty,
      'price',        v_price
    );

    -- Une simple demande WhatsApp n'immobilise plus de paire. Le stock est
    -- décrémenté atomiquement uniquement quand le commerçant la confirme via
    -- `admin_save_order`, ce qui empêche un bot de vider le catalogue.
  end loop;

  if jsonb_array_length(v_lines) = 0 then
    raise exception 'Aucune ligne de commande valide' using errcode = '22023';
  end if;

  select coalesce((data->>'deliveryFee')::int, 0),
         coalesce((data->>'freeFrom')::int, 0)
    into v_delivery, v_freefrom
    from public.settings where id = 1;

  v_delivery := coalesce(v_delivery, 0);
  if coalesce(v_freefrom, 0) > 0 and v_subtotal >= v_freefrom then
    v_delivery := 0;
  end if;

  v_ref := 'CMD-' || to_char(now(), 'YYYYMM') || '-' ||
           lpad(nextval('public.order_seq')::text, 4, '0');

  v_order := jsonb_build_object(
    'ref',      v_ref,
    'date',     to_char(now() at time zone 'utc', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'client',   v_client,
    'phone',    v_phone,
    'quartier', v_quartier,
    'items',    v_lines,
    'subtotal', v_subtotal,
    'delivery', v_delivery,
    'total',    v_subtotal + v_delivery,
    'status',   'PENDING',
    'stockReserved', false
  );

  insert into public.orders (ref, data) values (v_ref, v_order);
  return v_order;
end;
$$;
revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;

-- ---------- Données initiales : import du catalogue ----------
-- Après exécution, connecte-toi à `admin.html` avec le compte créé dans
-- Authentication → Users : le catalogue local est envoyé automatiquement
-- en base au premier enregistrement.

-- ---------------------------------------------------------------------------
-- Stockage des images produits
-- ---------------------------------------------------------------------------
-- Bucket public en lecture (les visuels s'affichent en boutique sans session),
-- écriture réservée aux administrateurs explicitement autorisés.

insert into storage.buckets (id, name, public)
values ('produits', 'produits', true)
on conflict (id) do nothing;

drop policy if exists "produits_read_public" on storage.objects;
create policy "produits_read_public" on storage.objects
  for select using (bucket_id = 'produits');

drop policy if exists "produits_write_auth" on storage.objects;
create policy "produits_write_auth" on storage.objects
  for insert to authenticated with check (bucket_id = 'produits' and public.is_admin());

drop policy if exists "produits_update_auth" on storage.objects;
create policy "produits_update_auth" on storage.objects
  for update to authenticated using (bucket_id = 'produits' and public.is_admin())
  with check (bucket_id = 'produits' and public.is_admin());

drop policy if exists "produits_delete_auth" on storage.objects;
create policy "produits_delete_auth" on storage.objects
  for delete to authenticated using (bucket_id = 'produits' and public.is_admin());
