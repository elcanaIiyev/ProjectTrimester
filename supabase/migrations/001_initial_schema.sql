-- ─────────────────────────────────────────────────────────────────────────────
-- BetterForms — Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  role        text not null default 'recruiter',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── analysis_jobs ───────────────────────────────────────────────────────────
create table if not exists public.analysis_jobs (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles (id) on delete cascade,
  job_title        text,
  job_description  text not null,
  status           text not null default 'pending',
  cv_count         int not null default 0,
  created_at       timestamptz not null default now(),
  completed_at     timestamptz
);

alter table public.analysis_jobs enable row level security;

create policy "Users can view their own jobs"
  on public.analysis_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own jobs"
  on public.analysis_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own jobs"
  on public.analysis_jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own jobs"
  on public.analysis_jobs for delete
  using (auth.uid() = user_id);

-- ─── cv_results ──────────────────────────────────────────────────────────────
create table if not exists public.cv_results (
  id              uuid primary key default uuid_generate_v4(),
  job_id          uuid not null references public.analysis_jobs (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  candidate_name  text,
  file_name       text not null,
  storage_path    text,
  match_score     int,
  summary         text,
  strengths       text[],
  weaknesses      text[],
  rank            int,
  raw_text        text,
  created_at      timestamptz not null default now()
);

alter table public.cv_results enable row level security;

create policy "Users can view their own CV results"
  on public.cv_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own CV results"
  on public.cv_results for insert
  with check (auth.uid() = user_id);

-- ─── indexes ─────────────────────────────────────────────────────────────────
create index if not exists idx_analysis_jobs_user_id on public.analysis_jobs (user_id);
create index if not exists idx_cv_results_job_id on public.cv_results (job_id);
create index if not exists idx_cv_results_user_id on public.cv_results (user_id);
create index if not exists idx_cv_results_match_score on public.cv_results (match_score desc);
