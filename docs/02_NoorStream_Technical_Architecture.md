# NoorStream — Technical Architecture

**Version:** 1.0
**Last updated:** 2026-06-20
**Owner:** Engineering

---

## 1. Architecture Overview

NoorStream is a **client–server streaming application**. The MVP frontend is a
single-page React application that talks to a set of backend services over a REST
(+ optional GraphQL) API gateway. Video is delivered via a CDN using adaptive
bitrate streaming (HLS).

```
                        ┌─────────────────────────────┐
                        │        Clients (Web)         │
                        │  React + Vite + Tailwind SPA │
                        └───────────────┬─────────────┘
                                        │ HTTPS / JSON
                                        ▼
                        ┌─────────────────────────────┐
                        │        API Gateway / BFF     │
                        │  Auth, rate limiting, routing│
                        └───┬───────┬───────┬──────┬───┘
                            │       │       │      │
              ┌─────────────┘  ┌────┘   ┌───┘   ┌──┘
              ▼                ▼        ▼       ▼
        ┌──────────┐   ┌────────────┐ ┌──────────┐ ┌─────────────┐
        │  Auth &  │   │  Catalog & │ │ Playback │ │   AI /      │
        │ Accounts │   │ Discovery  │ │ & Resume │ │ Recommend.  │
        └────┬─────┘   └─────┬──────┘ └────┬─────┘ └──────┬──────┘
             │               │             │              │
             ▼               ▼             ▼              ▼
        ┌──────────────────────────────────────────────────────┐
        │   Data layer: PostgreSQL · Redis · Object storage      │
        └──────────────────────────────────────────────────────┘
                                        │
                                        ▼
                        ┌─────────────────────────────┐
                        │     Video Pipeline + CDN     │
                        │  Transcode → HLS → Edge cache │
                        └─────────────────────────────┘
```

> **MVP note:** For the initial frontend deliverable in this repository, the app
> runs against a **typed mock API layer** (in-memory fixtures with simulated
> latency). This lets the full UI be developed and demoed before backend services
> exist, and the mock module exposes the exact interface the real API will fulfill.

---

## 2. Frontend Architecture

### 2.1 Stack
- **Framework:** React 18 (function components + hooks).
- **Build tool:** Vite 5 (fast HMR, ESM, optimized production build).
- **Styling:** Tailwind CSS 3 with a custom design-token theme (see Frontend Spec).
- **Routing:** React Router v6.
- **State:**
  - Server/cache state via lightweight custom hooks over the API/mock layer.
  - Cross-cutting UI state (current profile, auth, theme, language) via React
    Context providers.
- **Icons/animation:** lucide-react icons; CSS transitions + small Framer-style
  animation utilities (kept dependency-light).

### 2.2 Directory Structure
```
src/
  api/            # API client + typed mock data layer (swap-in real backend)
  components/     # Reusable UI: ContentCard, Row, Navbar, Player, Modal, etc.
  context/        # AuthContext, ProfileContext, ThemeContext
  hooks/          # useCatalog, useSearch, useContinueWatching, useRecommend
  pages/          # Home, Browse, Detail, Search, Player, Profiles, Auth, Settings
  data/           # Mock catalog fixtures
  lib/            # utils, formatters, constants
  styles/         # Tailwind entry + global CSS
  App.jsx
  main.jsx
```

### 2.3 Rendering & Performance
- Code-splitting per route via `React.lazy` + `Suspense`.
- Skeleton loaders for perceived performance.
- Image lazy-loading; responsive `srcset`-style sizes.
- Memoized rows/cards to avoid unnecessary re-renders.

---

## 3. Backend Services (target architecture)

| Service | Responsibility | Store |
|---|---|---|
| **Auth & Accounts** | Sign-up/in, sessions/JWT, profiles, subscription state, parental PIN. | PostgreSQL + Redis (sessions) |
| **Catalog & Discovery** | Titles, series/episodes, categories, suitability metadata, search index. | PostgreSQL + search engine (e.g. OpenSearch) |
| **Playback & Resume** | Signed playback URLs, resume positions, watch history events. | PostgreSQL + Redis |
| **AI / Recommendations** | "For You" rankings, "Ask NoorStream" NL query → catalog match, summaries/tags. | Vector store + LLM provider |
| **Billing** | Subscription lifecycle, webhooks from payment provider. | PostgreSQL |

