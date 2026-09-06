-- Ajoute les deux derniers arrivages Femme, leurs coloris et la marque Fashion.
-- Les prix de lancement restent modifiables depuis le dashboard.

begin;
lock table public.products in share row exclusive mode;

insert into public.store_revisions(version,data)
select d.version,jsonb_build_object(
  'settings',coalesce((select data from public.settings where id=1),'{}'::jsonb),
  'products',coalesce((select jsonb_agg(data order by id) from public.products),'[]'::jsonb))
from public.admin_drafts d order by updated_at desc limit 1;

with definitions(id,data) as (
  values
  ('femme-tory-burch-miller-pave',jsonb_build_object(
    'id','femme-tory-burch-miller-pave','name','Miller Pavé',
    'audience','femme','cat','sandales','collection','tory-burch',
    'price',35000,'oldPrice',0,'badge','Nouveau','active',true,
    'archived',false,'stockout',false,
    'img','assets/products/femme/tory-burch-miller-pave-champagne-studio.jpg',
    'imgs',jsonb_build_array(
      'assets/products/femme/tory-burch-miller-pave-champagne-studio.jpg',
      'assets/products/femme/tory-burch-miller-pave-argent-studio.jpg',
      'assets/products/femme/tory-burch-miller-pave-turquoise-studio.jpg',
      'assets/products/femme/tory-burch-miller-pave-lilas-studio.jpg',
      'assets/products/femme/tory-burch-miller-pave-noir-studio.jpg'),
    'desc','Sandale entre-doigts fine, bordée de cristaux et ornée d''un grand Double T ajouré.',
    'axes',jsonb_build_array(
      jsonb_build_object('name','Pointure','values',jsonb_build_array('36','37','38','39','40','41')),
      jsonb_build_object('name','Coloris','values',jsonb_build_array('Champagne','Argent','Turquoise','Lilas','Noir'))),
    'valueImages',jsonb_build_object(
      'Coloris::Champagne','assets/products/femme/tory-burch-miller-pave-champagne-studio.jpg',
      'Coloris::Argent','assets/products/femme/tory-burch-miller-pave-argent-studio.jpg',
      'Coloris::Turquoise','assets/products/femme/tory-burch-miller-pave-turquoise-studio.jpg',
      'Coloris::Lilas','assets/products/femme/tory-burch-miller-pave-lilas-studio.jpg',
      'Coloris::Noir','assets/products/femme/tory-burch-miller-pave-noir-studio.jpg'),
    'variants',(select jsonb_object_agg(pointure || '::' || coloris,
      jsonb_build_object('s',case pointure when '36' then 2 when '37' then 3
        when '38' then 4 when '39' then 4 when '40' then 3 else 2 end,'r',0))
      from unnest(array['36','37','38','39','40','41']) p(pointure)
      cross join unnest(array['Champagne','Argent','Turquoise','Lilas','Noir']) c(coloris)))),
  ('femme-fashion-fleurs',jsonb_build_object(
    'id','femme-fashion-fleurs','name','Claquette Fleurs Cristal',
    'audience','femme','cat','claquettes','collection','fashion',
    'price',25000,'oldPrice',0,'badge','Nouveau','active',true,
    'archived',false,'stockout',false,
    'img','assets/products/femme/fashion-fleurs-noir-studio.jpg',
    'imgs',jsonb_build_array(
      'assets/products/femme/fashion-fleurs-noir-studio.jpg',
      'assets/products/femme/fashion-fleurs-rose-studio.jpg',
      'assets/products/femme/fashion-fleurs-ivoire-studio.jpg'),
    'desc','Claquette plate à bride fleurie, cristaux centraux et petits détails métalliques.',
    'axes',jsonb_build_array(
      jsonb_build_object('name','Pointure','values',jsonb_build_array('36','37','38','39','40','41')),
      jsonb_build_object('name','Coloris','values',jsonb_build_array('Noir','Rose','Ivoire'))),
    'valueImages',jsonb_build_object(
      'Coloris::Noir','assets/products/femme/fashion-fleurs-noir-studio.jpg',
      'Coloris::Rose','assets/products/femme/fashion-fleurs-rose-studio.jpg',
      'Coloris::Ivoire','assets/products/femme/fashion-fleurs-ivoire-studio.jpg'),
    'variants',(select jsonb_object_agg(pointure || '::' || coloris,
      jsonb_build_object('s',case pointure when '36' then 2 when '37' then 3
        when '38' then 4 when '39' then 4 when '40' then 3 else 2 end,'r',0))
      from unnest(array['36','37','38','39','40','41']) p(pointure)
      cross join unnest(array['Noir','Rose','Ivoire']) c(coloris))))
)
insert into public.products(id,data,updated_at)
select id,data,now() from definitions
on conflict(id) do update set data=excluded.data,updated_at=now();

