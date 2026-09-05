-- Ajoute les deux nouvelles familles Coach sans dupliquer la Matelassee C.
-- Les prix sont des prix de lancement modifiables depuis le dashboard.

begin;
lock table public.products in share row exclusive mode;

insert into public.store_revisions(version,data)
select d.version,jsonb_build_object(
  'settings',coalesce((select data from public.settings where id=1),'{}'::jsonb),
  'products',coalesce((select jsonb_agg(data order by id) from public.products),'[]'::jsonb))
from public.admin_drafts d order by updated_at desc limit 1;

with definitions(id,data) as (
  values
  ('coach-petit-badge-signature', jsonb_build_object(
    'id','coach-petit-badge-signature',
    'cat','claquettes',
    'img','assets/products/femme/coach-petit-badge-taupe-studio.jpg',
    'axes',jsonb_build_array(
      jsonb_build_object('name','Pointure','values',jsonb_build_array('36','37','38','39','40','41')),
      jsonb_build_object('name','Coloris','values',jsonb_build_array('Taupe','Ivoire'))),
    'desc','Toile signature sur bride large, petit badge doré et semelle fine bordée cognac.',
    'imgs',jsonb_build_array(
      'assets/products/femme/coach-petit-badge-taupe-studio.jpg',
      'assets/products/femme/coach-petit-badge-ivoire-studio.jpg'),
    'name','Claquette Petit Badge Signature',
    'badge','Nouveau','price',30000,'active',true,'archived',false,
    'audience','femme','oldPrice',0,'stockout',false,
    'variants',(select jsonb_object_agg(pointure || '::' || coloris,
      jsonb_build_object('s',case pointure when '36' then 2 when '37' then 3
        when '38' then 4 when '39' then 4 when '40' then 3 else 2 end,'r',0))
      from unnest(array['36','37','38','39','40','41']) as p(pointure)
      cross join unnest(array['Taupe','Ivoire']) as c(coloris)),
    'collection','coach',
    'valueImages',jsonb_build_object(
      'Coloris::Taupe','assets/products/femme/coach-petit-badge-taupe-studio.jpg',
      'Coloris::Ivoire','assets/products/femme/coach-petit-badge-ivoire-studio.jpg'))),
  ('coach-grand-c-signature', jsonb_build_object(
    'id','coach-grand-c-signature',
    'cat','claquettes',
    'img','assets/products/femme/coach-grand-c-taupe-studio.jpg',
    'axes',jsonb_build_array(
      jsonb_build_object('name','Pointure','values',jsonb_build_array('36','37','38','39','40','41')),
      jsonb_build_object('name','Coloris','values',jsonb_build_array('Taupe','Ivoire'))),
    'desc','Toile signature, grand fermoir C doré et assise souple à surpiqûres apparentes.',
    'imgs',jsonb_build_array(
      'assets/products/femme/coach-grand-c-taupe-studio.jpg',
      'assets/products/femme/coach-grand-c-ivoire-studio.jpg'),
    'name','Claquette Grand C Signature',
    'badge','Nouveau','price',30000,'active',true,'archived',false,
    'audience','femme','oldPrice',0,'stockout',false,
    'variants',(select jsonb_object_agg(pointure || '::' || coloris,
      jsonb_build_object('s',case pointure when '36' then 2 when '37' then 3
        when '38' then 4 when '39' then 4 when '40' then 3 else 2 end,'r',0))
      from unnest(array['36','37','38','39','40','41']) as p(pointure)
      cross join unnest(array['Taupe','Ivoire']) as c(coloris)),
    'collection','coach',
    'valueImages',jsonb_build_object(
      'Coloris::Taupe','assets/products/femme/coach-grand-c-taupe-studio.jpg',
      'Coloris::Ivoire','assets/products/femme/coach-grand-c-ivoire-studio.jpg')))
)
insert into public.products(id,data,updated_at)
select id,data,now() from definitions
on conflict(id) do update set data=excluded.data,updated_at=now();

with rebuilt as (
  select jsonb_agg(
    case when c.item->>'key'='coach'
      then jsonb_set(c.item,'{homeProducts}',
        '["coach-grand-c-signature","coach-petit-badge-signature","coach-matelassee","coach-sabot-boucle"]'::jsonb,true)
      else c.item end order by c.ord) collections
  from public.settings s
  cross join lateral jsonb_array_elements(s.data->'collections')
    with ordinality c(item,ord)
  where s.id=1
)
update public.settings s
set data=jsonb_set(s.data,'{collections}',r.collections,true),updated_at=now()
from rebuilt r where s.id=1;

with latest as (
  select id,data from public.admin_drafts order by updated_at desc limit 1 for update
), kept as (
  select d.id,coalesce(jsonb_agg(e.product order by e.ord)
    filter(where e.product->>'id' not in
      ('coach-petit-badge-signature','coach-grand-c-signature')),'[]'::jsonb) products
  from latest d
  cross join lateral jsonb_array_elements(d.data->'products')
    with ordinality e(product,ord)
  group by d.id
), additions as (
  select jsonb_agg(data order by case id
    when 'coach-grand-c-signature' then 1 else 2 end) products
  from public.products
  where id in ('coach-petit-badge-signature','coach-grand-c-signature')
)
update public.admin_drafts d
set data=jsonb_build_object(
      'settings',(select data from public.settings where id=1),
      'products',k.products || a.products),
    version=d.version+1,dirty=false,updated_at=now()
from kept k cross join additions a where d.id=k.id;

delete from public.store_revisions
where id not in (select id from public.store_revisions order by created_at desc limit 10);
commit;

select id,data->>'name' nom,data->>'active' actif,
       data->'axes'->1->'values' coloris
from public.products
where id in ('coach-petit-badge-signature','coach-grand-c-signature','coach-matelassee')
order by id;
