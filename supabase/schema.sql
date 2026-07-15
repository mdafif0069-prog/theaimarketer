-- SolitAir Social Hub — Postgres / Supabase schema (Phase 2).
-- Source of truth: README handoff "State & Data Model" section.
-- Apply with the Supabase SQL editor or `supabase db push`.

create extension if not exists "pgcrypto";

-- Team members ---------------------------------------------------------------
create table if not exists team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text unique not null,
  role        text,
  permission  text not null check (permission in ('Admin', 'Approver', 'Editor')),
  initials    text,          -- 2-letter avatar label used by the UI (e.g. NB, AF, AR)
  avatar_color text,
  created_at  timestamptz not null default now()
);

-- Posts ----------------------------------------------------------------------
create table if not exists posts (
  id                uuid primary key default gen_random_uuid(),
  title             text,
  copy              text,
  platform          text not null check (platform in ('linkedin','instagram','facebook','email','youtube')),
  status            text not null default 'draft'
                      check (status in ('idea','draft','review','scheduled','published','failed')),
  scheduled_at      timestamptz,
  campaign          text,
  assignee_id       uuid references team_members(id) on delete set null,
  requires_approval boolean not null default true,
  approver_id       uuid references team_members(id) on delete set null,
  publish_mode      text check (publish_mode in ('auto','manual')),
  reminder_minutes  int,
  platform_post_id  text,
  published_at      timestamptz,
  created_at        timestamptz not null default now()
);
create index if not exists posts_status_scheduled_idx on posts (status, scheduled_at);

-- Post media -----------------------------------------------------------------
create table if not exists post_media (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references posts(id) on delete cascade,
  storage_path text not null,
  kind         text not null check (kind in ('image','video','doc')),
  size_bytes   bigint,
  validated    boolean not null default false
);

-- Platform connections (tokens stay server-side only) ------------------------
create table if not exists connections (
  id             uuid primary key default gen_random_uuid(),
  platform       text unique not null,
  account_label  text,
  connected      boolean not null default false,  -- demo connect toggle until Phase 3 OAuth lands
  access_token   text,   -- store encrypted / in Supabase Vault, never expose to the browser
  refresh_token  text,
  expires_at     timestamptz,
  scopes         text,
  last_synced_at timestamptz
);

-- Analytics ------------------------------------------------------------------
create table if not exists analytics_daily (
  id              uuid primary key default gen_random_uuid(),
  platform        text not null,
  date            date not null,
  followers       int,
  reach           int,
  impressions     int,
  engagement_rate numeric,
  extra           jsonb,
  unique (platform, date)
);

create table if not exists post_metrics (
  id              uuid primary key default gen_random_uuid(),
  post_id         uuid not null references posts(id) on delete cascade,
  reach           int,
  engagement_rate numeric,
  likes           int,
  comments        int,
  shares          int,
  synced_at       timestamptz not null default now()
);

-- Workspace settings (singleton) ---------------------------------------------
create table if not exists workspace_settings (
  id               boolean primary key default true check (id),  -- single row
  approval_default boolean not null default true,
  reminder_default int not null default 30,
  timezone         text not null default 'Asia/Dubai',
  notif_reminders  boolean not null default true,
  notif_approvals  boolean not null default true,
  notif_published  boolean not null default true,
  notif_weekly     boolean not null default false,
  notif_channel    text not null default 'email' check (notif_channel in ('email','slack','both'))
);
insert into workspace_settings (id) values (true) on conflict (id) do nothing;

-- Status flow (enforced in app / Edge Functions):
--   idea -> draft -> review -> scheduled -> published
--   review -> scheduled only by an approver; scheduled -> published by the cron publisher.

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- This is an internal, single-workspace tool: every authenticated team member
-- may read and write the shared content. The approver-only rule (review ->
-- scheduled) is enforced in the app and should also be enforced server-side in
-- the Phase 3 publisher/approval Edge Function. Platform tokens live in the
-- `connections.access_token` column and must NEVER be sent to the browser, so
-- that column is only ever selected by Edge Functions (service role), never by
-- the anon/auth client.

alter table team_members       enable row level security;
alter table posts              enable row level security;
alter table post_media         enable row level security;
alter table connections        enable row level security;
alter table analytics_daily    enable row level security;
alter table post_metrics       enable row level security;
alter table workspace_settings enable row level security;

-- Helper: any signed-in user is a team member of this workspace.
do $$
declare t text;
begin
  foreach t in array array[
    'team_members','posts','post_media','connections',
    'analytics_daily','post_metrics','workspace_settings'
  ]
  loop
    execute format('drop policy if exists %I on %I;', t || '_auth_all', t);
    execute format(
      'create policy %I on %I for all to authenticated using (true) with check (true);',
      t || '_auth_all', t
    );
  end loop;
end $$;

-- NOTE: `connections` is readable by authenticated users for status/labels, but
-- the app client must select only non-secret columns. Prefer a view or an Edge
-- Function that omits access_token/refresh_token when exposing connection state.
