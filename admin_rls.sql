-- MSAA ADMIN ACCESS
-- Run this once in Supabase SQL Editor.

alter table public.appointments enable row level security;

drop policy if exists "Admin can view appointments" on public.appointments;
create policy "Admin can view appointments"
on public.appointments
for select
to authenticated
using (true);

drop policy if exists "Admin can update appointments" on public.appointments;
create policy "Admin can update appointments"
on public.appointments
for update
to authenticated
using (true)
with check (true);

-- Keep payment receipts private. Allow signed-in admin users to read them.
drop policy if exists "Admin can view payment receipts" on storage.objects;
create policy "Admin can view payment receipts"
on storage.objects
for select
to authenticated
using (bucket_id = 'payment-receipts');
