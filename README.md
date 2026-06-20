# NoorStream 🌙

> **The verified Islamic content platform.** Scholar-verified. Halal-only.

NoorStream is a **mobile-first** Islamic content app: a vertical, TikTok-style feed
of **scholar-verified** reels, an **AI Q&A** that answers with Quran & Hadith
references (madhab-aware, English/عربي), rich **scholar profiles** with courses, and
a personalised onboarding flow. The frontend runs entirely on mock data so it works
with no backend.

> **Design note:** This is a "new-generation" visual design — deep-midnight canvas
> with an **emerald → gold "Noor" (light)** gradient system and a **violet AI accent**,
> glassmorphism, animated aurora, and modern type (Sora / Inter / Amiri for Arabic).

---

## ✨ Screens

- **Onboarding** — Interests → Madhab → Language → Notifications → personalised summary
- **Feed** — vertical swipeable scholar reels (For You / Following), like / save / share,
  mute, segment progress; swipe, scroll-wheel, and arrow-key navigation
- **Ask AI** — Islamic Q&A chat: madhab selector, EN/عر toggle, dua cards (Arabic +
  transliteration + meaning), cited references, "ask a verified scholar" CTA
- **Scholar profile** — cover, verified badge, follow/notify, stats, badges, and
  About / Videos / Courses (enrol) / Reviews tabs
- **Search** — trending topics + top scholars
- **My Profile** — saved, history, courses, AI history, settings, restart demo

---

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # run ESLint
```

On desktop the app renders inside a centered phone frame with an ambient aurora; on
phones it's full-bleed. First load starts at onboarding — finish it to enter the app
(restart anytime from **Profile ▸ Restart onboarding demo**).

---

## 🧪 Verification

- `npm run build` — compiles & code-splits cleanly
- `npm run lint` — clean
- `npx vite-node scripts/smoke-pages.mjs` — renders every screen through React's
  server renderer to catch render-time crashes

> A headless browser isn't available in this environment (binary download blocked by
> network policy), so verification uses render smoke tests + code review.

---

## 🏗️ Tech stack

- **React 18** + **Vite 5** + **React Router 6**
- **Tailwind CSS 3** with custom design tokens (`tailwind.config.js`)
- **lucide-react** icons
- App state via a single `AppContext` (onboarding prefs, follows, saves) persisted to
  `localStorage`; mock content in `src/data/content.js`

```
src/
  components/  DeviceFrame, BottomNav, MainLayout, ErrorBoundary, ui atoms
  context/     AppContext (onboarding, follows, saves, preferences)
  data/        content.js (interests, madhabs, scholars, reels, AI knowledge)
  lib/         icons + utils
  pages/       Onboarding, Feed, AskAI, Search, ScholarProfile, MyProfile
  styles/      Tailwind entry + globals (aurora, glass, gradients)
```

---

## 🌐 Deploy to Netlify

This repo is preconfigured for Netlify (`netlify.toml` + SPA redirects).

1. [app.netlify.com](https://app.netlify.com) → **Add new site ▸ Import an existing project** → GitHub → `theaimarketer`.
2. Pick the branch; Netlify auto-detects settings (build `npm run build`, publish `dist`). **Deploy.**

Or drag the built `dist/` folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or use `npx netlify deploy --build --prod`.

---

## 📚 Product documentation

The `/docs` folder currently describes an earlier "halal-Netflix" concept and is being
revised to match this verified-content-platform direction.
