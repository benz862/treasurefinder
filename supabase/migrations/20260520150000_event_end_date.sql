-- Support multi-day garage sale events

alter table public.events
  add column if not exists event_end_date date;

-- Single-day events: end date matches start date when unset.
update public.events
set event_end_date = event_date
where event_end_date is null;
