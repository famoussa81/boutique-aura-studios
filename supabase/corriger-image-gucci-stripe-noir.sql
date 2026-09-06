-- Remplace uniquement l'image noire de gucci-stripe par la version à semelle corrigée.
begin;

insert into public.store_revisions(version, data)
select version + 1, data
from public.admin_drafts
where id = '00000000-0000-0000-0000-000000000001';

update public.products
set data = replace(
      data::text,
      'assets/products/gucci-stripe-noir-studio.webp',
      'assets/products/gucci-stripe-noir-studio-v2.webp'
    )::jsonb,
    updated_at = now()
where id = 'gucci-stripe'
  and data::text like '%assets/products/gucci-stripe-noir-studio.webp%';

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
