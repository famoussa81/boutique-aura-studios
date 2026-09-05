-- Masque les trois fiches Coach actuellement indisponibles.
-- Les images, variantes et stocks restent intacts pour une réactivation.

begin;
lock table public.products in share row exclusive mode;

insert into public.store_revisions(version,data)
select d.version,jsonb_build_object(
  'settings',coalesce((select data from public.settings where id=1),'{}'::jsonb),
  'products',coalesce((select jsonb_agg(data order by id) from public.products),'[]'::jsonb))
from public.admin_drafts d order by updated_at desc limit 1;

update public.products
set data=jsonb_set(
           jsonb_set(data,'{active}','false'::jsonb,true),
           '{archived}','true'::jsonb,true),
    updated_at=now()
where id in ('coach-badge','coach-signature','coach-mule-boucle');

with latest as (
  select id,data from public.admin_drafts order by updated_at desc limit 1 for update
), refreshed as (
  select d.id,
    jsonb_agg(
      case when e.product->>'id' in
        ('coach-badge','coach-signature','coach-mule-boucle')
        then p.data else e.product end
      order by e.ord) products
  from latest d
  cross join lateral jsonb_array_elements(d.data->'products')
    with ordinality e(product,ord)
  left join public.products p on p.id=e.product->>'id'
  group by d.id
)
update public.admin_drafts d
set data=jsonb_set(d.data,'{products}',r.products),
    version=d.version+1,dirty=false,updated_at=now()
from refreshed r where d.id=r.id;

delete from public.store_revisions
where id not in (
  select id from public.store_revisions order by created_at desc limit 10);
commit;

select id,data->>'name' nom,data->>'active' actif,data->>'archived' archive
from public.products
where id in ('coach-badge','coach-signature','coach-mule-boucle')
order by id;
