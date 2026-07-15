-- SolitAir Social Hub — demo seed data (Phase 2).
-- Reproduces the prototype's sample workspace. Apply AFTER schema.sql:
--   supabase db reset            (runs schema.sql then seed.sql), or
--   paste schema.sql then seed.sql into the SQL editor.
--
-- Team member ids are fixed so posts can reference them deterministically.
-- After seeding, create matching Auth users (same emails) so people can log in
-- — see docs/PHASE2_SETUP.md.

-- Team -----------------------------------------------------------------------
insert into team_members (id, name, email, role, permission, initials, avatar_color) values
  ('00000000-0000-0000-0000-000000000001', 'Nabil', 'nabil@solitair.com', 'CMO',                  'Admin',  'NB', '#14171F'),
  ('00000000-0000-0000-0000-000000000002', 'Afif',  'afif@solitair.com',  'Marketing executive',  'Editor', 'AF', '#1044FF'),
  ('00000000-0000-0000-0000-000000000003', 'Arya',  'arya@solitair.com',  'Marketing executive',  'Editor', 'AR', '#B049FF')
on conflict (id) do nothing;

-- Posts ----------------------------------------------------------------------
insert into posts (title, copy, platform, status, scheduled_at, campaign, assignee_id, requires_approval, approver_id, publish_mode, reminder_minutes) values
  ('SolitAir Series B announcement','SolitAir Series B announcement','linkedin','published','2026-07-02T09:00:00','Brand Awareness','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Reel: behind the scenes with our ops team','Reel: behind the scenes with our ops team','instagram','published','2026-07-03T17:30:00','Summer Launch','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Customer story: Meridian Air','Customer story: Meridian Air','facebook','published','2026-07-06T11:00:00',null,'00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('July newsletter','July newsletter','email','published','2026-07-08T08:00:00','Newsletter Q3','00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Carousel: 5 tips for stress-free travel','Carousel: 5 tips for stress-free travel','instagram','published','2026-07-09T18:00:00','Summer Launch','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Hiring: growth marketer','Hiring: growth marketer','linkedin','published','2026-07-13T09:30:00',null,'00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Summer sale teaser','Summer sale teaser','instagram','published','2026-07-14T17:00:00','Summer Launch','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Flash sale is live — 48h only','Flash sale is live — 48h only','facebook','scheduled','2026-07-15T12:00:00','Summer Launch','00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('CEO op-ed: the future of regional air travel','CEO op-ed: the future of regional air travel','linkedin','review','2026-07-16T10:00:00','Brand Awareness','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Reel: destination spotlight — Lisbon','Reel: destination spotlight — Lisbon','instagram','scheduled','2026-07-17T18:30:00','Summer Launch','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Mid-month product update','Mid-month product update','email','draft','2026-07-20T08:00:00','Newsletter Q3','00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Case study: 40% faster bookings','Case study: 40% faster bookings','linkedin','draft','2026-07-22T09:00:00','Brand Awareness','00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('UGC roundup: your summer trips','UGC roundup: your summer trips','instagram','idea','2026-07-24T17:00:00','Summer Launch','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Community Q&A announcement','Community Q&A announcement','facebook','draft','2026-07-27T12:00:00',null,'00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Summer wrap-up newsletter','Summer wrap-up newsletter','email','idea','2026-07-29T08:00:00','Newsletter Q3','00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Monthly metrics recap','Monthly metrics recap','linkedin','idea','2026-07-31T09:00:00',null,'00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Video: a day in the life of our cabin crew','Video: a day in the life of our cabin crew','youtube','published','2026-07-10T16:00:00','Brand Awareness','00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Video: how we turn a plane around in 25 minutes','Video: how we turn a plane around in 25 minutes','youtube','review','2026-07-21T15:00:00','Brand Awareness','00000000-0000-0000-0000-000000000003',true,'00000000-0000-0000-0000-000000000001','auto',30),
  ('Video: Q3 new routes announcement','Video: Q3 new routes announcement','youtube','idea','2026-07-30T15:00:00',null,'00000000-0000-0000-0000-000000000002',true,'00000000-0000-0000-0000-000000000001','auto',30);

-- Connections (demo state: everything but YouTube connected) ------------------
insert into connections (platform, account_label, connected, scopes, last_synced_at) values
  ('linkedin',  'SolitAir · Company page',        true,  'Post, comments, page analytics', now()),
  ('instagram', '@solitair · Business account',   true,  'Publish, reels, insights',       now()),
  ('facebook',  'SolitAir · Page',                true,  'Publish, page insights',         now()),
  ('email',     'hello@solitair.com',             true,  'Campaigns, opens, clicks',       now()),
  ('youtube',   'SolitAir · Channel',             false, 'Upload, channel analytics',      null)
on conflict (platform) do nothing;

-- Workspace settings already has its singleton row from schema.sql defaults
-- (approval on, 30-min reminder, Asia/Dubai). Adjust here if you want different
-- demo defaults.
