# SolitAir Social Hub ✈️

> In-house social media management for the SolitAir marketing team — plan,
> approve, publish and measure every channel from one place.

SolitAir Social Hub replaces paid SaaS tools (Hootsuite/Buffer class) for a
3-person marketing team. It covers a content calendar + scheduling, a
drafts/approval workflow, publishing to platforms via their official APIs (or
manual with reminders), cross-channel analytics, AI assistance (analytics Q&A +
caption refinement), and team/notification settings.

**Team:** Nabil (CMO — approver/admin), Afif & Arya (marketing executives — editors).

This repo currently ships **Phase 1**: a pixel-perfect React + Vite recreation of
the approved design prototype, running entirely on local state (no backend
required). The Supabase schema and a documented backend seam are in place so
Phase 2+ can be wired in without touching the UI.

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

No environment variables are needed for Phase 1 — the app runs on the seed data
in `src/data/`. Copy `.env.example` → `.env.local` when you start wiring Supabase
and the AI Edge Function.

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
  lib/
    ai.js             AI client seam (real Edge Function <-> local fallback)
    media.js          client-side media validation
supabase/
  schema.sql          Phase 2 Postgres schema
```

---

## 🔌 Backend seam (Phase 2+)

The app is backend-free today but structured to grow into the plan in
[`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md):

- **Data** — replace the `src/data/` fixtures with Supabase reads/writes against
  `supabase/schema.sql`. State shapes already match the table columns.
- **AI** — set `VITE_AI_ENDPOINT` to your deployed `ai` Edge Function. `src/lib/ai.js`
  will POST `/assistant` and `/refine-caption` instead of using the local fallback.
  The Anthropic key stays server-side — never in the browser.
- **Publishing / analytics** — cron Edge Functions (`publisher`, `analytics-sync`,
  `weekly-digest`) described in the handoff docs.

Backend jobs, platform API checklist, and the full data model live in
[`docs/HANDOFF.md`](docs/HANDOFF.md).

---

## 🧪 Verification

- `npm run build` — 46 modules compile clean.
- `npm run lint` — clean (one intentional fast-refresh warning on the store).
- `npm run smoke` — every screen + the composer render through React's server
  renderer without crashing.
- Interactive flows (navigation, composer + AI refine, kanban advance, analytics
  channel switching, connections toggle, AI chat) were driven end-to-end in a
  headless browser.
