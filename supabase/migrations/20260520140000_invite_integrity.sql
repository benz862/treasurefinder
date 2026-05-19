-- Invite system integrity: status checks + backfill tokens for existing homes

alter table public.homes
  drop constraint if exists homes_invite_status_check;

alter table public.homes
  add constraint homes_invite_status_check
  check (invite_status in ('active', 'inactive'));

alter table public.homes
  drop constraint if exists homes_approval_status_check;

alter table public.homes
  add constraint homes_approval_status_check
  check (approval_status in ('draft', 'submitted', 'approved', 'needs_changes', 'hidden'));

-- Give every existing home a token so organizers can copy invite links when needed.
do $$
declare
  home_row record;
  candidate text;
  token_taken boolean;
begin
  for home_row in
    select id from public.homes where invite_token is null
  loop
    loop
      candidate := lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
      select exists(
        select 1 from public.homes where invite_token = candidate
      ) into token_taken;
      exit when not token_taken;
    end loop;

    update public.homes
    set invite_token = candidate,
        invite_status = coalesce(invite_status, 'active')
    where id = home_row.id;
  end loop;
end $$;
