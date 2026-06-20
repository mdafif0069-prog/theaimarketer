# NoorStream 🌙

> **Halal, family-safe video streaming.** Press play without worry.

NoorStream is a "halal Netflix" — a curated streaming platform for Islamic and
family-friendly video content (lectures, documentaries, series, kids' shows, Quran
& tafsir, nasheeds, family movies). Every title is reviewed against a transparent
content-suitability standard, and an AI assistant ("Ask NoorStream") helps you
find the perfect thing to watch — always scoped to the curated catalog.

This repository contains the **product documentation** and a fully interactive
**React frontend** (running against a typed mock API, so it works with no backend).

---

## ✨ Highlights

- **Cinematic, AI-flavored UI** — deep "night" canvas with a warm gold→emerald
  "Noor" (light) palette, gradient posters, glow effects, and smooth motion.
- **Ask NoorStream** — a conversational, catalog-scoped AI discovery drawer.
- **For You** AI recommendation row + curated themed rows.
- **Kids Mode** with a real parental-PIN gate to switch out (defense in depth).
- **Custom video player** — seek, volume, speed, captions, fullscreen, resume,
  keyboard shortcuts.
- **Search** with instant results, filters, and graceful empty states.
- **Profiles, Watchlist, Continue Watching** — all persisted locally.
- **Accessible & responsive** — keyboard nav, focus rings, reduced-motion support,
  mobile → desktop layouts.

---

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # run ESLint
```

### Demo credentials
- **Sign in:** any valid email + any 6+ character password.
- **Parental PIN (to exit Kids Mode):** `1379`

---

## 🧪 Verification

The app was validated with:

- `npm run build` — all modules compile and tree-split correctly.
- `npm run lint` — clean.
- `scripts/smoke.mjs` & `scripts/smoke-pages.mjs` — render every route/page through
  React's server renderer to catch render-time crashes
  (`npx vite-node scripts/smoke-pages.mjs`).

> A headless browser wasn't available in the build environment (binary download is
> blocked by the network policy), so interactive testing was done via the render
> smoke tests + manual code review rather than a live click-through.

---

## 🏗️ Tech stack

- **React 18** + **Vite 5** + **React Router 6**
- **Tailwind CSS 3** with custom design tokens (`tailwind.config.js`)
- **lucide-react** icons
- Typed **mock API layer** (`src/api/client.js`) mirroring the real backend
  contract — swap in a real backend without touching the UI.

```
src/
  api/         mock API client (drop-in for real backend)
  components/  reusable UI (Navbar, Hero, ContentCard/Row, Player parts, AskNoorStream…)
  context/     Auth/Profile/Watchlist/Progress, Toast, Ask drawer
  data/        mock catalog fixtures
  hooks/       useAsync data hook
  lib/         utils & formatters
  pages/       Home, Browse, Detail, Search, Player, Profiles, Login, Settings, Plans
  styles/      Tailwind entry + globals
```

---

## 🌐 Deploy to Netlify

This repo is preconfigured for Netlify (`netlify.toml` + SPA redirects).

**Easiest — connect the repo (continuous deploy):**
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site ▸ Import an existing project**.
2. Connect GitHub and pick `theaimarketer`; choose the branch you want to deploy.
3. Netlify auto-detects the settings from `netlify.toml` (build: `npm run build`,
   publish: `dist`). Click **Deploy**. You'll get a live URL.

**Or — drag & drop (no Git connection):**
```bash
npm install && npm run build   # produces dist/
```
Then drag the `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).

**Or — Netlify CLI:**
```bash
npm i -g netlify-cli
netlify deploy --build --prod
```

> The included SPA fallback ensures deep links (e.g. `/browse`, `/title/...`) work
> on direct load and refresh.

---

## 📚 Documentation

See [`/docs`](./docs):

1. [Product Requirements](./docs/01_NoorStream_Product_Requirements.md)
2. [Technical Architecture](./docs/02_NoorStream_Technical_Architecture.md)
3. [Security & Access](./docs/03_NoorStream_Security_and_Access.md)
4. [Frontend Specification](./docs/04_NoorStream_Frontend_Specification.md)
5. [Feature Ticket List](./docs/05_NoorStream_Feature_Ticket_List.md)

---

## 🔮 Notes & next steps

The frontend is intentionally backend-free for this milestone. To go live, replace
`src/api/client.js` with calls to the real services described in the architecture
doc (auth/JWT, catalog, playback entitlement, catalog-scoped LLM for "Ask
NoorStream"), and wire up HLS playback + billing. See the
[Feature Ticket List](./docs/05_NoorStream_Feature_Ticket_List.md) for the
prioritized backlog.
