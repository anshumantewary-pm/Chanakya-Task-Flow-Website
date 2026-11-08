-- Chanakya v1 database (PRD section 8 and 11).
-- Paste this whole file into Supabase: SQL Editor -> New query -> Run.

-- ---------- Tables ----------

create table public.profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  user_type   text not null check (user_type in ('student', 'professional', 'other')),
  wake_time   time not null,
  sleep_time  time not null,
  daily_hours numeric(4, 1) not null check (daily_hours > 0 and daily_hours <= 24),
  timezone    text not null default 'UTC', -- so "today" means the user's today, not the server's
  created_at  timestamptz not null default now()
);

create table public.tasks (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title            text not null check (length(trim(title)) > 0),
  priority         text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  duration_minutes integer not null check (duration_minutes between 5 and 720),
  deadline         date,
  repeat_rule      text not null default 'none' check (repeat_rule in ('none', 'daily', 'weekly')),
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

create table public.plan_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  task_id    uuid not null references public.tasks (id) on delete cascade,
  date       date not null,
  start_time time not null,
  end_time   time not null,
  status     text not null default 'planned' check (status in ('planned', 'done', 'postponed', 'cancelled')),
  edited     boolean not null default false, -- PRD risk 1: how often users change the plan
  created_at timestamptz not null default now(),
  unique (task_id, date)
);

create index tasks_user_idx on public.tasks (user_id);
create index plan_items_user_date_idx on public.plan_items (user_id, date);

-- ---------- Row Level Security: users only see their own rows ----------

alter table public.profiles   enable row level security;
alter table public.tasks      enable row level security;
alter table public.plan_items enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own plan items" on public.plan_items
  for all using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid())
  );

-- ---------- "Delete my data" (PRD section 11) ----------
-- Deleting the auth user cascades to every table above.

create function public.delete_my_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
