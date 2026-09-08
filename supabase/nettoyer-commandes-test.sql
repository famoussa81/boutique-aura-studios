-- ============================================================
-- Nettoyage avant livraison au propriétaire — 2026-09-08
-- ------------------------------------------------------------
-- Efface les 20 commandes de test passées entre le 24 août et le
-- 8 septembre 2026, remet le compteur de références à zéro, et
-- retire les deux entrées de test des listes de contacts.
--
-- Sauvegarde préalable : tmp/sauvegarde-commandes-test-20260908.json
--
-- À exécuter dans Supabase → SQL Editor, en une seule fois.
-- ============================================================

begin;

-- 1. Les commandes. Aucune réservation de stock n'était en cours
--    (toutes les variantes ont r = 0), donc la suppression ne laisse
--    pas de paires bloquées derrière elle. Le contrôle est fait plus
--    bas et fera échouer la transaction si ce n'était plus vrai.
do $$
declare v_reserve integer;
begin
  select coalesce(sum((v.value->>'r')::int), 0) into v_reserve
  from public.products p, jsonb_each(coalesce(p.data->'variants', '{}'::jsonb)) v;

  if v_reserve > 0 then
    raise exception
      'Arrêt : % unités sont réservées par des commandes en attente. Traiter ces commandes avant de nettoyer.',
      v_reserve;
  end if;
end $$;

delete from public.orders;

-- 2. Le compteur de références. Sans cette remise à zéro, la première
--    vraie commande du propriétaire porterait le numéro 0028 et
--    laisserait deviner les 27 essais qui l'ont précédée.
alter sequence public.order_seq restart with 1;

-- 3. Les contacts de test. L'abonnée bettysissoko6@icloud.com est
--    conservée : elle ressemble à une inscription réelle et rien ne
--    permet d'affirmer le contraire.
delete from public.subscribers where email = 'test-technique@example.com';
delete from public.waitlist where phone = '76000001';

-- 4. Contrôle final.
select
  (select count(*) from public.orders)      as commandes_restantes,
  (select count(*) from public.subscribers) as abonnes_restants,
  (select count(*) from public.waitlist)    as attente_restante,
  (select last_value from public.order_seq) as prochain_numero;

commit;
