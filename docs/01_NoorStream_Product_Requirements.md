# NoorStream — Product Requirements Document (PRD)

**Version:** 1.0
**Status:** Draft
**Last updated:** 2026-06-20
**Owner:** Product

---

## 1. Overview

**NoorStream** is a halal, family-safe video streaming platform — a "halal Netflix"
for the global Muslim community. *Noor* (نور) means "light." The platform curates
Islamic and family-friendly video content: lectures and khutbahs, documentaries,
original series, kids' shows, Quran & tafsir programs, and nasheeds (vocal-only),
all reviewed against a transparent content-suitability standard.

The product's promise: **press play without worry.** Every title is screened so
parents, students, and families can watch without manually vetting content for
inappropriate scenes, music, or messaging.

### 1.1 Problem Statement

- Mainstream streaming services mix high-quality production with content many
  Muslim families find objectionable (explicit scenes, gratuitous violence,
  anti-faith messaging), forcing constant manual filtering.
- Existing Islamic content is fragmented across YouTube channels, ad-heavy sites,
  and low-quality apps with poor discovery and no parental controls.
- There is no trusted, premium, ad-light "one place" with curation transparency.

### 1.2 Vision

Become the default trusted streaming home for Muslim families worldwide —
beautiful, fast, multilingual, and built around a clear content standard.

---

## 2. Goals & Non-Goals

### 2.1 Goals (v1)
- Curated catalog of halal video content with rich discovery.
- Per-profile experience including a dedicated, locked **Kids Mode**.
- Subscription monetization (free tier + premium).
- Fast, polished, accessible UI on web (responsive) first.
- Transparent content ratings ("Why is this suitable?").

### 2.2 Non-Goals (v1)
- Live streaming / live events (planned v2).
- User-generated content uploads (creator portal is v2+).
- Native mobile apps (responsive web first; React Native later).
- Social features (comments, following) beyond watchlist sharing.
- Downloads/offline (v2).

---

## 3. Target Users & Personas

| Persona | Description | Key needs |
|---|---|---|
| **Aisha, the Parent (35)** | Mother of 3, wants safe content for kids and family movie nights. | Kids Mode, parental PIN, trustworthy curation. |
| **Yusuf, the Student (21)** | University student seeking lectures & documentaries. | Good search, playlists, continue-watching across devices. |
| **Imam Bilal, the Educator (48)** | Shares structured Islamic education. | Series/season structure, bookmarks, multilingual subtitles. |
| **The Revert (29)** | New to Islam, wants beginner-friendly content. | Curated "Start Here" rows, clear topic taxonomy. |

---

## 4. Content Suitability Standard

Each title carries a **Noor Rating** and suitability metadata so the curation is
transparent, not a black box.

- **Audience tiers:** `Kids`, `Family`, `Teens`, `General`.
- **Suitability flags** (shown on detail page): music policy (none / vocal-only /
  background), visual modesty level, language, themes, scholarly review status.
- **Review status:** `Scholar-reviewed`, `Editorially-reviewed`, `Community-flagged`.

> Every title's detail page includes a **"Why is this suitable?"** panel listing
> the flags above. This transparency is a core product differentiator.

---

## 5. Functional Requirements

### 5.1 Browse & Discovery
- Home page with curated, themed rows (e.g., "New This Week," "Ramadan Picks,"
  "Start Here for Reverts," "Kids' Favorites," "Continue Watching").
- Category/genre browse: Lectures, Documentaries, Series, Kids, Quran & Tafsir,
  Nasheeds, Family Movies.
- Hero/featured banner with auto-rotating spotlight titles.
- Detail page: synopsis, Noor Rating, suitability panel, cast/speaker, episodes
  (for series), related titles, add-to-watchlist, play.

### 5.2 Search
- Instant search across titles, speakers, topics, and tags.
- Filters: audience tier, category, language, duration, review status.
- Empty-state suggestions and "did you mean" handling.

### 5.3 AI-Assisted Discovery (differentiator)
- **"Ask NoorStream"** conversational helper: natural-language requests like
  *"a 20-minute lecture on patience for my morning commute"* return matched titles.
- AI-generated **"For You"** recommendation row based on watch history & profile.
- AI-generated short, spoiler-free **content summaries** and topic tags.
- All AI suggestions are constrained to the curated catalog (no open-web results).

### 5.4 Playback
- Adaptive video player: play/pause, seek, volume, fullscreen, playback speed,
  subtitles/captions, audio track selection.
- **Continue Watching** with resume position synced per profile.
- Next-episode autoplay (toggleable), skip intro (where marked).
- Picture-in-picture (where browser supported).

### 5.5 Profiles & Personalization
- Up to 5 profiles per account; each with its own avatar, watchlist, history.
- **Kids Mode**: restricted catalog (Kids tier only), simplified UI, no search of
  general catalog, exit requires parental PIN.
- Watchlist (My List) and Continue Watching per profile.

### 5.6 Accounts & Subscription
- Sign up / sign in (email + OAuth providers).
- Tiers:
  - **Free:** limited catalog, standard definition, ad-supported (house ads only).
  - **Premium:** full catalog, HD, no ads, up to 5 profiles, multi-device.
- Manage subscription, billing history, payment method.

### 5.7 Settings
- Language (UI + preferred subtitle/audio), playback defaults, autoplay toggle,
  data-saver, parental controls & PIN, account management.

---

## 6. Non-Functional Requirements

- **Performance:** Largest Contentful Paint < 2.5s on broadband; route transitions
  feel instant (skeleton loaders, optimistic UI).
- **Accessibility:** WCAG 2.1 AA — keyboard navigable, captions, sufficient
  contrast, focus states, screen-reader labels.
- **Responsive:** Works from 360px mobile to large desktop / TV-ish widths.
- **i18n / RTL:** English + Arabic at launch; full right-to-left layout support.
- **Reliability:** 99.9% uptime target for the streaming/catalog APIs.
- **Privacy:** Minimal data collection; clear kids-data handling (COPPA-aware).

---

## 7. Success Metrics (KPIs)

| Metric | Target (6 months post-launch) |
|---|---|
| Weekly Active Users (WAU) | 50,000 |
| Free → Premium conversion | ≥ 5% |
| Avg. watch time / WAU / week | ≥ 90 min |
| Day-30 retention | ≥ 35% |
| Search → play conversion | ≥ 40% |
| "Ask NoorStream" usage among WAU | ≥ 15% |

---

## 8. Release Plan

- **MVP (v1.0):** Browse, search, detail, player, profiles + Kids Mode, auth,
  subscription, AI "For You" + "Ask NoorStream", EN/AR.
- **v1.1:** Watchlist sharing, improved recommendations, more languages.
- **v2.0:** Offline downloads, live events, creator portal, native mobile apps.

---

## 9. Assumptions & Risks

- **Content licensing & curation cost** is the biggest operational risk; mitigated
  by partnerships with established Islamic content producers.
- AI recommendations must never surface non-curated content — strict catalog
  scoping required.
- Halal-content trust depends on visible, consistent curation governance.
