-- ============================================================
-- SNEAK BAMAKO — Identité visuelle par marque
-- Colle ce bloc dans Supabase → SQL Editor puis clic "Run".
--
-- Donne à chaque marque sa couleur et son motif de couverture.
-- Rejouable : seuls les champs accent et cover sont touchés, le
-- reste des réglages reste intact.
-- ============================================================

update public.settings set data = jsonb_set(
  data,
  '{collections}',
  (
    select jsonb_agg(
      case when identite.cle is null then marque
           else marque
                || jsonb_build_object('accent', identite.accent)
                || jsonb_build_object('cover', identite.cover)
      end
      order by ordre
    )
    from jsonb_array_elements(data->'collections') with ordinality as t(marque, ordre)
    left join (values
      ('calvin-klein','#2E3A46','assets/marques/calvin-klein.svg'),
      ('louis-vuitton','#6B4F2A','assets/marques/louis-vuitton.svg'),
      ('hermes','#D86F25','assets/marques/hermes.svg'),
      ('burberry','#B08A5E','assets/marques/burberry.svg'),
      ('givenchy','#4A3B52','assets/marques/givenchy.svg'),
      ('dior','#5B6B7A','assets/marques/dior.svg'),
      ('balenciaga','#111111','assets/marques/balenciaga.svg'),
      ('hugo','#A3262B','assets/marques/hugo.svg'),
      ('tommy-jeans','#1C3A6E','assets/marques/tommy-jeans.svg'),
      ('moncler','#2F7FC4','assets/marques/moncler.svg'),
      ('ea7','#5D7A8C','assets/marques/ea7.svg'),
      ('allsaints','#6E6459','assets/marques/allsaints.svg')
    ) as identite(cle, accent, cover) on identite.cle = marque->>'key'
  ),
  false
), updated_at = now()
where id = 1;

-- Vérification : chaque marque doit afficher sa propre couleur et son motif.
select marque->>'key' as marque,
       marque->>'accent' as couleur,
       marque->>'cover' as motif
from public.settings, jsonb_array_elements(data->'collections') as marque
where id = 1;
