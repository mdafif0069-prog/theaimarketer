# Handoff: SolitAir Social Hub — internal social media tool

## Overview
SolitAir Social Hub is an in-house social media management tool for SolitAir (a regional airline). It replaces paid SaaS tools (Hootsuite/Buffer class) for a 3-person marketing team. It covers: content calendar + scheduling, drafts/approval workflow, publishing to platforms via their official APIs (or manual with reminders), cross-channel analytics, AI assistance (analytics Q&A + caption refinement), and team/notification settings.

Team: **Nabil (CMO — approver/admin)**, **Afif** and **Arya** (Marketing executives — editors).

## About the Design Files
The file `SolitAir Social Hub.dc.html` in this bundle is a **design reference / working prototype built in HTML**. It shows the intended look, copy, and behavior — it is NOT production code to ship. The task is to **recreate this design in a real app** (recommended: React + Vite frontend, Supabase backend) using the exact colors, spacing, and flows documented below. The prototype's logic class (bottom of the file) is a faithful reference for all interaction behavior and sample data shapes.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final. Recreate pixel-perfectly.

## Design Tokens
- Font: **Montserrat** (Google Fonts), weights 400/500/600/700/800. Everything uses it, including form controls.
- Background: `#F4F5F8` (app), `#FFFFFF` (cards), `#EDEFF4` (kanban columns), `#0E1220` (sidebar + dark cards)
- Text: `#14171F` primary, `#555A66` secondary, `#808080` muted, `#B9BEC9` faint, `#9AA0AE` (on dark)
- Brand: `#00FF57` (SolitAir green — sidebar accent, active nav), `#1044FF` (blue — primary buttons, links, LinkedIn), hover blue `#0B33CC`
- Platform colors: LinkedIn `#1044FF`, Instagram `#B049FF`, Facebook `#00B8F0`, Email `#808080`, YouTube `#FF4D3D`
- Status: success `#00A83A` (bg `rgba(0,168,58,.12)`), danger `#C43C3C`, review `#1044FF`, published badge `#14171F` w/ white text
- Borders: `#E4E7EE` (cards/inputs), `#F0F2F6` (row dividers)
- Radii: cards 14px, inputs/buttons 9–10px, chips 20px (pill), kanban cards 10px
- Card pattern: white bg, 1px `#E4E7EE` border, 20px padding
- Shadows: modal only — `0 20px 60px rgba(14,18,32,.3)`

## Screens

### 1. Sidebar (persistent, 224px, `#0E1220`)
Logo (`assets/solitair-logo.png`, transparent PNG, max-width 170px). Nav: Analytics, Calendar, Drafts & Backlog, Connections, AI Assistant, Team settings. Active item: `rgba(0,255,87,.12)` bg + `#00FF57` text; inactive `#9AA0AE`, hover bg `#1A2033`. Bottom: green "+ New post" button (`#00FF57`, dark text, opens composer) and current-user profile (avatar initials, name, role).

### 2. Analytics
- Header: title + date-range chips (6 months / 30 days / 7 days) + blue "↓ Export report" button (prototype: `window.print()`; production: generate a PDF/CSV monthly report).
- Channel tabs (pills): All channels / LinkedIn / Instagram / Facebook / Email / YouTube — all data below re-renders per channel.
- 4 KPI cards (label, big value, delta pill green/red, "vs June").
- Follower-growth line chart (SVG, Feb–Jul; per-channel lines dim to 12% opacity when another channel is selected; area fill under active line).
- Engagement bar chart (per channel or per engagement type when drilled in).
- Best-performing posts (ranked list: rank, platform dot, title, platform · date, reach, eng %).
- Posting consistency heatmap (6 weeks × 7 days, green scale `#EEF0F4 → #B4F5CB → #4FE388 → #00C34A`).
- Website card (dark): solitair.com sessions/bounce/bookings + green sparkline. Toggleable via prop.
- **Best time to post** card: per channel — dot, name, slot (e.g. "Tue · 9:00 AM"), uplift ("+41% eng.").
- **Suggested cadence** card: per channel — current → suggested posts/week + one-line note.

