-- Adopte la photo Diesel fidèle à la référence physique.
-- Conserve le stock en renommant aussi les clés de variantes du coloris.

begin;

insert into public.store_revisions(version,data)
select version + 1, data
from public.admin_drafts
where id = '00000000-0000-0000-0000-000000000001';

update public.products p
set data = jsonb_set(
      jsonb_set(
        jsonb_set(
          replace(p.data::text,
            'assets/products/diesel-camo-noir-studio-v2.webp',
            'assets/products/diesel-camo-clair-studio-v3.webp')::jsonb,
          '{axes,1,values}',
          (
            select jsonb_agg(case when value = '"Camouflage noir"'::jsonb
                                  then '"Camouflage clair"'::jsonb else value end)
            from jsonb_array_elements(p.data->'axes'->1->'values')
          )
        ),
        '{valueImages}',
        (coalesce(p.data->'valueImages', '{}'::jsonb) - 'Coloris::Camouflage noir') ||
        jsonb_build_object('Coloris::Camouflage clair',
          'assets/products/diesel-camo-clair-studio-v3.webp')
      ),
      '{variants}',
      coalesce((
        select jsonb_object_agg(
          replace(v.key, '::Camouflage noir', '::Camouflage clair'), v.value)
        from jsonb_each(coalesce(p.data->'variants', '{}'::jsonb)) v
      ), '{}'::jsonb)
    ),
    updated_at = now()
where p.id = 'diesel-relief';

update public.admin_drafts d
set data = jsonb_set(
      d.data,
      '{products}',
      coalesce((
        select jsonb_agg(coalesce(p.data, e.product) order by e.ord)
        from jsonb_array_elements(d.data->'products') with ordinality e(product, ord)
        left join public.products p on p.id = e.product->>'id'
      ), '[]'::jsonb)
    ),
    version = d.version + 1,
    dirty = false,
    updated_at = now()
where d.id = '00000000-0000-0000-0000-000000000001';

commit;

select data->'axes'->1->'values' coloris, data->'valueImages' images,
       data->'variants' variants
from public.products
where id = 'diesel-relief';
