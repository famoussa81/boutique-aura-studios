-- Ajoute le coloris Bordeaux noir à la Claquette Vintage Check existante.
-- Idempotent : les stocks déjà modifiés dans le dashboard sont conservés.

begin;
lock table public.products in share row exclusive mode;

insert into public.store_revisions(version,data)
select d.version,jsonb_build_object(
  'settings',coalesce((select data from public.settings where id=1),'{}'::jsonb),
  'products',coalesce((select jsonb_agg(data order by id) from public.products),'[]'::jsonb))
from public.admin_drafts d order by updated_at desc limit 1;

update public.products
set data=(
  with base as (
    select case
      when data->'axes'->1->'values' ? 'Bordeaux noir' then data
      else jsonb_insert(data,'{axes,1,values,1}','"Bordeaux noir"'::jsonb,true)
    end d
  ), gallery as (
    select case
      when d->'imgs' ? 'assets/products/burberry-check-bordeaux-noir-studio.jpg' then d
      else jsonb_set(d,'{imgs}',(d->'imgs') ||
        '["assets/products/burberry-check-bordeaux-noir-studio.jpg"]'::jsonb,true)
    end d from base
  ), mapped as (
    select jsonb_set(d,'{valueImages,Coloris::Bordeaux noir}',
      '"assets/products/burberry-check-bordeaux-noir-studio.jpg"'::jsonb,true) d
    from gallery
  ), stocked as (
    select jsonb_set(d,'{variants}',
      jsonb_build_object(
        '39::Bordeaux noir',jsonb_build_object('s',3,'r',0),
        '40::Bordeaux noir',jsonb_build_object('s',3,'r',0),
        '41::Bordeaux noir',jsonb_build_object('s',3,'r',0),
        '42::Bordeaux noir',jsonb_build_object('s',3,'r',0),
        '43::Bordeaux noir',jsonb_build_object('s',3,'r',0),
        '44::Bordeaux noir',jsonb_build_object('s',3,'r',0),
        '45::Bordeaux noir',jsonb_build_object('s',3,'r',0)) || (d->'variants'),true) d
    from mapped
  )
  select jsonb_set(d,'{desc}',
    to_jsonb('Claquette à bride imprimée carreaux, déclinée en cinq associations faciles à porter.'::text),true)
  from stocked),
  updated_at=now()
where id='bb-check';

with latest as (
  select id,data from public.admin_drafts order by updated_at desc limit 1 for update
), refreshed as (
  select d.id,jsonb_agg(
    case when e.product->>'id'='bb-check' then p.data else e.product end
    order by e.ord) products
  from latest d
  cross join lateral jsonb_array_elements(d.data->'products')
    with ordinality e(product,ord)
  left join public.products p on p.id=e.product->>'id'
  group by d.id
)
update public.admin_drafts d
set data=jsonb_set(d.data,'{products}',r.products,true),
    version=d.version+1,dirty=false,updated_at=now()
from refreshed r where d.id=r.id;

delete from public.store_revisions
where id not in (select id from public.store_revisions order by created_at desc limit 10);
commit;

select id,data->'axes'->1->'values' coloris,
       data->'valueImages'->>'Coloris::Bordeaux noir' image
from public.products where id='bb-check';
