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

-- Inscription newsletter : ouverte, mais la liste n'est lisible que par l'admin.
create policy "subscribers_insert_public" on public.subscribers
  for insert with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$' and length(email) <= 254
  );

create policy "subscribers_read_auth" on public.subscribers
  for select using (auth.role() = 'authenticated');

-- Liste d'attente : inscription ouverte (numéro malien uniquement),
-- lecture réservée à l'administration.
create policy "waitlist_insert_public" on public.waitlist
  for insert with check (
    phone ~ '^[0-9]{8}$'
    and length(product_id) between 1 and 64
    and length(product_name) between 1 and 200
    and size in ('S','M','L','XL','XXL','TU')
  );

create policy "waitlist_read_auth" on public.waitlist
  for select using (auth.role() = 'authenticated');

-- Administration : écriture réservée aux utilisateurs authentifiés
create policy "products_write_auth" on public.products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "settings_write_auth" on public.settings
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "orders_read_auth" on public.orders
  for select using (auth.role() = 'authenticated');

create policy "orders_write_auth" on public.orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- Passage de commande (transaction serveur) ----------
-- Résout trois problèmes que le navigateur ne peut pas résoudre seul :
--   1. les prix sont relus depuis la table `products` (pas de manipulation
--      des montants depuis la console) ;
--   2. le stock est vérifié puis réservé de façon atomique (pas de survente
--      quand deux clients commandent le dernier article en même temps) ;
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

    update public.products
       set data = jsonb_set(
             data,
             array[v_champ, v_key, 'r'],
             to_jsonb(coalesce((data->v_champ->v_key->>'r')::int, 0) + v_qty)
           ),
           updated_at = now()
     where id = v_prod->>'id';
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
    'status',   'PENDING'
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
-- écriture réservée aux comptes authentifiés (l'administration).

insert into storage.buckets (id, name, public)
values ('produits', 'produits', true)
on conflict (id) do nothing;

drop policy if exists "produits_read_public" on storage.objects;
create policy "produits_read_public" on storage.objects
  for select using (bucket_id = 'produits');

drop policy if exists "produits_write_auth" on storage.objects;
create policy "produits_write_auth" on storage.objects
  for insert to authenticated with check (bucket_id = 'produits');

drop policy if exists "produits_update_auth" on storage.objects;
create policy "produits_update_auth" on storage.objects
  for update to authenticated using (bucket_id = 'produits');

drop policy if exists "produits_delete_auth" on storage.objects;
create policy "produits_delete_auth" on storage.objects
  for delete to authenticated using (bucket_id = 'produits');
