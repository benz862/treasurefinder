-- TreasureTrail initial schema

create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  full_name text,
  role text not null default 'organizer',
  created_at timestamptz not null default now()
);

-- Events
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references profiles(id) on delete cascade not null,
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
create table if not exists homes (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
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
create table if not exists home_photos (
  id uuid primary key default uuid_generate_v4(),
  home_id uuid references homes(id) on delete cascade not null,
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Payments
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references profiles(id) on delete cascade not null,
  event_id uuid references events(id) on delete set null,
  stripe_session_id text not null,
  stripe_payment_intent_id text,
  amount integer not null,
  currency text not null default 'usd',
  tier text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_events_slug on events(slug);
create index if not exists idx_events_organizer on events(organizer_id);
create index if not exists idx_events_status on events(status);
create index if not exists idx_homes_event on homes(event_id);
create index if not exists idx_home_photos_home on home_photos(home_id);
create index if not exists idx_payments_organizer on payments(organizer_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger events_updated_at before update on events
  for each row execute function update_updated_at();

create trigger homes_updated_at before update on homes
  for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
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
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RLS
alter table profiles enable row level security;
alter table events enable row level security;
alter table homes enable row level security;
alter table home_photos enable row level security;
alter table payments enable row level security;

-- Helper: admin check
create or replace function is_admin()
returns boolean as $$
begin
  return (
    select email = current_setting('app.admin_email', true)
    from auth.users
    where id = auth.uid()
  );
exception when others then
  return false;
end;
$$ language plpgsql security definer;

-- Profiles policies
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

-- Events policies
create policy "Public can read published events"
  on events for select
  using (status = 'published');

create policy "Organizers can read own events"
  on events for select
  using (
    organizer_id in (select id from profiles where user_id = auth.uid())
  );

create policy "Organizers can insert own events"
  on events for insert
  with check (
    organizer_id in (select id from profiles where user_id = auth.uid())
  );

create policy "Organizers can update own events"
  on events for update
  using (
    organizer_id in (select id from profiles where user_id = auth.uid())
  );

create policy "Organizers can delete own events"
  on events for delete
  using (
    organizer_id in (select id from profiles where user_id = auth.uid())
  );

-- Homes policies
create policy "Public can read homes of published events"
  on homes for select
  using (
    event_id in (select id from events where status = 'published')
  );

create policy "Organizers can manage own event homes"
  on homes for all
  using (
    event_id in (
      select e.id from events e
      join profiles p on p.id = e.organizer_id
      where p.user_id = auth.uid()
    )
  );

-- Home photos policies
create policy "Public can read photos of published events"
  on home_photos for select
  using (
    home_id in (
      select h.id from homes h
      join events e on e.id = h.event_id
      where e.status = 'published'
    )
  );

create policy "Organizers can manage own event photos"
  on home_photos for all
  using (
    home_id in (
      select h.id from homes h
      join events e on e.id = h.event_id
      join profiles p on p.id = e.organizer_id
      where p.user_id = auth.uid()
    )
  );

-- Payments policies
create policy "Organizers can read own payments"
  on payments for select
  using (
    organizer_id in (select id from profiles where user_id = auth.uid())
  );

-- Storage bucket (run in Supabase SQL editor):
-- insert into storage.buckets (id, name, public) values ('garage-sale-photos', 'garage-sale-photos', true);

-- Storage policies
-- create policy "Public read published event photos"
--   on storage.objects for select
--   using (bucket_id = 'garage-sale-photos');

-- create policy "Authenticated users can upload"
--   on storage.objects for insert
--   with check (bucket_id = 'garage-sale-photos' and auth.role() = 'authenticated');

-- create policy "Users can update own uploads"
--   on storage.objects for update
--   using (bucket_id = 'garage-sale-photos' and auth.role() = 'authenticated');

-- create policy "Users can delete own uploads"
--   on storage.objects for delete
--   using (bucket_id = 'garage-sale-photos' and auth.role() = 'authenticated');
