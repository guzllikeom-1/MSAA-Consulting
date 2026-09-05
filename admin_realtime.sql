-- MSAA ADMIN - REALTIME FOR APPOINTMENTS
-- Run this once in Supabase SQL Editor.
-- This enables live new-booking/update notifications in the admin dashboard.

alter publication supabase_realtime
add table public.appointments;
