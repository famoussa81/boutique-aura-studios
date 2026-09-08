-- ============================================================
-- Resynchronisation du brouillon d'administration — 2026-09-08
-- ------------------------------------------------------------
-- Le brouillon du dashboard avait divergé de la production : des
-- corrections ont été appliquées directement en base par des scripts
-- SQL, sans repasser par le dashboard. Le brouillon a donc conservé
-- des valeurs périmées que la prochaine publication aurait remises
-- en ligne.
--
-- Ce que la publication aurait fait, si personne n'avait regardé :
--
--   * `femme-coach-double-bride-rose` (Sandale Double Bride rose),
--     `coach-slide-signature-noir` et `hermes-chypre-vives` seraient
--     repassés en « Épuisé » — `stockout` vaut true dans le brouillon,
--     false en ligne. Trois paires en vente disparaissent du parcours
--     d'achat, dont celle dont le prix vient d'être baissé.
--
--   * `exchangeTime` serait repassé de vide à « 48h », ressuscitant une
--     promesse d'échange retirée volontairement (commit « remplacer la
--     promesse d'echange »). Un engagement commercial republié sans
--     que personne ne l'ait demandé.
--
--   * `axes` de `hermes-chypre-vives` serait remplacé par une version
--     antérieure, avec le risque de désaligner les variantes.
--
-- `publish_store` protège déjà `variants`, `active` et `archived` d'un
-- brouillon périmé — c'est voulu et bien fait. `stockout`, `axes` et les
-- réglages ne bénéficient pas de cette protection : d'où ce correctif.
--
-- Le brouillon est marqué `dirty = false`, donc aucun travail en cours
-- n'est perdu. La garde ci-dessous interrompt tout s'il ne l'était plus.
--
-- À exécuter dans Supabase → SQL Editor, en une seule fois.
-- ============================================================

begin;

do $$
declare v_dirty boolean;
begin
  select dirty into v_dirty from public.admin_drafts limit 1;
  if v_dirty then
    raise exception
      'Arrêt : le brouillon porte des modifications non publiées. Les publier ou les abandonner depuis le dashboard avant de resynchroniser.';
  end if;
end $$;

update public.admin_drafts
   set data = jsonb_build_object(
         'settings', (select data from public.settings where id = 1),
         'products', (select coalesce(jsonb_agg(data order by id), '[]'::jsonb) from public.products)
       ),
       -- Invalide les anciennes copies locales. Sans changement de version,
       -- un navigateur qui avait gardé dirty=true peut renvoyer son vieux
       -- brouillon dès la connexion et annuler silencieusement ce correctif.
       version = version + 1,
       dirty = false,
       updated_at = now();

-- Contrôle : les trois compteurs doivent être à zéro.
with b as (
  select e->>'id' as id, e as data
    from public.admin_drafts, jsonb_array_elements(data->'products') e
)
select
  (select count(*) from b join public.products p using (id) where b.data <> p.data) as produits_divergents,
  (select count(*) from b where id not in (select id from public.products))         as en_brouillon_seulement,
  (select count(*) from public.products where id not in (select id from b))         as en_ligne_seulement,
  ((select data->'settings' from public.admin_drafts)
     = (select data from public.settings where id = 1))                             as reglages_identiques;

commit;
