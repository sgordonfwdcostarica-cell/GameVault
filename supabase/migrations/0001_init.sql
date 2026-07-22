-- ============================================================
-- GameVault - esquema inicial
-- ============================================================

-- ------------------------------------------------------------
-- profiles: extiende auth.users con datos públicos del usuario
-- ------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- crea automáticamente un profile cuando alguien se registra en auth.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- games: catálogo de juegos (lectura pública, escritura admin)
-- ------------------------------------------------------------
create table public.games (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  cover_url    text,
  genre        text,
  play_route   text not null,              -- ej: "snake", "memory", "tic-tac-toe"
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- library_entries: biblioteca personal / favoritos de cada usuario
-- ------------------------------------------------------------
create table public.library_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  game_id      uuid not null references public.games(id) on delete cascade,
  is_favorite  boolean not null default false,
  added_at     timestamptz not null default now(),
  unique (user_id, game_id)
);

create index idx_library_entries_user_id on public.library_entries(user_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.library_entries enable row level security;

-- profiles: cualquiera autenticado puede leer perfiles (para mostrar username),
-- pero solo el dueño puede editar el suyo.
create policy "profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- games: catálogo público de lectura para cualquiera (incluso anónimos).
-- la escritura queda reservada al backend (service role, que bypassa RLS).
create policy "games are viewable by everyone"
  on public.games for select
  to anon, authenticated
  using (true);

-- library_entries: cada usuario solo ve y modifica sus propias filas.
create policy "users can view their own library"
  on public.library_entries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users can insert into their own library"
  on public.library_entries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "users can update their own library entries"
  on public.library_entries for update
  to authenticated
  using (auth.uid() = user_id);

create policy "users can delete their own library entries"
  on public.library_entries for delete
  to authenticated
  using (auth.uid() = user_id);
