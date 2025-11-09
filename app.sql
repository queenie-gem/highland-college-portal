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
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Applicants can read/update their own profile
create policy if not exists "profiles: select own" on public.profiles
  for select using (id = auth.uid());

create policy if not exists "profiles: update own non-role fields" on public.profiles
  for update using (id = auth.uid());

-- Admins can read/update all profiles (including role changes)
create policy if not exists "profiles: admin full access" on public.profiles
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create a profile row for each new auth user with role 'applicant'
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'applicant')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Applications table for prospective students
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  program text not null,
  status text not null default 'draft', -- draft/submitted/reviewed/accepted/rejected
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table public.applications enable row level security;

-- Applicants can manage only their own applications
create policy if not exists "applications: insert own" on public.applications
  for insert with check (user_id = auth.uid());

create policy if not exists "applications: select own" on public.applications
  for select using (user_id = auth.uid());

create policy if not exists "applications: update own" on public.applications
  for update using (user_id = auth.uid());

-- Admins full access to all applications
create policy if not exists "applications: admin full access" on public.applications
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

