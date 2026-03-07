-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Creates the waitlist table and allows anonymous inserts

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  age_range text,
  relationship_goal text,
  frustrations text,
  source text default 'form',
  created_at timestamptz default now()
);

-- Optional: prevent duplicate emails (uncomment if you want)
-- create unique index if not exists waitlist_email_unique on public.waitlist (lower(email));

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Allow anyone to insert (for unauthenticated signups)
create policy "Allow anonymous insert"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- Optional: restrict reads to authenticated users only (uncomment if you want)
-- create policy "Allow authenticated read"
--   on public.waitlist
--   for select
--   to authenticated
--   using (true);
