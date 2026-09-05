-- Classement final des Chypre : couleurs neutres Homme, nuances roses Femme.
-- Idempotent : utilisable avant ou apres une separation partielle.

begin;
lock table public.products in share row exclusive mode;

do $$
begin
  if exists (
    select 1
    from public.products p
    cross join lateral jsonb_each(coalesce(p.data->'variants','{}'::jsonb)) v
    where p.id in ('hermes-chypre-bordeaux','hermes-chypre-vives')
      and split_part(v.key,'::',2) in
          ('Fuchsia','Rose pâle grainé','Bicolore rose','Rouge vif','Nude daim','Léopard')
      and coalesce((v.value->>'r')::integer,0)>0
  ) then
    raise exception 'Une variante Chypre à déplacer est réservée';
  end if;
end $$;

insert into public.store_revisions(version,data)
select d.version,jsonb_build_object(
  'settings',coalesce((select data from public.settings where id=1),'{}'::jsonb),
  'products',coalesce((select jsonb_agg(data order by id) from public.products),'[]'::jsonb))
from public.admin_drafts d order by updated_at desc limit 1;

with moved as (
  select coalesce(jsonb_object_agg(v.key,v.value),'{}'::jsonb) variants
  from public.products p
  cross join lateral jsonb_each(coalesce(p.data->'variants','{}'::jsonb)) v
  where p.id in ('hermes-chypre-bordeaux','hermes-chypre-vives','femme-hermes-chypre-roses')
    and split_part(v.key,'::',2) in
        ('Fuchsia','Rose pâle grainé','Bicolore rose','Rouge vif','Nude daim','Léopard')
), female as (
  select jsonb_build_object(
    'id','femme-hermes-chypre-roses',
    'cat','claquettes',
    'img','assets/products/homme/hermes-chypre-vives-fuchsia.jpg',
    'axes',jsonb_build_array(
      jsonb_build_object('name','Pointure','values',jsonb_build_array('39','40','41','42','43','44','45')),
      jsonb_build_object('name','Coloris','values',
        jsonb_build_array('Fuchsia','Rose pâle grainé','Bicolore rose','Rouge vif','Nude daim','Léopard'))),
    'desc','La sandale Chypre dans six nuances féminines, du rose pâle au léopard.',
    'imgs',jsonb_build_array(
      'assets/products/homme/hermes-chypre-vives-fuchsia.jpg',
      'assets/products/homme/hermes-chypre-bordeaux-rose-pale.jpg',
      'assets/products/homme/hermes-chypre-bordeaux-bicolore-rose.jpg',
      'assets/products/homme/hermes-chypre-vives-rouge-vif.jpg',
      'assets/products/homme/hermes-chypre-vives-nude-daim.jpg',
      'assets/products/homme/hermes-chypre-vives-leopard.jpg'),
    'name','Sandale Chypre Nuances Femme',
    'badge','',
    'price',30000,
    'active',true,
    'archived',false,
    'audience','femme',
    'oldPrice',0,
    'stockout',false,
    'variants',moved.variants,
    'collection','hermes',
    'valueImages',jsonb_build_object(
      'Coloris::Fuchsia','assets/products/homme/hermes-chypre-vives-fuchsia.jpg',
      'Coloris::Rose pâle grainé','assets/products/homme/hermes-chypre-bordeaux-rose-pale.jpg',
      'Coloris::Bicolore rose','assets/products/homme/hermes-chypre-bordeaux-bicolore-rose.jpg',
      'Coloris::Rouge vif','assets/products/homme/hermes-chypre-vives-rouge-vif.jpg',
      'Coloris::Nude daim','assets/products/homme/hermes-chypre-vives-nude-daim.jpg',
      'Coloris::Léopard','assets/products/homme/hermes-chypre-vives-leopard.jpg')
  ) data from moved
)
insert into public.products(id,data,updated_at)
select 'femme-hermes-chypre-roses',data,now() from female
on conflict(id) do update set data=excluded.data,updated_at=now();

update public.products
set data=jsonb_set(
           jsonb_set(
             jsonb_set(
               jsonb_set(data,'{axes,1,values}','["Bordeaux","Terracotta"]'::jsonb),
               '{imgs}','["assets/products/homme/hermes-chypre-bordeaux-bordeaux.jpg","assets/products/homme/hermes-chypre-bordeaux-terracotta.jpg"]'::jsonb),
             '{desc}',to_jsonb('Chypre en cuir grainé, du bordeaux au terracotta.'::text)),
           '{variants}',
           (select coalesce(jsonb_object_agg(v.key,v.value),'{}'::jsonb)
            from jsonb_each(data->'variants') v
            where split_part(v.key,'::',2) in ('Bordeaux','Terracotta')))
         #- '{valueImages,Coloris::Rose pâle grainé}'
         #- '{valueImages,Coloris::Bicolore rose}',
    updated_at=now()
where id='hermes-chypre-bordeaux';

update public.products
set data=jsonb_set(
           jsonb_set(
             jsonb_set(
               jsonb_set(
                 jsonb_set(data,'{active}','false'::jsonb),
                 '{archived}','true'::jsonb),
               '{stockout}','true'::jsonb),
             '{variants}','{}'::jsonb),
           '{axes,1,values}','[]'::jsonb),
    updated_at=now()
where id='hermes-chypre-vives';

with latest as (
  select id,data from public.admin_drafts order by updated_at desc limit 1 for update
), refreshed as (
  select d.id,
    jsonb_agg(
      case when e.product->>'id' in
        ('hermes-chypre-bordeaux','hermes-chypre-vives','femme-hermes-chypre-roses')
        then p.data else e.product end order by e.ord)
      filter(where e.product->>'id'<>'femme-hermes-chypre-roses') products
  from latest d
  cross join lateral jsonb_array_elements(d.data->'products') with ordinality e(product,ord)
  left join public.products p on p.id=e.product->>'id'
  group by d.id
)
update public.admin_drafts d
set data=jsonb_set(
      d.data,'{products}',
      r.products || jsonb_build_array(
        (select data from public.products where id='femme-hermes-chypre-roses'))),
    version=d.version+1,dirty=false,updated_at=now()
from refreshed r where d.id=r.id;

delete from public.store_revisions
where id not in (select id from public.store_revisions order by created_at desc limit 10);
commit;

select id,data->>'audience' audience,data->>'active' active,
       data->'axes'->1->'values' coloris
from public.products
where id in ('hermes-chypre-bordeaux','hermes-chypre-vives','femme-hermes-chypre-roses')
order by id;
