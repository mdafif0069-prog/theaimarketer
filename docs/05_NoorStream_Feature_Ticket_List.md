# NoorStream — Feature Ticket List

**Version:** 1.0
**Last updated:** 2026-06-20
**Owner:** Product / Engineering

Legend — **Priority:** P0 (must-have MVP) · P1 (should-have) · P2 (nice-to-have).
**Status:** ☐ Todo · ◐ In progress · ☑ Done (in this repo's frontend MVP).

---

## Epic A — Foundation & Design System

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| A-1 | Project scaffold (React+Vite+Tailwind) | P0 | ☑ | App builds & runs; Tailwind configured. |
| A-2 | Design tokens & theme | P0 | ☑ | Noor color palette, gradients, fonts as tokens. |
| A-3 | Global layout (Navbar/Footer/shell) | P0 | ☑ | Responsive shell with routing outlet. |
| A-4 | Reusable UI kit (Card, Row, Skeleton, Modal, Toast, Badge) | P0 | ☑ | Components reused across pages; accessible. |
| A-5 | Mock API + data fixtures | P0 | ☑ | Typed mock catalog w/ simulated latency. |
| A-6 | Routing & code-splitting | P0 | ☑ | All pages routed; lazy-loaded. |

## Epic B — Browse & Discovery

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| B-1 | Home with hero spotlight | P0 | ☑ | Auto-rotating hero with CTAs. |
| B-2 | Curated content rows | P0 | ☑ | Multiple themed carousels, horizontal scroll. |
| B-3 | Continue Watching row | P0 | ☑ | Shows resume progress per profile. |
| B-4 | Browse/Category page + filters | P0 | ☑ | Grid + filter by category/tier/language. |
| B-5 | Title detail page | P0 | ☑ | Hero, synopsis, episodes, related. |
| B-6 | "Why is this suitable?" panel | P0 | ☑ | Noor Rating + suitability flags shown. |
| B-7 | Watchlist (My List) | P1 | ☑ | Add/remove; persists per profile (mock). |

## Epic C — Search & AI Discovery

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| C-1 | Instant search | P0 | ☑ | Results as you type across titles/topics. |
| C-2 | Search filters & empty states | P1 | ☑ | Filter chips; friendly empty/no-result UI. |
| C-3 | "Ask NoorStream" AI discovery | P0 | ☑ | NL prompt → matched catalog cards (mock AI). |
| C-4 | "For You" AI recommendation row | P1 | ☑ | Personalized row on home (mock ranking). |

## Epic D — Playback

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| D-1 | Video player w/ custom controls | P0 | ☑ | Play/pause, seek, volume, fullscreen, captions. |
| D-2 | Resume / continue watching sync | P0 | ☑ | Saves & restores position (mock). |
| D-3 | Next-episode autoplay (series) | P1 | ☐ | Auto-advance toggle for series. |
| D-4 | Skip intro / playback speed | P2 | ◐ | Speed control done; skip-intro pending markers. |

## Epic E — Profiles & Personalization

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| E-1 | Profile picker ("Who's watching?") | P0 | ☑ | Select/switch profiles. |
| E-2 | Kids Mode restricted catalog | P0 | ☑ | Kids profile sees only Kids-tier content. |
| E-3 | Parental PIN to exit Kids | P0 | ☑ | PIN required to leave/switch Kids profile. |
| E-4 | Add/edit profiles | P1 | ☐ | Create/edit avatar, name, kids flag. |

## Epic F — Accounts & Subscription

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| F-1 | Auth UI (sign in / sign up) | P0 | ☑ | Branded forms; validation; mock auth. |
| F-2 | Subscription tiers & paywall UI | P1 | ☑ | Free vs Premium plans page. |
| F-3 | Real backend auth (JWT/refresh) | P0 | ☐ | Replace mock with secure backend. |
| F-4 | Billing integration | P1 | ☐ | Payment provider checkout + webhooks. |

## Epic G — Settings, i18n & Accessibility

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| G-1 | Settings page | P1 | ☑ | Playback, language, parental controls. |
| G-2 | i18n + RTL (EN/AR) | P1 | ◐ | Language switch + RTL layout scaffolding. |
| G-3 | Accessibility pass (WCAG AA) | P0 | ◐ | Keyboard nav, focus, contrast, ARIA. |
| G-4 | Reduced-motion support | P2 | ☑ | Honors `prefers-reduced-motion`. |

## Epic H — Platform & Quality

| ID | Title | Pri | Status | Acceptance criteria |
|---|---|---|---|---|
| H-1 | Loading skeletons everywhere | P1 | ☑ | No raw spinners for primary content. |
| H-2 | Error boundaries & retry | P1 | ☑ | Graceful client error handling. |
| H-3 | Lint/build CI | P1 | ☐ | CI runs lint + build on PR. |
| H-4 | Unit/component tests | P1 | ☐ | Critical components covered. |
| H-5 | Backend services (catalog/playback) | P0 | ☐ | Replace mock API with real services. |

---

## Suggested next sprints (post-frontend-MVP)
1. **Backend integration:** H-5, F-3, F-4, B-* wired to real APIs.
2. **AI for real:** C-3/C-4 backed by catalog-scoped LLM + vector search.
3. **Quality gates:** H-3, H-4, finish G-2/G-3.
4. **Player polish:** D-3, D-4 with real HLS streams + DRM.
