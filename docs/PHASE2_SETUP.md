# Phase 2 — wiring real shared data (Supabase)

By the end of this you'll have Nabil, Afif and Arya logging in with email +
password and sharing one live content workspace — the calendar, board, team and
composer all read/write Postgres instead of local seed data.

The app runs in **demo mode** (local seed, no login) until you set the two
Supabase env vars below. Nothing here touches the UI — it's all config + SQL.

## 1. Create a Supabase project

1. Sign in at [supabase.com](https://supabase.com) → **New project** (free tier is fine).
2. Note the **Project URL** and the **anon public** key from *Project Settings → API*.

## 2. Apply the schema and seed

In the Supabase **SQL Editor**, run these two files from this repo, in order:

1. [`supabase/schema.sql`](../supabase/schema.sql) — tables, indexes, RLS.
2. [`supabase/seed.sql`](../supabase/seed.sql) — the demo team, posts and connections.

(Or, with the Supabase CLI: `supabase db reset` picks both up.)

## 3. Create the login accounts

The seed inserts the three team members as **rows**; they still need **Auth
users** with the same emails so they can sign in.

In *Authentication → Users → Add user*, create (email confirmed) users for:

| Email | Suggested role |
| --- | --- |
| `nabil@solitair.com` | approver/admin — the only one who can approve posts |
| `afif@solitair.com` | editor |
| `arya@solitair.com` | editor |

The app matches the signed-in email to a `team_members` row to resolve the
person's name, avatar and permission. Keep the emails identical.

> Approval rule: advancing a card from **In review → Scheduled** is allowed only
> for members whose permission is `Admin` or `Approver` (i.e. Nabil). Editors get
> a "Only an approver can approve" notice. This is enforced in the app; enforce
> it server-side too when you build the Phase 3 publisher/approval function.

## 4. Point the app at your project

Copy `.env.example` → `.env.local` and fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Restart `npm run dev`. You should now see the **Sign in** screen; log in as any of
the three users and the workspace loads from Postgres. Create a post in the
composer, reload — it's still there. Open the app as a second user in another
browser and you'll see each other's changes after a refresh.

## What persists in Phase 2

| Action | Table |
| --- | --- |
| Composer → Save draft / Submit for approval / Schedule | `posts` (insert) |
| Board "Advance →" | `posts.status` (update; approver-gated on review→scheduled) |
| Connections connect/disconnect | `connections.connected` (update) |
| Team invite / remove | `team_members` (insert / delete) |
| Workspace defaults + notification toggles | `workspace_settings` (update) |

## Security notes

- The **anon key is browser-safe**; RLS is what protects the data. Every
  authenticated team member can read/write the shared workspace (this is an
  internal tool).
- **Never** expose `connections.access_token` / `refresh_token` to the browser.
  Those columns are for Edge Functions (service role) only — select connection
  state through a view or function that omits them. Real OAuth tokens arrive in
  **Phase 3**.
- Live realtime sync (no refresh) and the publish/reminder/analytics cron jobs
  are later phases — see [`docs/BUILD_PLAN.md`](./BUILD_PLAN.md).
