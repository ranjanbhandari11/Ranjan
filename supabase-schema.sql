create table if not exists public.users (
  email text primary key,
  username text not null,
  username_lower text not null unique,
  password text not null,
  favorites jsonb not null default '[]'::jsonb,
  account_status text not null default 'active',
  deactivated_at timestamptz null,
  deleted_at timestamptz null,
  subscription jsonb not null default '{"plan":"Free Plan","status":"inactive"}'::jsonb,
  saved_recipes jsonb not null default '[]'::jsonb,
  recommendation_plan jsonb not null default '[]'::jsonb,
  shopping_list jsonb not null default '{"items":[],"weeklyDays":[]}'::jsonb,
  auth_notifications jsonb not null default '{"lastGoogleLoginEmailSentAt":"","lastSignupEmailSentAt":"","lastPasswordResetNoticeSentAt":""}'::jsonb,
  password_reset_token text not null default '',
  password_reset_expires_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists username text;
alter table public.users add column if not exists username_lower text;
alter table public.users add column if not exists password text;
alter table public.users add column if not exists favorites jsonb not null default '[]'::jsonb;
alter table public.users add column if not exists account_status text not null default 'active';
alter table public.users add column if not exists deactivated_at timestamptz null;
alter table public.users add column if not exists deleted_at timestamptz null;
alter table public.users add column if not exists subscription jsonb not null default '{"plan":"Free Plan","status":"inactive"}'::jsonb;
alter table public.users add column if not exists saved_recipes jsonb not null default '[]'::jsonb;
alter table public.users add column if not exists recommendation_plan jsonb not null default '[]'::jsonb;
alter table public.users add column if not exists shopping_list jsonb not null default '{"items":[],"weeklyDays":[]}'::jsonb;
alter table public.users add column if not exists auth_notifications jsonb not null default '{"lastGoogleLoginEmailSentAt":"","lastSignupEmailSentAt":"","lastPasswordResetNoticeSentAt":""}'::jsonb;
alter table public.users add column if not exists password_reset_token text not null default '';
alter table public.users add column if not exists password_reset_expires_at timestamptz null;
alter table public.users add column if not exists created_at timestamptz not null default now();
alter table public.users add column if not exists updated_at timestamptz not null default now();

update public.users
set username = coalesce(nullif(trim(username), ''), split_part(email, '@', 1))
where username is null or trim(username) = '';

update public.users
set username_lower = lower(trim(username))
where username_lower is null or trim(username_lower) = '';

update public.users
set password = 'PantryPal123'
where password is null or trim(password) = '';

update public.users
set favorites = '[]'::jsonb
where favorites is null;

update public.users
set subscription = '{"plan":"Free Plan","status":"inactive"}'::jsonb
where subscription is null;

update public.users
set saved_recipes = '[]'::jsonb
where saved_recipes is null;

update public.users
set recommendation_plan = '[]'::jsonb
where recommendation_plan is null;

update public.users
set shopping_list = '{"items":[],"weeklyDays":[]}'::jsonb
where shopping_list is null;

update public.users
set auth_notifications = '{"lastGoogleLoginEmailSentAt":"","lastSignupEmailSentAt":"","lastPasswordResetNoticeSentAt":""}'::jsonb
where auth_notifications is null;

update public.users
set password_reset_token = ''
where password_reset_token is null;

alter table public.users
  alter column username set not null,
  alter column username_lower set not null,
  alter column password set not null;

create unique index if not exists users_username_lower_key
on public.users (username_lower);

alter table public.users disable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create table if not exists public.account_deletions (
  id bigserial primary key,
  email text not null,
  username text not null default '',
  reason text not null,
  source text not null default 'hosted',
  user_agent text not null default '',
  deleted_at timestamptz not null default now()
);

alter table public.account_deletions add column if not exists email text;
alter table public.account_deletions add column if not exists username text not null default '';
alter table public.account_deletions add column if not exists reason text;
alter table public.account_deletions add column if not exists source text not null default 'hosted';
alter table public.account_deletions add column if not exists user_agent text not null default '';
alter table public.account_deletions add column if not exists deleted_at timestamptz not null default now();

alter table public.account_deletions disable row level security;
