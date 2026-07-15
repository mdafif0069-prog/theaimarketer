# SolitAir Social Hub ✈️

> In-house social media management for the SolitAir marketing team — plan,
> approve, publish and measure every channel from one place.

SolitAir Social Hub replaces paid SaaS tools (Hootsuite/Buffer class) for a
3-person marketing team. It covers a content calendar + scheduling, a
drafts/approval workflow, publishing to platforms via their official APIs (or
manual with reminders), cross-channel analytics, AI assistance (analytics Q&A +
caption refinement), and team/notification settings.

**Team:** Nabil (CMO — approver/admin), Afif & Arya (marketing executives — editors).

**Status:** Phase 1 (pixel-perfect UI) is complete, and **Phase 2 (real shared
data + auth on Supabase)** is wired in behind config. The app runs two ways from
the same build:

- **Demo mode** (default, zero config) — local seed data, no login. Great for
  design review and running the tests.
- **Connected mode** — set two Supabase env vars and the calendar, board, team
  and composer read/write Postgres, gated by email login. See
  [`docs/PHASE2_SETUP.md`](docs/PHASE2_SETUP.md).

---

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # ESLint
npm run smoke    # render every screen through React's server renderer
```

No environment variables are needed to run — the app boots in demo mode on the
seed data in `src/data/`. To switch to connected mode, copy `.env.example` →
`.env.local`, add your Supabase URL + anon key, and follow
[`docs/PHASE2_SETUP.md`](docs/PHASE2_SETUP.md).

```bash
npm run test     # pure row<->model mapper unit tests (backend-free)
```

---

## 🖥️ Screens

All six screens from the handoff are implemented and interactive:

| Screen | What works today (local state) |
| --- | --- |
| **Analytics** | Per-channel drilldown tabs, KPI cards, follower-growth line chart, engagement bars, best posts, posting-consistency heatmap, website card, best-time & cadence widgets. Export → `window.print()`. |
| **Calendar** | July 2026 Month/Week views, platform filter pills, click any day to open the composer pre-filled with that date. |
| **Drafts & Backlog** | 5-column kanban (Idea → Draft → In review → Scheduled → Published) with optimistic "Advance →". |
| **Connections** | Per-platform connect/disconnect cards + "How connections work" explainer. |
| **AI Assistant** | Chat with quick prompts, provider pills, "Thinking…" state. Uses a local answer engine until the AI Edge Function is connected. |
| **Team settings** | Members list + invite, workspace defaults (approval/reminder/timezone), notification toggles. |
| **Composer modal** | Channel chips, date/time, copy + AI refine, per-platform media validation, best-time apply, auto/manual publishing, campaign/assignee, approval toggle. |

---

## 🎨 Design fidelity

The design tokens (colors, spacing, radii, typography — Montserrat) and all copy
are taken verbatim from the prototype and centralized in `src/constants.js`. The
prototype is a **design reference**, not shipped code; this app recreates it in
real React with the exact tokens.

---

## 🏗️ Tech stack & layout

- **React 18** + **Vite 5**, no router (tab-based navigation, single workspace)
- Inline styles matching the prototype 1:1 (see `src/components/ui.jsx` for the
  shared hover wrapper + toggle)
- A single **`HubProvider`** context (`src/store.jsx`) holds all workspace state
  with a class-style `setState`, mirroring the prototype's logic

```
src/
  constants.js        design tokens + domain constants (final)
  store.jsx           HubProvider: all state + actions
  App.jsx             layout + tab routing + modal mount
  components/
    Sidebar.jsx       nav + New post + current user
    ComposerModal.jsx the 520px scheduling modal
    ui.jsx            Hoverable, Toggle, ScreenHeader
  screens/            Analytics, Calendar, Drafts, Connections, AiAssistant, Team
  data/
    seed.js           initial posts / team / connections
    analytics.js      per-channel KPI + chart geometry
  api/
    mappers.js        pure Supabase row <-> app-model mappers (unit-tested)
    workspace.js      the one boundary that talks to Supabase (load + writes)
  lib/
    supabase.js       client, created only when env vars are set
    auth.js           email/password sign-in wrapper
    ai.js             AI client seam (real Edge Function <-> local fallback)
    media.js          client-side media validation
supabase/
  schema.sql          Postgres schema + RLS
  seed.sql            demo team / posts / connections
```

---

## 🔌 Backend (Phase 2, implemented)

Connected mode is live behind config. When `VITE_SUPABASE_URL` +
`VITE_SUPABASE_ANON_KEY` are set, the store loads the workspace on sign-in and
writes through on every mutation:

| Action | Table |
| --- | --- |
| Composer save (draft / review / scheduled) | `posts` insert |
| Board "Advance →" | `posts.status` update — **approver-gated** on review→scheduled |
| Connections connect/disconnect | `connections.connected` update |
| Team invite / remove | `team_members` |
| Workspace defaults + notification toggles | `workspace_settings` |

The seam is deliberately thin: `src/api/mappers.js` holds the pure row↔model
translation (with `npm run test` coverage), and `src/api/workspace.js` is the
only module that imports the Supabase client. Auth is email/password; the
signed-in email resolves to a `team_members` row for name, avatar and permission.

Full walkthrough: [`docs/PHASE2_SETUP.md`](docs/PHASE2_SETUP.md).

### Still ahead (Phase 3+)

- **AI** — set `VITE_AI_ENDPOINT` to your deployed `ai` Edge Function; `src/lib/ai.js`
  POSTs `/assistant` and `/refine-caption` instead of the local fallback. The
  Anthropic key stays server-side.
- **Publishing / analytics** — real OAuth tokens and cron Edge Functions
  (`publisher`, `analytics-sync`, `weekly-digest`) per the handoff docs.

Backend jobs, platform API checklist, and the full data model live in
[`docs/HANDOFF.md`](docs/HANDOFF.md).

---

## 🧪 Verification

- `npm run build` — compiles clean in both demo and connected (env-set) builds.
- `npm run lint` — clean (one intentional fast-refresh warning on the store).
- `npm run test` — 10 pure row↔model mapper unit tests pass.
- `npm run smoke` — every screen + the composer render through React's server
  renderer without crashing.
- Demo-mode flows (navigation, composer save + AI refine, kanban advance,
  analytics channel switching, connections toggle, AI chat) and the connected-mode
  **login gate** were driven end-to-end in a headless browser.