### 3. Calendar
July grid (Month/Week toggle) + platform filter pills. Month cells: day number (today = blue `#1044FF` square), post chips (platform-tinted bg, dot, time + title, ellipsis). Week view: 7 columns, day header (today = blue), post cards with left platform-color border, time · platform, title, status pill. Clicking any day opens the composer pre-filled with that date.

### 4. Drafts & Backlog (kanban)
5 columns: Idea backlog → Draft → In review → Scheduled → Published. Cards: platform dot + name, date, title, optional campaign pill, assignee avatar, "Advance →" button (moves to next column; labels: Draft / To review / Approve / Publish). Published cards have no advance.

### 5. Connections
Card per platform (LinkedIn, Instagram, Facebook, YouTube, Email): icon chip, account name, Connected/Not connected status pill, API name, permissions, last sync, Connect-via-OAuth / Disconnect button. Dark "How connections work" card: 1 Authorize once (OAuth) · 2 Publish via official APIs · 3 Analytics sync back.

### 6. AI Assistant
Provider pills (Claude built-in / Perplexity — Perplexity shows a note that an API key is required). Chat card (min-height 480px): empty state with ✦ icon, message bubbles (user right, blue `#1044FF`; assistant left, `#F0F2F6`), "Thinking…" bubble while busy, quick-prompt chips, input + Send (Enter submits).

### 7. Team settings
- Members list: avatar, name, email, role, permission badge (Admin dark / Approver blue / Editor grey), remove × (Nabil not removable). Invite row: email input + role select (Editor/Approver/Admin) + Invite button.
- Workspace defaults: "Approval required by default" toggle (feeds composer default), default reminder select, timezone select.
- Notifications: toggles — post reminders, approval requests, publish confirmations, weekly performance digest; delivery channel select (Email / Slack / both).

### 8. Composer modal (520px, opens from "+ New post" or any calendar day)
Fields in order:
1. **Channel** — platform chips (single select; selected = platform-color border + tint bg)
2. **Date / Time** — two inputs
3. **Post copy** — textarea + "✦ Refine caption with AI" button → AI suggestion box with "Use this caption"
4. **Media** — dashed dropzone (file input, multiple); below it the **per-platform allowed formats/sizes line** (see Media specs); uploaded files listed with size + OK / Too large / Not allowed status (red tint when invalid), removable
5. **Best time hint** — green banner "Best time for {platform}: {slot} — Apply" (sets the time field)
6. **Publishing** — Auto-publish (via API) vs Manual (reminder) option cards; **Reminder** select (none/10m/30m/1h/1d) + contextual note (auto → "publishes via X API"; not connected → "you'll get a reminder to post manually")
7. **Campaign** — free text input. **Assignee** — select (Afif/Arya/Nabil)
8. **Approval** — toggle "Require approval before publishing" (default ON) + approver select (Nabil — CMO). When ON, primary button = "Submit for approval" → status `review`; when OFF = "Schedule post" → status `scheduled`.
9. Footer: "Save as draft" (secondary) + primary button above.

### Media specs (validate client-side AND server-side)
- LinkedIn: image JPG/PNG ≤ 8 MB · video MP4 ≤ 5 GB / 10 min · document PDF ≤ 100 MB, 300 pages
- Instagram: image JPG/PNG ≤ 30 MB (ideal 1080×1350) · Reel MP4 ≤ 250 MB / 90 s · no documents
- Facebook: image ≤ 4 MB · video MP4 ≤ 10 GB / 240 min · no documents
- Email: inline images ≤ 1 MB each · attachments ≤ 10 MB total
- YouTube: video MP4/MOV ≤ 256 GB / 12 hrs · thumbnail JPG/PNG ≤ 2 MB

## State & Data Model (Supabase / Postgres)

