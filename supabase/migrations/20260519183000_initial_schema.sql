-- Treasure Finder initial schema

-- Profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  full_name text,
  role text not null default 'organizer',
  created_at timestamptz not null default now()
);

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  slug text not null unique,
  description text,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  city text not null,
  region text not null,
  country text not null default 'US',
  main_address text not null,
  latitude numeric,
  longitude numeric,
  status text not null default 'draft',
  tier text not null default 'starter',
  max_homes integer not null default 5,
  is_featured boolean not null default false,
  payment_status text not null default 'unpaid',
  stripe_session_id text,
  banner_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Homes
create table if not exists public.homes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade not null,
  seller_name text,
  address text not null,
  latitude numeric,
  longitude numeric,
  description text,
  categories text[] not null default '{}',
  featured_items text[] not null default '{}',
  opening_time time,
  closing_time time,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Home photos
create table if not exists public.home_photos (
  id uuid primary key default gen_random_uuid(),
  home_id uuid references public.homes(id) on delete cascade not null,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.profiles(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete set null,
  stripe_session_id text not null,
  stripe_payment_intent_id text,
  amount integer not null,
  currency text not null default 'usd',
  tier text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_organizer on public.events(organizer_id);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_homes_event on public.homes(event_id);
create index if not exists idx_home_photos_home on public.home_photos(home_id);
create index if not exists idx_payments_organizer on public.payments(organizer_id);

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at
  before update on public.events
  for each row execute function public.update_updated_at();

drop trigger if exists homes_updated_at on public.homes;
create trigger homes_updated_at
  before update on public.homes
  for each row execute function public.update_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.homes enable row level security;
alter table public.home_photos enable row level security;
alter table public.payments enable row level security;

-- Profiles policies
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Events policies
drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
  on public.events for select
  using (status = 'published');

drop policy if exists "Organizers can read own events" on public.events;
create policy "Organizers can read own events"
  on public.events for select
  using (
    organizer_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "Organizers can insert own events" on public.events;
create policy "Organizers can insert own events"
  on public.events for insert
  with check (
    organizer_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "Organizers can update own events" on public.events;
create policy "Organizers can update own events"
  on public.events for update
  using (
    organizer_id in (select id from public.profiles where user_id = auth.uid())
  );

drop policy if exists "Organizers can delete own events" on public.events;
create policy "Organizers can delete own events"
  on public.events for delete
  using (
    organizer_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Homes policies
drop policy if exists "Public can read homes of published events" on public.homes;
create policy "Public can read homes of published events"
  on public.homes for select
  using (
    event_id in (select id from public.events where status = 'published')
  );

drop policy if exists "Organizers can manage own event homes" on public.homes;
create policy "Organizers can manage own event homes"
  on public.homes for all
  using (
    event_id in (
      select e.id from public.events e
      join public.profiles p on p.id = e.organizer_id
      where p.user_id = auth.uid()
    )
  )
  with check (
    event_id in (
      select e.id from public.events e
      join public.profiles p on p.id = e.organizer_id
      where p.user_id = auth.uid()
    )
  );

-- Home photos policies
drop policy if exists "Public can read photos of published events" on public.home_photos;
create policy "Public can read photos of published events"
  on public.home_photos for select
  using (
    home_id in (
      select h.id from public.homes h
      join public.events e on e.id = h.event_id
      where e.status = 'published'
    )
  );

drop policy if exists "Organizers can manage own event photos" on public.home_photos;
create policy "Organizers can manage own event photos"
  on public.home_photos for all
  using (
    home_id in (
      select h.id from public.homes h
      join public.events e on e.id = h.event_id
      join public.profiles p on p.id = e.organizer_id
      where p.user_id = auth.uid()
    )
  )
  with check (
    home_id in (
      select h.id from public.homes h
      join public.events e on e.id = h.event_id
      join public.profiles p on p.id = e.organizer_id
      where p.user_id = auth.uid()
    )
  );

-- Payments policies
drop policy if exists "Organizers can read own payments" on public.payments;
create policy "Organizers can read own payments"
  on public.payments for select
  using (
    organizer_id in (select id from public.profiles where user_id = auth.uid())
  );
