CREATE TABLE faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text
);


-- Profiles table to hold roles for authentication/authorization
-- Only two roles for now: 'admin' and 'applicant'
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','applicant')) default 'applicant',
  full_name text,
  phone text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Applicants can read/update their own profile
create policy if not exists "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

create policy if not exists "profiles_update_own"
on public.profiles for update
using (id = auth.uid());

-- Admins can read/update any profile
create policy if not exists "profiles_admin_all"
on public.profiles for all
using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (true);

-- Optional trigger to auto-create profiles for new users as 'applicant'
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, role) values (new.id, 'applicant')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Applications table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  surname text, -- optional
  utme_reg_no text not null,
  preferred_department_id uuid not null references public.department(id) on delete restrict,
  phone text not null,
  email text not null,
  sittings_count int not null default 1,
  -- olevel_results is a JSONB describing sittings and subjects/grades:
  -- [
  --   {
  --     "type": "WAEC" | "NECO" | "NABTEB",
  --     "sitting_index": 1,
  --     "subjects": [{"name": "Mathematics", "grade": "B3"}, ...],
  --     "proof_storage_path": "applications/<user_id>/proof_<timestamp>.pdf"
  --   },
  --   ...
  -- ]
  olevel_results jsonb not null default '[]'::jsonb,
  status text not null default 'draft', -- draft|submitted|reviewing|accepted|rejected
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Each applicant can have only one application row
create unique index if not exists applications_user_unique on public.applications(user_id);

-- Index for department lookups
create index if not exists applications_department_idx on public.applications(preferred_department_id);

-- Update updated_at
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

alter table public.applications enable row level security;

-- Applicants: only own row
create policy  "applications_insert_own"
on public.applications for insert
with check (user_id = auth.uid());

create policy  "applications_select_own"
on public.applications for select
using (user_id = auth.uid());

create policy  "applications_update_own"
on public.applications for update
using (user_id = auth.uid());

-- Admins: full access
create policy  "applications_admin_all"
on public.applications for all
using (
  exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (true);

-- Storage bucket for application proof uploads
-- Create bucket if missing (public so dashboard links work with getPublicUrl)
insert into storage.buckets (id, name, public)
values ('applications', 'applications', true)
on conflict (id) do nothing;

-- RLS policies for storage.objects in 'applications' bucket
-- Allow authenticated users to upload and manage their own files under <user_id>/...
create policy "applications_bucket_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'applications' and auth.uid()::text = split_part(name, '/', 1)
);

create policy "applications_bucket_update_own"
on storage.objects for update to authenticated
using (
  bucket_id = 'applications' and auth.uid()::text = split_part(name, '/', 1)
);

create policy "applications_bucket_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'applications' and auth.uid()::text = split_part(name, '/', 1)
);

-- Admins have full access to the applications bucket
create policy "applications_bucket_admin_all"
on storage.objects for all to authenticated
using (
  bucket_id = 'applications' and exists(
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (true);

