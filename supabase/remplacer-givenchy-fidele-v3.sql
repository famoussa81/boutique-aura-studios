-- Remplace toutes les générations Givenchy actives par la série fidèle V3.
-- Prix, audience, variantes, stocks et identifiant restent intacts.

begin;

insert into public.store_revisions(version, data)
select version + 1, data
from public.admin_drafts
where id = '00000000-0000-0000-0000-000000000001';

update public.products
set data = replace(
        replace(
          replace(
            replace(data::text,
              'assets/products/givenchy-logo-noir-studio-v2.webp',
              'assets/products/givenchy-logo-noir-studio-v3.webp'),
            'assets/products/givenchy-logo-blanc-studio-v2.webp',
            'assets/products/givenchy-logo-blanc-studio-v3.webp'),
          'assets/products/givenchy-logo-gris-studio-v2.webp',
          'assets/products/givenchy-logo-gris-studio-v3.webp'),
        'assets/products/givenchy-logo-kaki-studio-v2.webp',
        'assets/products/givenchy-logo-kaki-studio-v3.webp')::jsonb,
    updated_at = now()
where id = 'gv-paris';

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

select id, data->>'audience' audience, data->'imgs' images,
       data->'valueImages' "valueImages"
from public.products
where id = 'gv-paris';
