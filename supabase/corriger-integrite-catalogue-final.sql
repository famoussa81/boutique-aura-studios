begin;

-- Deux galeries contenaient leur image principale deux fois. Le doublon
-- créait une fausse étape dans le carrousel et un compteur trompeur.
update public.products
set data = jsonb_set(
      data,
      '{imgs}',
      '["assets/products/calvin-klein-cadre-gris-studio.webp","assets/products/calvin-klein-cadre-blanc-studio.webp"]'::jsonb
    ),
    updated_at = now()
where id = 'ck-cadre';

-- HUGO était le seul produit actif dont le premier coloris affiché était
-- entièrement indisponible alors qu'un autre coloris avait du stock. Des
-- anciennes clés de variantes (« Noir » / « Blanc et bleu »), absentes de
-- l'axe Coloris, subsistaient aussi. On place le coloris réellement disponible
-- en premier, on retire uniquement ces clés mortes et on déduplique la galerie.
update public.products p
set data = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              p.data,
              '{img}',
              '"assets/products/hugo-typographique-bleu-blanc-studio.webp"'::jsonb
            ),
            '{studio}',
            '"assets/products/hugo-typographique-bleu-blanc-studio.webp"'::jsonb
          ),
          '{imgs}',
          '["assets/products/hugo-typographique-bleu-blanc-studio.webp","assets/products/hugo-repeat-rouge-noir-studio.webp","assets/products/hugo-repeat-noir-blanc-studio.webp","assets/products/hugo-repeat-blanc-studio.webp","assets/products/hugo-script-noir-studio.webp"]'::jsonb
        ),
        '{axes,1,values}',
        '["Bleu et blanc","Noir et rouge","Noir et blanc","Blanc et noir","Script noir"]'::jsonb
      ),
      '{variants}',
      coalesce((
        select jsonb_object_agg(v.key, v.value)
        from jsonb_each(p.data->'variants') v
        where split_part(v.key, '::', 2) in
          ('Bleu et blanc', 'Noir et rouge', 'Noir et blanc', 'Blanc et noir', 'Script noir')
      ), '{}'::jsonb)
    ),
    updated_at = now()
where p.id = 'hg-mono';

-- Le dashboard doit toujours relire exactement les mêmes produits que la
-- boutique publiée.
update public.admin_drafts d
set data = jsonb_set(
      d.data,
      '{products}',
      coalesce((
        select jsonb_agg(coalesce(p.data, item.product) order by item.ordinality)
        from jsonb_array_elements(d.data->'products') with ordinality item(product, ordinality)
        left join public.products p on p.id = item.product->>'id'
      ), '[]'::jsonb)
    ),
    version = d.version + 1,
    dirty = false,
    updated_at = now()
where d.id = (
  select id from public.admin_drafts order by updated_at desc limit 1
);

commit;
