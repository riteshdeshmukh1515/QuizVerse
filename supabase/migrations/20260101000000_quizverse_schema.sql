create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'student' check (role in ('student', 'admin')),
  avatar_color text not null default 'bg-gradient-to-br from-indigo-500 to-purple-600',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id text primary key,
  title text not null,
  description text not null,
  category text not null check (category in ('Programming', 'Aptitude', 'Mathematics', 'Science', 'General Knowledge')),
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  duration_minutes integer not null check (duration_minutes > 0),
  questions jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  published boolean not null default false,
  tags text[] not null default '{}',
  cover_emoji text not null default '📚',
  cover_gradient text not null default 'from-indigo-500 via-purple-500 to-pink-500',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id text primary key,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null,
  submitted_at timestamptz not null,
  duration_seconds integer not null default 0,
  answers jsonb not null default '[]'::jsonb,
  total_marks numeric not null default 0,
  score numeric not null default 0,
  percentage numeric not null default 0,
  status text not null check (status in ('submitted', 'timed-out')),
  created_at timestamptz not null default now()
);

create table if not exists public.leaderboards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  score numeric not null default 0,
  percentage numeric not null default 0,
  duration_seconds integer not null default 0,
  date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_quizzes_published on public.quizzes(published);
create index if not exists idx_quizzes_category on public.quizzes(category);
create index if not exists idx_quizzes_difficulty on public.quizzes(difficulty);
create index if not exists idx_attempts_user on public.quiz_attempts(user_id);
create index if not exists idx_attempts_quiz on public.quiz_attempts(quiz_id);
create index if not exists idx_leaderboards_quiz_score on public.leaderboards(quiz_id, percentage desc, duration_seconds asc);
create index if not exists idx_leaderboards_user on public.leaderboards(user_id);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_quizzes_updated_at on public.quizzes;
create trigger trg_quizzes_updated_at
before update on public.quizzes
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, avatar_color)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    'student',
    coalesce(new.raw_user_meta_data ->> 'avatar_color', 'bg-gradient-to-br from-indigo-500 to-purple-600')
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    avatar_color = excluded.avatar_color;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.leaderboards enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own_student" on public.profiles;
create policy "profiles_insert_own_student"
on public.profiles for insert
to authenticated
with check (auth.uid() = id and role = 'student');

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists "quizzes_select_published_or_owner_or_admin" on public.quizzes;
create policy "quizzes_select_published_or_owner_or_admin"
on public.quizzes for select
to authenticated
using (published = true or created_by = auth.uid() or public.is_admin());

drop policy if exists "quizzes_insert_authenticated" on public.quizzes;
create policy "quizzes_insert_authenticated"
on public.quizzes for insert
to authenticated
with check (created_by = auth.uid() or public.is_admin());

drop policy if exists "quizzes_update_owner_or_admin" on public.quizzes;
create policy "quizzes_update_owner_or_admin"
on public.quizzes for update
to authenticated
using (created_by = auth.uid() or public.is_admin())
with check (created_by = auth.uid() or public.is_admin());

drop policy if exists "quizzes_delete_owner_or_admin" on public.quizzes;
create policy "quizzes_delete_owner_or_admin"
on public.quizzes for delete
to authenticated
using (created_by = auth.uid() or public.is_admin());

drop policy if exists "attempts_select_own_or_admin" on public.quiz_attempts;
create policy "attempts_select_own_or_admin"
on public.quiz_attempts for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "attempts_insert_own" on public.quiz_attempts;
create policy "attempts_insert_own"
on public.quiz_attempts for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "attempts_delete_admin" on public.quiz_attempts;
create policy "attempts_delete_admin"
on public.quiz_attempts for delete
to authenticated
using (public.is_admin());

drop policy if exists "leaderboards_select_authenticated" on public.leaderboards;
create policy "leaderboards_select_authenticated"
on public.leaderboards for select
to authenticated
using (true);

drop policy if exists "leaderboards_insert_own" on public.leaderboards;
create policy "leaderboards_insert_own"
on public.leaderboards for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "leaderboards_delete_admin" on public.leaderboards;
create policy "leaderboards_delete_admin"
on public.leaderboards for delete
to authenticated
using (public.is_admin());

-- Run this after creating/registering your admin user:
-- update public.profiles set role = 'admin' where email = 'your-admin-email@example.com';