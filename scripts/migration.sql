-- ============================================================
-- La Casa del Minero — Supabase Migration
-- Creates all tables, RLS policies, and auth trigger
-- ============================================================

-- ===================
-- 1. categories
-- ===================
create table if not exists public.categories (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null unique,
  slug       text        not null unique,
  label      text        not null,
  image_url  text,
  created_at timestamptz not null default now()
);

-- ===================
-- 2. products
-- ===================
create table if not exists public.products (
  id               uuid          primary key default gen_random_uuid(),
  name             text          not null,
  description      text          not null,
  long_description text,
  price            numeric(10,2) not null,
  original_price   numeric(10,2),
  category_id      uuid          references public.categories(id) on delete set null,
  image_url        text,
  badge            text,
  in_stock         boolean       not null default true,
  sku              text          not null unique,
  created_at       timestamptz   not null default now()
);

-- ===================
-- 3. product_specs
-- ===================
create table if not exists public.product_specs (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label      text not null,
  value      text not null
);

-- ===================
-- 4. profiles
-- ===================
create table if not exists public.profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  phone      text,
  role       text        not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

-- ===================
-- 5. cart_items
-- ===================
create table if not exists public.cart_items (
  id         uuid    primary key default gen_random_uuid(),
  user_id    uuid    not null references auth.users(id) on delete cascade,
  product_id uuid    not null references public.products(id) on delete cascade,
  quantity   integer not null default 1 check (quantity > 0 and quantity <= 10),
  created_at timestamptz not null default now(),

  unique (user_id, product_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- Enable RLS on every table
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.product_specs enable row level security;
alter table public.profiles      enable row level security;
alter table public.cart_items    enable row level security;

-- -----------------------------------------------------------
-- categories — public read
-- -----------------------------------------------------------
create policy "categories: public select"
  on public.categories for select
  to anon, authenticated
  using (true);

-- -----------------------------------------------------------
-- products — public read
-- -----------------------------------------------------------
create policy "products: public select"
  on public.products for select
  to anon, authenticated
  using (true);

-- -----------------------------------------------------------
-- product_specs — public read
-- -----------------------------------------------------------
create policy "product_specs: public select"
  on public.product_specs for select
  to anon, authenticated
  using (true);

-- -----------------------------------------------------------
-- profiles — authenticated, own row only
-- -----------------------------------------------------------
create policy "profiles: select own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- -----------------------------------------------------------
-- cart_items — authenticated, own rows only
-- -----------------------------------------------------------
create policy "cart_items: select own"
  on public.cart_items for select
  to authenticated
  using (auth.uid() = user_id);

create policy "cart_items: insert own"
  on public.cart_items for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "cart_items: update own"
  on public.cart_items for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "cart_items: delete own"
  on public.cart_items for delete
  to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile on sign-up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
