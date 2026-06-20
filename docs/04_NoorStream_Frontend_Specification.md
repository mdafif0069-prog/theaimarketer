# NoorStream — Frontend Specification

**Version:** 1.0
**Last updated:** 2026-06-20
**Owner:** Design + Frontend

---

## 1. Design Principles

1. **Calm & premium** — cinematic dark canvas that lets posters shine; generous
   spacing; no clutter.
2. **Trust through transparency** — suitability info is always one tap away.
3. **AI-native** — conversational discovery ("Ask NoorStream") and "For You" feel
   integral, not bolted on.
4. **Fast & responsive** — skeletons, smooth transitions, works mobile → desktop.
5. **Inclusive** — WCAG 2.1 AA, full RTL/Arabic support, keyboard friendly.

---

## 2. Brand & Visual Identity

**Concept:** *Noor* = light. A warm light (gold/amber) emerging from a deep,
serene night (indigo/emerald-tinted dark) — calm, spiritual, premium.

### 2.1 Color Palette (design tokens)

| Token | Hex | Use |
|---|---|---|
| `--noor-bg` | `#0B1020` | App background (deep night) |
| `--noor-surface` | `#121A2E` | Cards, panels |
| `--noor-surface-2` | `#1A2440` | Raised/hover surfaces |
| `--noor-gold` | `#F5C451` | Primary accent (Noor / light) |
| `--noor-gold-soft` | `#FFE3A3` | Gradient highlight |
| `--noor-emerald` | `#1FB58F` | Secondary accent (Islamic green) |
| `--noor-emerald-deep` | `#0E7C63` | Emerald gradient end |
| `--noor-indigo` | `#5B6CFF` | AI / interactive accent |
| `--noor-text` | `#F4F6FB` | Primary text |
| `--noor-text-muted` | `#9AA4BF` | Secondary text |
| `--noor-danger` | `#FF6B6B` | Errors |

**Signature gradients:**
- *Noor glow:* `linear-gradient(135deg, #F5C451 → #FFE3A3 → #1FB58F)`.
- *AI accent:* `linear-gradient(135deg, #5B6CFF → #1FB58F)`.
- Hero overlays use bottom-up dark scrims for legibility.

### 2.2 Typography
- **Display/Headings:** a warm geometric sans (e.g., *Poppins* / system fallback).
- **Body/UI:** *Inter* / system UI stack.
- **Arabic:** *Noto Naskh Arabic* / *Cairo* for RTL.
- Scale: `text-xs … text-5xl`; tight leading on headings, relaxed on body.

### 2.3 Iconography & Imagery
- `lucide-react` line icons, 1.5px stroke.
- Posters 2:3, hero 16:9; rounded corners (`rounded-xl`/`2xl`); soft shadows;
  subtle gold ring on focus/hover for featured items.

### 2.4 Motion
- Durations 150–300ms, ease-out. Card hover: scale 1.04 + glow. Row scroll: smooth.
- Page transitions: fade/slide. Reduced-motion honored via `prefers-reduced-motion`.

---

## 3. Layout & Navigation

- **Top navbar** (transparent over hero, solidifies on scroll): logo, primary nav
  (Home, Browse, Categories), search, "Ask NoorStream" button, profile menu.
- **Mobile:** condensed nav + bottom-safe spacing; hamburger/secondary menu.
- **Footer:** brand, links, language switcher (EN/AR ⇄ LTR/RTL), legal.
- **Content rows:** horizontally scrollable carousels with snap + arrow controls.

---

## 4. Core Screens

### 4.1 Home
- Auto-rotating **hero** spotlight (title, synopsis, Noor Rating, Play + More Info).
- Stacked curated rows: Continue Watching, For You (AI), New This Week,
  Ramadan/Seasonal Picks, Kids' Favorites, Start Here, by category.

### 4.2 Browse / Category
- Filter bar (category, audience tier, language, duration, review status).
- Responsive grid of poster cards; skeletons while loading; empty states.

### 4.3 Title Detail
- Cinematic hero with backdrop, title, meta, Play / Add to List.
- **"Why is this suitable?"** panel: Noor Rating + suitability flags.
- Synopsis, speaker/cast, episodes list (series), related titles row.

### 4.4 Player
- Full-bleed video with custom controls: play/pause, seek bar w/ buffered range,
  volume, speed, captions toggle, fullscreen, PiP, back.
- Resume from saved position; next-episode autoplay (series); skip-intro.
- Controls auto-hide on idle; fully keyboard accessible.

### 4.5 Search + Ask NoorStream
- Instant results as you type; recent searches; filter chips.
- **Ask NoorStream** modal/drawer: chat-style input, example prompts, results
  rendered as cards. Visible AI-accent styling. (Catalog-scoped only.)

### 4.6 Profiles
- "Who's watching?" grid of avatars; add/edit; **Kids** profile clearly marked.
- Switching into/out of Kids requires parental PIN (PIN entry UI).

### 4.7 Auth
- Sign in / sign up with branded split layout (Noor glow side panel).

### 4.8 Settings
- Account, playback defaults, language/RTL, parental controls/PIN, subscription.

---

## 5. Component Library

| Component | Notes |
|---|---|
| `Navbar` | Scroll-aware, responsive, profile menu, Ask button. |
| `Hero` | Auto-rotating spotlight with scrim + CTAs. |
| `ContentRow` | Titled horizontal carousel with snap + arrows. |
| `ContentCard` | Poster, hover scale+glow, tier badge, quick add-to-list. |
| `SuitabilityPanel` | "Why is this suitable?" flags with icons. |
| `NoorRatingBadge` | Audience tier + review-status pill. |
| `VideoPlayer` | Custom controls, accessible, resume support. |
| `AskNoorStream` | AI chat-style discovery surface. |
| `FilterBar` | Chips/dropdowns for browse filters. |
| `ProfilePicker` / `PinPad` | Profile switch + parental PIN. |
| `Skeleton` | Shimmer placeholders for cards/rows/hero. |
| `Modal` / `Drawer` / `Toast` | Overlays & feedback. |
| `EmptyState` | Friendly empty/error illustrations + actions. |

All components: keyboard-operable, visible focus rings, ARIA labels, RTL-aware.

---

## 6. States & Feedback
- **Loading:** skeletons (never raw spinners for primary content).
- **Empty:** helpful copy + suggested actions.
- **Error:** non-technical message + retry.
- **Offline:** banner + cached UI where possible.

---

## 7. Accessibility (AA) Checklist
- Color contrast ≥ 4.5:1 for text; focus visible on all interactive elements.
- Full keyboard navigation (incl. carousels, player, modals with focus trap).
- Semantic landmarks, alt text, captions, ARIA where needed.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

---

## 8. Responsive Breakpoints
| Name | Width | Notes |
|---|---|---|
| `sm` | ≥ 640px | 2–3 cards/row |
| `md` | ≥ 768px | 3–4 cards/row, full nav |
| `lg` | ≥ 1024px | 4–6 cards/row |
| `xl` | ≥ 1280px | 6+ cards/row, large hero |

Base (mobile, < 640px): single-column hero, 2 cards/row, condensed nav.

---

## 9. Implementation Notes (this repo)
- Built with **React 18 + Vite + Tailwind CSS**; tokens defined in
  `tailwind.config.js` + CSS variables in the global stylesheet.
- Data from a typed **mock API layer** (`src/api/`) with simulated latency so the
  UI is fully interactive without a backend.
- Icons via `lucide-react`. Routing via `react-router-dom`.