Services are independently deployable; a thin **BFF/API gateway** aggregates calls
for the SPA and centralizes auth + rate limiting.

---

## 4. Data Model (core entities)

```
Account
  id, email, passwordHash, createdAt, subscriptionTier, billingCustomerId

Profile
  id, accountId, name, avatar, isKids, pinProtected, language

Title
  id, slug, type(movie|series|lecture|documentary|kids|quran|nasheed),
  title, synopsis, heroImage, posterImage, year, durationSec,
  audienceTier(kids|family|teens|general), noorRating,
  suitability { music, modesty, language, themes, reviewStatus },
  speakers[], topics[], languagesAvailable[], subtitleLanguages[]

Episode            # for series
  id, titleId, season, number, name, durationSec, synopsis, videoAssetId

VideoAsset
  id, hlsManifestUrl, qualities[], captions[]

WatchProgress
  profileId, titleId|episodeId, positionSec, updatedAt, completed

WatchlistItem
  profileId, titleId, addedAt
```

---

## 5. Key API Endpoints (contract)

```
POST   /auth/signup            POST /auth/login         POST /auth/logout
GET    /me                     GET  /profiles           POST /profiles
GET    /catalog/home           # curated rows for current profile
GET    /catalog/browse?category=&tier=&lang=
GET    /catalog/title/:slug
GET    /search?q=&filters...
GET    /recommend/for-you      # personalized row
POST   /ai/ask                 # { query } -> matched titles (catalog-scoped)
GET    /playback/:titleId      # signed manifest URL (auth + entitlement checked)
GET    /me/continue-watching   PUT /me/progress
GET    /me/watchlist           POST/DELETE /me/watchlist/:titleId
```

All responses JSON; all mutating + entitlement endpoints require a valid session.
The mock layer in `src/api/` implements these signatures so the real backend is a
drop-in replacement.

---

## 6. Video Pipeline

1. **Ingest** master files to object storage.
2. **Transcode** to multiple renditions (e.g., 1080p/720p/480p/240p) + audio
   tracks; package as **HLS** with captions/subtitles.
3. **Store** manifests + segments in object storage; serve through **CDN** with
   signed URLs (short-lived) gated by entitlement.
4. Client uses an HLS-capable player (native on Safari; hls.js elsewhere). The
   MVP frontend ships a player abstraction so the streaming engine can be swapped.

---

## 7. AI / Recommendations

- **"For You":** hybrid of collaborative signals (watch history) + content
  embeddings; re-ranked to respect the active profile's audience tier.
- **"Ask NoorStream":** user NL query → embedding → vector search over catalog →
  LLM re-rank/explain. **Hard constraint:** results are restricted to catalog IDs;
  the model is never allowed to invent or surface non-curated content.
- **Summaries/tags:** generated offline per title, human-reviewed before publish.
- Provider: latest Claude models (e.g. Claude Opus / Sonnet family) via server-side
  calls only — no API keys in the client.

---

## 8. Deployment & Infrastructure

- **Frontend:** static build (Vite) → CDN/static host (e.g., Vercel/Netlify/S3+CF).
- **Backend:** containerized services on a managed orchestrator; autoscaling.
- **CI/CD:** lint + test + build on PR; preview deploys; promote to prod on merge.
- **Observability:** structured logs, metrics, tracing; error tracking on client.
- **Environments:** `dev` → `staging` → `prod` with separate data + secrets.

---

## 9. Tech Decisions & Rationale

| Decision | Why |
|---|---|
| React + Vite | Fast DX, huge ecosystem, ideal for rich animated UI. |
| Tailwind + tokens | Consistent, themeable design system; rapid iteration; RTL-friendly. |
| Mock API first | Unblocks full UI/UX development & demo before backend exists. |
| HLS + CDN | Industry-standard adaptive streaming; broad device support. |
| Catalog-scoped AI | Preserves the halal-curation trust guarantee. |

---

## 10. Future Considerations
- Native mobile (React Native) sharing the API layer.
- Offline downloads (encrypted local cache).
- Live events (low-latency HLS / WebRTC).
- Multi-region CDN + DRM for premium licensed content.
