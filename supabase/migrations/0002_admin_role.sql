-- ============================================================
-- Rol de administrador sobre profiles
-- ============================================================

alter table public.profiles
  add column is_admin boolean not null default false;

-- Evita que un usuario se auto-promueva a admin actualizando su propio
-- perfil: si intenta cambiar is_admin y la conexión no es del backend
-- (service_role), el trigger revierte el cambio silenciosamente.
create function public.prevent_is_admin_self_update()
returns trigger
language plpgsql
as $$
begin
  if new.is_admin is distinct from old.is_admin and auth.role() <> 'service_role' then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$;

create trigger trg_prevent_is_admin_self_update
  before update on public.profiles
  for each row execute procedure public.prevent_is_admin_self_update();
