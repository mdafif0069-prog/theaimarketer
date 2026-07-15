# SolitAir Social Hub — self-build roadmap

For a non-developer building this with Claude Code. Do the phases in order; each phase is useful on its own.

## Phase 0 — Tools (1 day)
- Install VS Code, Node.js (LTS), Git; create a GitHub account.
- Install Claude Code (terminal coding agent). You describe features; it writes/fixes the code.
- Accounts to create (all free tiers): Supabase, Vercel, Anthropic API.

## Phase 1 — Run it outside Claude (a weekend)
- Have Claude Code scaffold a React + Vite app recreating the prototype UI (README.md has every token and screen spec).
- Deploy to Vercel. Win: the team opens it at a real URL (data still local/fake).

## Phase 2 — Real shared data (1–2 weeks) ← already replaces a paid tool
- Create Supabase project; apply the schema from README.md.
- Wire composer → `posts` table; calendar/board/team screens read from it.
- Add Supabase Auth (email login for Nabil, Afif, Arya). Permissions: only Nabil can approve.
- Reminders can be manual-mode only for now (Phase 3 automates them).

## Phase 3 — First platform connection: LinkedIn (1–2 weeks)
- Create app at developer.linkedin.com, request Community Management API.
- OAuth flow → store tokens in Supabase (server-side only).
- Edge Function on a 5-min cron: publish due auto posts; send reminder emails/Slack for manual posts.

## Phase 4 — Remaining platforms (one at a time)
- Meta app (Instagram + Facebook) — submit App Review early; it takes 1–2 weeks of waiting.
- YouTube (Google Cloud + Data API v3), then your email provider's API.
- Nightly analytics-sync cron → `analytics_daily` + `post_metrics`; point the Analytics screen at real data.

## Phase 5 — AI (a few days)
- Anthropic API key in an Edge Function (never in the browser).
- Routes: refine-caption and assistant chat (prompt shape is in the prototype's `sendAi()`).
- Optional: Perplexity as a second provider.

## Ongoing costs
Supabase free tier + Vercel free tier + AI usage (a few $/month) ≈ **$0–10/month**.

## Rules of thumb
- Test after every small change; paste any error into Claude Code and ask it to fix.
- Never put API keys/tokens in frontend code — always in Supabase Edge Functions / secrets.
- Commit to GitHub after every working step so you can always roll back.