```sql
team_members (id uuid pk, name text, email text unique, role text, permission text check (Admin|Approver|Editor), avatar_color text, created_at)
posts (id uuid pk, title text, copy text, platform text check (linkedin|instagram|facebook|email|youtube),
       status text check (idea|draft|review|scheduled|published|failed),
       scheduled_at timestamptz, campaign text, assignee_id fk team_members,
       requires_approval bool default true, approver_id fk team_members,
       publish_mode text check (auto|manual), reminder_minutes int,
       platform_post_id text, published_at timestamptz, created_at)
post_media (id uuid pk, post_id fk, storage_path text, kind text check (image|video|doc), size_bytes bigint, validated bool)
connections (id uuid pk, platform text unique, account_label text, access_token text encrypted, refresh_token text, expires_at, scopes text, last_synced_at)
analytics_daily (id, platform text, date date, followers int, reach int, impressions int, engagement_rate numeric, extra jsonb)
post_metrics (id, post_id fk, reach int, engagement_rate numeric, likes int, comments int, shares int, synced_at)
workspace_settings (singleton: approval_default bool, reminder_default int, timezone text, notif_reminders bool, notif_approvals bool, notif_published bool, notif_weekly bool, notif_channel text)
```

Status flow: `idea → draft → review → scheduled → published` (review→scheduled only by approver; scheduled→published by the cron publisher).

## Backend jobs (Supabase Edge Functions)
1. **publisher** (cron, every 5 min): find posts `status=scheduled AND scheduled_at <= now()`. `publish_mode=auto` → call platform API, save `platform_post_id`, set `published` (or `failed` + notify). `manual` → at `scheduled_at - reminder_minutes`, send reminder (email/Slack webhook) with copy + media links.
2. **analytics-sync** (cron, nightly): pull follower/reach/engagement per platform into `analytics_daily` and per-post metrics into `post_metrics`.
3. **ai** (on-demand): proxies Anthropic API (key stays server-side). Two routes: `refine-caption` (platform + draft copy → refined caption) and `assistant` (chat with system prompt embedding the workspace's KPIs, posts, best times, cadence — see prototype's `sendAi()` for the exact prompt shape).
4. **weekly-digest** (cron, Mon morning): summary email of all channels if enabled.

## Platform API checklist
- **LinkedIn**: app at developer.linkedin.com → Community Management API. OAuth 2.0, org URN for the company page. Publish: Posts API. Analytics: organizationalEntityShareStatistics.
- **Instagram + Facebook**: one Meta app (developers.facebook.com), Instagram must be Business + linked to FB Page. Graph API: `/media` + `/media_publish` (IG), `/feed` `/photos` (FB), `/insights` for both. Requires Meta App Review (allow 1–2 weeks).
- **YouTube**: Google Cloud project, YouTube Data API v3 (upload) + YouTube Analytics API. OAuth consent screen (internal).
- **Email**: ESP API (Mailchimp/Brevo): create+send campaign, fetch opens/clicks.
- **AI**: Anthropic Messages API (claude-haiku class is sufficient). Optional Perplexity key as second provider.
- Store all tokens server-side only (Supabase Vault / encrypted column). Never expose in the browser.

## Interactions & Behavior notes
- Filters, tabs, toggles are instant (no page loads). Kanban advance is optimistic.
- Composer validation: non-empty copy required to save; media validated against the platform spec table (re-validate when platform changes).
- Approval: submit-for-approval creates a `review` post and (production) notifies the approver; approver's "Approve →" on the board moves it to `scheduled`.
- Best-time "Apply" only sets the time input; best times/cadence are computed from `post_metrics` in production (hardcoded in prototype).
- Chat: Enter sends; disable input while awaiting response; show "Thinking…" bubble.

## Assets
- `assets/solitair-logo.png` — SolitAir logo, transparent background (use on dark sidebar).
- No other images; all icons are inline SVG (16px, stroke `currentColor`) — copy from the prototype.

## Files in this bundle
- `SolitAir Social Hub.dc.html` — the full prototype (markup + logic reference + all sample data)
- `assets/solitair-logo.png`
- `BUILD_PLAN.md` — phased self-build roadmap for a non-developer working with Claude Code

## Suggested first prompt for Claude Code
> Read README.md and BUILD_PLAN.md in this folder. We're on Phase 1–2: create a React + Vite app that recreates `SolitAir Social Hub.dc.html` pixel-perfectly (it's a design reference, not code to copy), backed by Supabase with the schema in README.md. Start with the Calendar screen and composer modal using local state, then wire Supabase.
