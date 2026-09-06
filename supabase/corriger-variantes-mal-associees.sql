-- Corrige les coloris Hermès classés dans le mauvais produit / public.
-- Retire aussi une photo HUGO Relief sans stock, rangée par erreur avec le Monogramme.
begin;

insert into public.store_revisions (version, data)
select d.version + 1, d.data
from public.admin_drafts d
where d.id = '00000000-0000-0000-0000-000000000001';

with source as (
  select data from public.products where id = 'hermes-chypre-nature'
), moved as (
  select
    coalesce(jsonb_object_agg(e.key, e.value) filter (
      where split_part(e.key, '::', 2) in ('Vert olive', 'Vert sapin')
    ), '{}'::jsonb) as green_variants,
    coalesce(jsonb_object_agg(e.key, e.value) filter (
      where split_part(e.key, '::', 2) = 'Taupe clair'
    ), '{}'::jsonb) as taupe_variants
  from source s
  cross join lateral jsonb_each(s.data->'variants') e
), update_women_chypre as (
  update public.products p
  set data = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            p.data,
            '{axes,1,values}',
            (p.data#>'{axes,1,values}') || '["Vert olive","Vert sapin"]'::jsonb
          ),
          '{imgs}',
          (p.data->'imgs') || '["assets/products/homme/hermes-chypre-nature-vert-olive.jpg","assets/products/homme/hermes-chypre-nature-vert-sapin.jpg"]'::jsonb
        ),
        '{valueImages}',
        coalesce(p.data->'valueImages', '{}'::jsonb) || jsonb_build_object(
          'Coloris::Vert olive', 'assets/products/homme/hermes-chypre-nature-vert-olive.jpg',
          'Coloris::Vert sapin', 'assets/products/homme/hermes-chypre-nature-vert-sapin.jpg'
        )
      ),
      '{variants}',
      coalesce(p.data->'variants', '{}'::jsonb) || m.green_variants
    ) || jsonb_build_object(
      'desc', 'La sandale Chypre dans huit nuances féminines, des roses aux verts lumineux.'
    ),
    updated_at = now()
  from moved m
  where p.id = 'femme-hermes-chypre-roses'
    and not ((p.data#>'{axes,1,values}') ? 'Vert olive')
  returning 1
), update_women_oran as (
  update public.products p
  set data = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              p.data,
              '{axes,0,values}',
              (p.data#>'{axes,0,values}') || '["42","43","44","45"]'::jsonb
            ),
            '{axes,1,values}',
            (p.data#>'{axes,1,values}') || '["Taupe clair"]'::jsonb
          ),
          '{imgs}',
          (p.data->'imgs') || '["assets/products/homme/hermes-chypre-nature-taupe-clair.jpg"]'::jsonb
        ),
        '{valueImages}',
        coalesce(p.data->'valueImages', '{}'::jsonb) || jsonb_build_object(
          'Coloris::Taupe clair', 'assets/products/homme/hermes-chypre-nature-taupe-clair.jpg'
        )
      ),
      '{variants}',
      coalesce(p.data->'variants', '{}'::jsonb) || m.taupe_variants
    ) || jsonb_build_object(
      'desc', 'La sandale Oran en cuir et lézard, dans une palette de terre du kaki au taupe.'
    ),
    updated_at = now()
  from moved m
  where p.id = 'femme-hermes-oran-terres'
    and not ((p.data#>'{axes,1,values}') ? 'Taupe clair')
  returning 1
)
update public.products p
set data = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            p.data,
            '{axes,1,values}',
            '["Kaki foncé","Camel"]'::jsonb
          ),
          '{variants}',
          coalesce((
            select jsonb_object_agg(e.key, e.value)
            from jsonb_each(p.data->'variants') e
            where split_part(e.key, '::', 2) in ('Kaki foncé', 'Camel')
          ), '{}'::jsonb)
        ),
        '{valueImages}',
        jsonb_build_object(
          'Coloris::Kaki foncé', 'assets/products/homme/hermes-chypre-nature-kaki-fonce.jpg',
          'Coloris::Camel', 'assets/products/homme/hermes-chypre-nature-camel.jpg'
        )
      ),
      '{imgs}',
      '["assets/products/homme/hermes-chypre-nature-kaki-fonce.jpg","assets/products/homme/hermes-chypre-nature-camel.jpg"]'::jsonb
    ),
    '{img}',
    '"assets/products/homme/hermes-chypre-nature-kaki-fonce.jpg"'::jsonb
  ) || jsonb_build_object(
    'desc', 'La sandale Chypre dans deux tons sobres, kaki foncé et camel.'
  ),
  updated_at = now()
where p.id = 'hermes-chypre-nature';

update public.products p
set data = jsonb_set(
    jsonb_set(
      jsonb_set(
        p.data,
        '{axes,1,values}',
        coalesce((
          select jsonb_agg(v.value order by v.ordinality)
          from jsonb_array_elements_text(p.data#>'{axes,1,values}') with ordinality v(value, ordinality)
          where v.value <> 'Bleu ciel'
        ), '[]'::jsonb)
      ),
      '{imgs}',
      coalesce((
        select jsonb_agg(v.value order by v.ordinality)
        from jsonb_array_elements_text(p.data->'imgs') with ordinality v(value, ordinality)
        where v.value <> 'assets/products/hugo-relief-bleu-studio.webp'
      ), '[]'::jsonb)
    ),
    '{valueImages}',
    coalesce(p.data->'valueImages', '{}'::jsonb) - 'Coloris::Bleu ciel'
  ),
  updated_at = now()
where p.id = 'hg-mono';

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
where d.id = '00000000-0000-0000-0000-000000000001';

commit;
