# claude-figma-demo — Project Guide

## Project Overview

Mobile newsfeed PWA designed in Figma using the **Simple Design System (SDS)** community library. The design lives in Figma; code will be implemented as a mobile-first Progressive Web App.

---

## Figma Files

| File | Key | Purpose |
|---|---|---|
| Working design file | `94caEZQGpVHPkHnDItkOyK` | Primary canvas — all screens go here |
| SDS Fork (reference) | `e2JTB9Amzu8JSWyBeCeFvz` | Token + component source of truth |

**Current screens on Page 1:**
- `START HERE` — reference frame at 0,0
- `Newsfeed PWA` (node `12:2`) — mobile phone container at x≈220

---

## Design System: Simple Design System (SDS)

**Library key:** `lk-e0ffcff14368019c4f30f45401cd233d6cbc5f869988484192d04cbbef801fb0064ef68feaa8a2775ee4f1f05d9a4af1a6d07b2658eac4aefb7afb18728c4066`

All token definitions are in `design-map.json` at the project root (CSS vars, Figma variable keys, figma style keys).

### Component Keys (for `importComponentSetByKeyAsync`)

| Component | Key | Notes |
|---|---|---|
| Card | `a5bde480886231526d7dd890df3779dc15b52423` | 8 variants: Asset Type × Variant × Direction |
| Tag | `0fcd16616b41884b21451ffa4a2fc98a03093b49` | 20 variants: Scheme × State × Variant |
| Tab | `18aa207708b43593a2af7096b2dfd531553f3414` | 4 variants: State × Active |
| Navigation Button | `1d2523aed78254402984bbbffdf9010d30b6f35c` | 12 variants: State × Direction × Type |
| Navigation Pill | `e8a6afab337fee965cf758d46d54789201291803` | Horizontal scrollable nav pill |
| Navigation Pill List | `868412c34424ea9c8439205c1cd8007b88d7ca7b` | Pre-composed pill list |
| Button | `1b7d41996cc93c3946140388541559ae18b49b19` | Primary/secondary/ghost variants |
| Avatar | `9a1a72993b530357e185e7a1bae7dd57c267b6e7` | Note: may not be importable as component set |
| Tabs (section) | `b839f8a495ef7b0ef0a47ad1aefd6e05438825b5` | Full tabs section component |
| Notification | `8785d91eace7de54f025b67a9d918f8e20e32bda` | Alert/badge component |
| Input | `57629308da7716042bff804e7a6eb0c3a297b1bf` | Text fields, search, select |

### Key Component Property Names

| Component | Text Props | Boolean Props | Variant Props |
|---|---|---|---|
| Card | `Heading#280:0`, `Body#280:13` | `Asset#113:13`, `Button#113:15` | `Asset Type`, `Variant`, `Direction` |
| Tag | `Label#9765:0` | `Removable#147:0` | `Scheme`, `State`, `Variant` |
| Tab | `Label#157:36` | — | `State`, `Active` |
| Navigation Button | `Label#515:1` | `Has Label#515:8`, `Has Icon#515:5` | `State`, `Direction`, `Type` |

---

## Design Tokens

### Typography

- **Primary font:** Inter
- **Mono font:** Roboto Mono
- Font style names use spaces: `"Semi Bold"` not `"SemiBold"`, `"Extra Bold"` not `"ExtraBold"`

| Style | CSS Var | Size | Weight |
|---|---|---|---|
| titleHero | `--sds-text-title-hero` | 72 | 700 |
| titlePage | `--sds-text-title-page` | 48 | 700 |
| heading | `--sds-text-heading` | 24 | 600 |
| bodyBase | `--sds-text-body` | 16 | 400 |
| bodySmall | `--sds-text-body-small` | 14 | 400 |

### Semantic Colors (light/dark via CSS vars)

| Token | CSS Var |
|---|---|
| Background default | `--sds-bg-default` |
| Background secondary | `--sds-bg-default-secondary` |
| Text default | `--sds-text-default` |
| Text secondary | `--sds-text-secondary` |
| Text tertiary | `--sds-text-tertiary` |
| Border default | `--sds-border-default` |
| Brand | `--sds-bg-brand` |

Full token list (with Figma variable keys) is in `design-map.json`.

### Spacing Scale

`--sds-space-100` · `--sds-space-200` · `--sds-space-300` · `--sds-space-400` · `--sds-space-600`

### Border Radius

`--sds-radius-100` · `--sds-radius-200` · `--sds-radius-400`

---

## Mobile PWA Specs

- **Viewport:** 390 × 844px (iPhone 14 equivalent)
- **Safe areas:** Top 58px (dynamic island clearance), bottom 83px (nav bar + home indicator)
- **Content padding:** 16px horizontal
- **Card width in feed:** 358px (390 − 32px padding)

---

## Figma Design Workflow

### Required Skill Loading Order
1. Load `figma:figma-use` skill first — always
2. Load `figma:figma-generate-design` for new screens
3. Load `figma:figma-create-design-system-rules` when updating this file

### Before Creating Anything
1. Run `search_design_system` with the SDS library key to find existing components
2. Never recreate components that exist in SDS
3. Use `importComponentSetByKeyAsync` to bring in SDS components
4. Inspect variant names before assuming structure

