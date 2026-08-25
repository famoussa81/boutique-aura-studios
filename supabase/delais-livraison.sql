-- Délais de livraison : Homme « 5 jours », Femme « 10 jours ».
--
-- Le site lit ses réglages dans Supabase, pas dans catalog.js : les valeurs
-- écrites ici sont celles que le client voit. Elles annonçaient « 24h » pour
-- le rayon Homme, un reste de l'époque où la boutique ne vendait que du stock
-- présent sur place. Promettre un délai intenable coûte plus cher qu'un délai
-- honnête : un client déçu à la première commande ne repasse pas.
--
-- Ce script met à jour la table publiée ET le brouillon de l'administration,
-- pour qu'une publication ultérieure depuis le tableau de bord ne réintroduise
-- pas les anciens chiffres.
--
-- À exécuter dans Supabase : SQL Editor, coller, Run.

begin;

-- 1. Réglages publiés (ce que voient les clients)
update settings
set data = jsonb_set(
             jsonb_set(
               jsonb_set(data, '{deliveryTime}', '"5 jours"'::jsonb),
               '{audiencePages,femme,deliveryTime}', '"10 jours"'::jsonb),
             '{content,editorial,pillars}',
             coalesce((
               select jsonb_agg(
                 case when p->>'title' = 'Livraison rapide'
                      then jsonb_set(p, '{text}', to_jsonb(
                             'Bamako sous 5 jours, paiement à la réception. Vous ne payez rien à l''avance.'::text))
                      else p end
                 order by ord)
               from jsonb_array_elements(data->'content'->'editorial'->'pillars')
                    with ordinality as t(p, ord)),
               data->'content'->'editorial'->'pillars')),
    updated_at = now();

-- 2. Brouillon de l'administration (même contenu, sinon il écrase à la
--    prochaine publication)
update admin_drafts
set data = jsonb_set(
             jsonb_set(
               jsonb_set(data, '{settings,deliveryTime}', '"5 jours"'::jsonb),
               '{settings,audiencePages,femme,deliveryTime}', '"10 jours"'::jsonb),
             '{settings,content,editorial,pillars}',
             coalesce((
               select jsonb_agg(
                 case when p->>'title' = 'Livraison rapide'
                      then jsonb_set(p, '{text}', to_jsonb(
                             'Bamako sous 5 jours, paiement à la réception. Vous ne payez rien à l''avance.'::text))
                      else p end
                 order by ord)
               from jsonb_array_elements(data->'settings'->'content'->'editorial'->'pillars')
                    with ordinality as t(p, ord)),
               data->'settings'->'content'->'editorial'->'pillars')),
    updated_at = now();

-- 3. Vérification
select data->>'deliveryTime'                                 as homme,
       data->'audiencePages'->'femme'->>'deliveryTime'       as femme,
       data->'content'->'editorial'->'pillars'               as piliers
from settings;

commit;
