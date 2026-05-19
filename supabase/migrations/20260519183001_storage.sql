-- Photo storage for participating home images

insert into storage.buckets (id, name, public)
values ('garage-sale-photos', 'garage-sale-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read garage sale photos" on storage.objects;
create policy "Public read garage sale photos"
  on storage.objects for select
  using (bucket_id = 'garage-sale-photos');

drop policy if exists "Authenticated upload garage sale photos" on storage.objects;
create policy "Authenticated upload garage sale photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'garage-sale-photos');

drop policy if exists "Authenticated update garage sale photos" on storage.objects;
create policy "Authenticated update garage sale photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'garage-sale-photos');

drop policy if exists "Authenticated delete garage sale photos" on storage.objects;
create policy "Authenticated delete garage sale photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'garage-sale-photos');
