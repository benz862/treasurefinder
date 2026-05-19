-- Multi-home invite system

alter table public.homes
  add column if not exists invite_token text,
  add column if not exists invite_status text not null default 'active',
  add column if not exists approval_status text not null default 'draft',
  add column if not exists seller_email text,
  add column if not exists seller_phone text,
  add column if not exists submitted_at timestamptz,
  add column if not exists approved_at timestamptz,
  add column if not exists approved_by uuid references public.profiles(id) on delete set null,
  add column if not exists last_edited_at timestamptz;

alter table public.homes
  alter column address drop not null;

create unique index if not exists idx_homes_invite_token
  on public.homes(invite_token)
  where invite_token is not null;

create index if not exists idx_homes_approval_status
  on public.homes(approval_status);

-- Existing listings were organizer-managed; keep them visible publicly.
update public.homes
set
  approval_status = 'approved',
  approved_at = coalesce(approved_at, now()),
  invite_status = coalesce(invite_status, 'active')
where approval_status = 'draft'
  and seller_name is not null
  and address is not null;

-- Public visitors only see approved listings on published events.
drop policy if exists "Public can read homes of published events" on public.homes;
create policy "Public can read approved homes of published events"
  on public.homes for select
  using (
    approval_status = 'approved'
    and event_id in (select id from public.events where status = 'published')
  );

drop policy if exists "Public can read photos of published events" on public.home_photos;
create policy "Public can read photos of approved published homes"
  on public.home_photos for select
  using (
    home_id in (
      select h.id from public.homes h
      join public.events e on e.id = h.event_id
      where e.status = 'published'
        and h.approval_status = 'approved'
    )
  );
