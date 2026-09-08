-- ============================================================
-- Correction du cycle de stock des commandes — 2026-09-08
-- ------------------------------------------------------------
-- Les nouvelles demandes WhatsApp arrivent en PENDING avec
-- stockReserved=false : elles ne réservent et ne décrémentent rien.
-- `admin_save_order` les traitait pourtant comme un ancien état ayant
-- décrémenté le stock. Confirmer faisait alors +1 puis -1 (aucun effet),
-- et annuler ou supprimer faisait +1 (stock fantôme).
--
-- Le schéma de référence porte la même correction. Ce script est destiné
-- à la base déjà installée et refuse de modifier une définition inattendue.
-- ============================================================

begin;

do $$
declare
  v_definition text;
  v_old text := 'elsif v_old_status <> ''CANCELLED'' then';
  v_new text := 'elsif v_old_status in (''CONFIRMED'',''SHIPPING'',''DELIVERED'') then';
begin
  select pg_get_functiondef('public.admin_save_order(jsonb)'::regprocedure)
    into v_definition;

  if position(v_new in v_definition) > 0 then
    raise notice 'La correction est déjà installée.';
  elsif position(v_old in v_definition) = 0 then
    raise exception 'Arrêt : définition inattendue de public.admin_save_order(jsonb).';
  else
    execute replace(v_definition, v_old, v_new);
  end if;
end $$;

-- Le contrôle doit renvoyer true.
select position(
  'elsif v_old_status in (''CONFIRMED'',''SHIPPING'',''DELIVERED'') then'
  in pg_get_functiondef('public.admin_save_order(jsonb)'::regprocedure)
) > 0 as cycle_stock_corrige;

commit;