with rebuilt as (
  select jsonb_agg(
    case when c.item->>'key'='tory-burch'
      then jsonb_set(c.item,'{homeProducts}',
        '["femme-tory-burch-miller-pave","femme-tory-burch-double-t","femme-tory-burch-miller-jelly"]'::jsonb,true)
      else c.item end order by c.ord) collections
  from public.settings s
  cross join lateral jsonb_array_elements(s.data->'collections')
    with ordinality c(item,ord)
  where s.id=1
)
update public.settings s
set data=jsonb_set(s.data,'{collections}',r.collections,true),updated_at=now()
from rebuilt r where s.id=1;

update public.settings s
set data=jsonb_set(s.data,'{collections}',
  (s.data->'collections') || jsonb_build_array(jsonb_build_object(
    'key','fashion','featured',true,'label','Fashion','logo','',
    'tagline','Fleurs cristal','accent','#C6849F',
    'cover','assets/brand-banners/fashion.jpg',
    'homeProducts',jsonb_build_array('femme-fashion-fleurs'),
    'desc','Claquettes féminines à fleurs en relief, cristaux discrets et semelle fine.')),true),
  updated_at=now()
where s.id=1
  and not exists (
    select 1 from jsonb_array_elements(s.data->'collections') c
    where c->>'key'='fashion');

update public.settings s
set data=jsonb_set(s.data,'{collections}',
  (select jsonb_agg(
    case when c.item->>'key'='fashion' then jsonb_build_object(
      'key','fashion','featured',true,'label','Fashion','logo','',
      'tagline','Fleurs cristal','accent','#C6849F',
      'cover','assets/brand-banners/fashion.jpg',
      'homeProducts',jsonb_build_array('femme-fashion-fleurs'),
      'desc','Claquettes féminines à fleurs en relief, cristaux discrets et semelle fine.')
    else c.item end order by c.ord)
   from jsonb_array_elements(s.data->'collections') with ordinality c(item,ord)),true),
  updated_at=now()
where s.id=1;

with latest as (
  select id,data from public.admin_drafts order by updated_at desc limit 1 for update
), kept as (
  select d.id,coalesce(jsonb_agg(e.product order by e.ord)
    filter(where e.product->>'id' not in
      ('femme-tory-burch-miller-pave','femme-fashion-fleurs')),'[]'::jsonb) products
  from latest d
  cross join lateral jsonb_array_elements(d.data->'products')
    with ordinality e(product,ord)
  group by d.id
), additions as (
  select jsonb_agg(data order by case id
    when 'femme-tory-burch-miller-pave' then 1 else 2 end) products
  from public.products
  where id in ('femme-tory-burch-miller-pave','femme-fashion-fleurs')
)
update public.admin_drafts d
set data=jsonb_build_object(
      'settings',(select data from public.settings where id=1),
      'products',a.products || k.products),
    version=d.version+1,dirty=false,updated_at=now()
from kept k cross join additions a where d.id=k.id;

delete from public.store_revisions
where id not in (select id from public.store_revisions order by created_at desc limit 10);
commit;

select id,data->>'name' nom,data->>'price' prix,
       data->'axes'->1->'values' coloris,
       (select sum((v.value->>'s')::int)
        from jsonb_each(data->'variants') v) stock
from public.products
where id in ('femme-tory-burch-miller-pave','femme-fashion-fleurs')
order by id;
