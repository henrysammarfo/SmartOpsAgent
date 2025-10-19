-- Create user_integrations table to store user-specific API keys
create table if not exists public.user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  github_token text,
  github_username text,
  vercel_token text,
  ethereum_rpc_url text,
  polygon_rpc_url text,
  discord_webhook_url text,
  slack_webhook_url text,
  openai_api_key text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_integrations enable row level security;

-- RLS Policies for user_integrations
create policy "Users can view their own integrations"
  on public.user_integrations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own integrations"
  on public.user_integrations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own integrations"
  on public.user_integrations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own integrations"
  on public.user_integrations for delete
  using (auth.uid() = user_id);

-- Create user_profiles table
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  onboarding_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- RLS Policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create indexes for performance
create index if not exists user_integrations_user_id_idx on public.user_integrations(user_id);
create index if not exists user_profiles_email_idx on public.user_profiles(email);