### Screen-Building Rules
- Create the wrapper frame first, then build sections one `use_figma` call at a time
- Position new top-level frames to the right of the rightmost existing content
- Set `layoutSizingHorizontal = 'FILL'` **after** `parent.appendChild(child)`
- Validate with `get_screenshot` after every major section
- Return ALL created/mutated node IDs from every script

### DO NOT
- Hardcode hex colors — use SDS semantic CSS variables or import Figma variables
- Hardcode pixel spacing — use SDS spacing tokens
- Use `figma.notify()` — throws "not implemented"
- Set `figma.currentPage = page` — use `await figma.setCurrentPageAsync(page)`
- Use `console.log` — use `return` for output
- Call `SPACE_EVENLY` for `primaryAxisAlignItems` — not valid; use `SPACE_BETWEEN`
- Set `FILL` sizing before appending to parent

### Figma-to-Code Implementation Flow
1. `get_design_context` on the target node
2. `get_screenshot` for visual reference
3. Map Figma tokens → CSS variables (see `design-map.json`)
4. Reuse SDS code components from `@/components/ui/`
5. Validate visual parity against screenshot

---

## Code Implementation

### Tech Stack

- **Framework:** React 18 + TypeScript (Vite 6)
- **Styling:** SCSS modules — no CSS frameworks, no inline styles
- **PWA:** vite-plugin-pwa with Workbox (generateSW strategy)
- **API:** Newsdata.io (`VITE_NEWSDATA_API_KEY` env var)
- **Deploy:** Vercel (auto via `vercel.json`)

### Project Structure

```
src/
├── styles/
│   ├── _tokens.scss    ← All Figma design token values as SCSS vars
│   ├── _reset.scss     ← Minimal CSS reset
│   └── main.scss       ← Global styles (imports tokens + reset)
├── types/news.ts       ← Article + NewsResponse interfaces
├── utils/time.ts       ← formatTimeAgo()
├── hooks/useNews.ts    ← Fetch hook (loading/error states)
└── components/
    ├── PhoneFrame/     ← Desktop phone frame; full-screen on mobile
    ├── Header/         ← Title + search button
    ├── CategoryTabs/   ← Horizontal tab bar (Top/Tech/Business/Sports/Health)
    ├── ArticleCard/    ← Article row: meta → body (text + thumbnail)
    └── NewsFeed/       ← Composes Header + Tabs + scrollable ArticleCard list
scripts/
└── generate-icons.mjs  ← Pure Node.js PNG generator (run before dev/build)
public/icons/
├── icon-192.png
└── icon-512.png
```

### Design Token SCSS Variables

All in `src/styles/_tokens.scss`. Key values extracted from Figma node `12:2`:

| Variable | Value | Usage |
|---|---|---|
| `$color-bg-screen` | `#f9f9fa` | Screen/feed background |
| `$color-bg-phone` | `#1c1c1f` | Phone body, dynamic island |
| `$color-text-primary` | `#111111` | Article titles |
| `$color-text-publisher` | `#4f4f57` | Publisher name |
| `$color-text-meta` | `#87878f` | Time, description |
| `$color-divider` | `#e0e0e5` | Article separators |
| `$color-bg-thumbnail` | `#dadade` | Placeholder thumbnail fill |
| `$font-size-header-title` | `26px / 700` | "Your Latest News" heading |
| `$font-size-article-title` | `15px / 600` | Article headline |
| `$spacing-screen-edge` | `16px` | Left/right feed padding |
| `$spacing-article-pb` | `32px` | Bottom margin per article |
| `$thumbnail-size` | `80px` | Article image square |
| `$phone-width/height` | `430×900px` | Desktop frame dimensions |

### Styling Rules

- IMPORTANT: Never hardcode colors — always use `$color-*` tokens from `_tokens.scss`
- IMPORTANT: Never install new icon packages — inline SVG only
- Use `@use '../../styles/tokens' as *` in every module SCSS file
- SCSS modules for every component — no global class names except in `main.scss`
- Mobile-first: `@media (max-width: 767px)` overrides for full-screen mode

### PWA Config

- Service worker: NetworkFirst for `newsdata.io`, CacheFirst for images
- Icons generated by `scripts/generate-icons.mjs` (run automatically via predev/prebuild)
- Manifest: `display: standalone`, `theme_color: #1c1c1f`, `start_url: /`

### Desktop vs Mobile

- **≥768px:** PhoneFrame renders phone chrome (430×900, radius 52px, dark body)
- **<767px:** Phone chrome hidden via CSS — screen fills full viewport

### API

```
GET https://newsdata.io/api/1/latest
  ?apikey=${VITE_NEWSDATA_API_KEY}
  &country=us&language=en&category=top
  &prioritydomain=top&image=1&removeduplicate=1
```

Returns `{ status, results: Article[] }`. Hook in `src/hooks/useNews.ts`.

### Vercel Deployment

- `vercel.json` has SPA rewrite: all routes → `/index.html`
- Set `VITE_NEWSDATA_API_KEY` in Vercel project environment variables
