-- Remplace les dernières générations faibles et rétablit Givenchy chez Homme.
-- Prix, variantes, stocks et identifiants restent intacts.

begin;

insert into public.store_revisions(version,data)
select version + 1, data
from public.admin_drafts
where id = '00000000-0000-0000-0000-000000000001';

update public.products
set data = replace(
        replace(
        replace(
          replace(
            replace(
              replace(data::text,
                'assets/products/givenchy-logo-noir-studio.webp?v=20260905-wave',
                'assets/products/givenchy-logo-noir-studio-v2.webp'),
              'assets/products/givenchy-logo-blanc-studio.webp?v=20260905-wave',
              'assets/products/givenchy-logo-blanc-studio-v2.webp'),
            'assets/products/givenchy-logo-gris-studio.webp?v=20260905-wave',
            'assets/products/givenchy-logo-gris-studio-v2.webp'),
          'assets/products/givenchy-logo-kaki-studio.webp?v=20260905-wave',
          'assets/products/givenchy-logo-kaki-studio-v2.webp'),
        'assets/products/diesel-camo-noir-studio.webp',
        'assets/products/diesel-camo-noir-studio-v2.webp')::jsonb,
    updated_at = now()
where id in ('gv-paris', 'diesel-relief');

update public.products
set data = jsonb_set(data, '{audience}', '"homme"'::jsonb, true),
    updated_at = now()
where lower(coalesce(data->>'collection', '')) = 'givenchy';

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

select id, data->>'collection' marque, data->>'audience' audience,
       data->'imgs' images
from public.products
where id in ('gv-paris', 'diesel-relief')
order by id;
