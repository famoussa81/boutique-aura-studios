-- Classe toutes les fiches Coach exclusivement dans l'univers Femme.
-- Ne modifie ni prix, ni images, ni variantes, ni stocks.

begin;

insert into public.store_revisions(version,data)
select version + 1, data
from public.admin_drafts
where id = '00000000-0000-0000-0000-000000000001';

update public.products
set data = jsonb_set(data, '{audience}', '"femme"'::jsonb, true),
    updated_at = now()
where lower(coalesce(data->>'collection', '')) = 'coach'
  and coalesce(data->>'audience', '') <> 'femme';

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

select id, data->>'name' name, data->>'audience' audience,
       data->'axes'->1->'values' coloris
from public.products
where lower(coalesce(data->>'collection', '')) = 'coach'
order by id;
