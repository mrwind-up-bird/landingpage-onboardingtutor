# Landing Page — Next.js Migration & Feature Expansion

**Date:** 2026-03-11
**Status:** Approved

## Overview

Migrate the nyxCore Cognitive Vault landing page from a static HTML file to a Next.js App Router application with TypeScript and Tailwind CSS. Add i18n (EN/DE), interactive product demo, download section with OS detection, Airtable CTA integration, and enhanced micro-interactions. Deploy on Vercel.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **next-intl** for i18n (EN/DE, URL-based routing: `/en/`, `/de/`)
- **Vercel** deployment
- Server Actions for Airtable form submission

## Project Structure

```
app/
├── [locale]/
│   ├── layout.tsx         # Root layout with fonts, metadata, locale provider
│   ├── page.tsx           # Main landing page — composes all sections
│   └── not-found.tsx
├── layout.tsx             # Base HTML layout
└── globals.css            # Tailwind + Neo-Tokyo custom properties + keyframes
components/
├── canvas/
│   └── CodeRain.tsx       # Canvas code rain (client component)
├── layout/
│   ├── Nav.tsx            # Sticky nav with locale switcher
│   ├── Footer.tsx         # Links, badges, terminal easter egg
│   └── Scanlines.tsx      # CRT overlay
├── sections/
│   ├── Hero.tsx
│   ├── Problem.tsx
│   ├── Superpowers.tsx    # Manga panel cards with holographic tilt
│   ├── Demo.tsx           # Screenshot → "Try it live" trigger
│   ├── SocialProof.tsx
│   ├── Downloads.tsx      # OS detection + platform cards grid
│   ├── Pricing.tsx
│   ├── TechDeepDive.tsx   # Interactive architecture diagram
│   └── CtaFinal.tsx
├── demo/
│   └── DemoModal.tsx      # Full-screen modal with live iframe
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── HolographicCard.tsx
│   ├── AirtableForm.tsx   # Name, Email, Team Size, Use Case
│   └── Counter.tsx        # Animated number counter
└── effects/
    ├── Parallax.tsx
    └── TypeWriter.tsx
i18n/
├── config.ts              # Supported locales, default locale
├── middleware.ts           # Locale detection + redirect
└── messages/
    ├── en.json
    └── de.json
lib/
├── airtable.ts            # Server action for Airtable API
└── detect-os.ts           # Client-side OS/platform detection
middleware.ts              # i18n redirect middleware
tailwind.config.ts
next.config.ts
tsconfig.json
vercel.json
```

## Page Sections (top to bottom)

| # | Section | Key Interactions |
|---|---------|-----------------|
| 1 | Nav | Sticky, blur-on-scroll, EN/DE locale toggle, mobile hamburger |
| 2 | Hero | Code rain canvas, gradient headline animation, typewriter subtitle, parallax floating kanji |
| 3 | Problem | Scroll-reveal stagger, animated counters, "Ipcha Mistabra" inversion card |
| 4 | Superpowers | 4 holographic tilt manga panels, stat counters animate on scroll-in |
| 5 | Demo | Browser chrome frame with app screenshot, play button overlay → click opens DemoModal |
| 6 | Social Proof | Scroll-reveal quotes with Japanese quote marks, animated stat numbers |
| 7 | Downloads | OS auto-detect, 2x2 platform cards grid, detected OS highlighted with cyan glow, Docker card shows command with copy button |
| 8 | Pricing | 3 holographic tilt cards (Open Source / Team / Enterprise), CTAs open AirtableForm modal |
| 9 | Tech Deep Dive | Interactive SVG architecture diagram (hover highlights flow, click expands), security badges |
| 10 | CTA Final | Primary/secondary/tertiary buttons, primary opens AirtableForm |
| 11 | Footer | Links, trust badges, terminal easter egg (3 clicks), locale switcher, release version from GitHub |

## Key Components

### DemoModal
- Full-viewport dark overlay with backdrop blur
- Iframe pointing to hosted demo sandbox (`NEXT_PUBLIC_DEMO_URL`)
- Loading spinner while iframe loads
- Close via Escape key, click-outside, or close button
- **Open transition:** CSS `scale(0.9) → scale(1)` + `opacity(0→1)`, 300ms ease-out. No FLIP/position measurement — simple center-screen scale-up.
- **Close transition:** reverse (scale down + fade), 200ms ease-in
- If `NEXT_PUBLIC_DEMO_URL` is not set, Demo section shows screenshot only with "Coming soon" badge instead of play button

### AirtableForm
- Modal overlay triggered by CTA buttons
- Single-column layout: Name (text), Email (email), Team Size (pill selector: 1-5, 6-20, 21-50, 50+), Use Case (dropdown: Onboarding, Architecture, Code Review, Knowledge Base, Other)
- Submits via Next.js Server Action to Airtable REST API
- Client-side validation: Name required, Email format check, Team Size required. Use Case optional.
- **States:** idle → submitting (spinner, button disabled) → success (checkmark + "We'll be in touch!" message, auto-close after 2s) → error (inline error message + "Try again" button, max 2 retries then show "Contact us" fallback link)
- **Error handling:** catches network errors and non-2xx Airtable responses. No retry backoff — immediate retry on user click.
- No credit card messaging

### DownloadCards
- Client-side OS detection via `navigator.userAgentData` (with `navigator.platform` fallback)
- 2x2 grid of platform cards:
  - **macOS** — `Onboarding.Tutor-{version}-universal.dmg` (180 MB)
  - **Windows** — `Onboarding.Tutor.Setup.{version}.exe` (85.3 MB)
  - **Linux** — `Onboarding.Tutor-{version}.AppImage` (110 MB) + `.deb` (85.5 MB)
  - **Docker + Ollama** — `docker compose up` command with copy-to-clipboard
- Detected OS card highlighted with cyan border glow
- Links to public GitHub releases repo: `https://github.com/{org}/{repo}/releases/latest/download/{filename}`
- Version from `NEXT_PUBLIC_RELEASE_VERSION` env var (no "v" prefix, e.g., `1.1.0`), interpolated into filenames
- Expandable SHA-256 verification hashes
- "View all releases" link to GitHub
- **OS detection fallback chain:** `navigator.userAgentData.platform` → `navigator.platform` → default to showing all cards without highlight

### CodeRain
- Canvas element, fixed behind all content
- Katakana + latin characters falling in columns
- Lead character bright white/cyan, trail fades
- Pauses when tab not visible (`visibilitychange`)
- Disabled when `prefers-reduced-motion: reduce`
- Low opacity (~0.12) so content remains readable

### InteractiveArch
- SVG-based architecture diagram: Sources → CKB Engine → AI + Frontend
- Hover a node: highlights connected edges, dims unrelated nodes
- Click a node: popover with details (tools list, supported providers, etc.)
- Animated dashed connection lines between blocks

### Counter
- IntersectionObserver triggers count-up animation
- Easing function for natural deceleration
- Configurable: target number, duration, prefix/suffix

### HolographicCard
- Mousemove tracking for `perspective` + `rotateX/Y` transform
- Radial gradient shine layer follows mouse position
- Smooth reset transition on mouse leave

### LocaleSwitcher
- EN/DE flag toggle in nav
- Uses `next-intl` `useRouter` + `usePathname` for locale switching
- Preserves current page path on switch

### TypeWriter
- Character-by-character text reveal
- Configurable speed and delay
- Blinking cursor at end

## i18n Strategy

- **next-intl** with App Router integration
- `middleware.ts` detects `Accept-Language` header, redirects `/` → `/en/` or `/de/`
- URL structure: `/{locale}/` (e.g., `/en/`, `/de/`)
- Default locale: `en`
- Translation files: `i18n/messages/en.json`, `i18n/messages/de.json`
- All UI text, section headings, form labels, button text, meta descriptions translated
- Japanese accent text (kanji section labels) stays the same in both locales

## Design System — "Neo-Tokyo Terminal"

Ported from existing HTML to Tailwind:

### Colors (CSS custom properties)
```
--bg-void: #070212
--bg-deep: #0d0618
--bg-primary: #1a0b2e
--bg-card: #1e1035
--cyan: #00f5ff
--orange: #ff6b35
--purple: #8b5cf6
--green: #00ff88
--red: #ff3366
--text-primary: #e8e6f0
--text-muted: #7a7590
--text-dim: #4a4565
```

### Typography
- **JetBrains Mono** — headings, code, labels, nav
- **Inter** — body text
- **Noto Sans JP** — Japanese accent characters

### Effects
- CRT scanlines overlay (CSS pseudo-element, pointer-events: none)
- Holographic card tilt (JS mousemove + CSS transform)
- Scroll progress bar (gradient: cyan → purple → orange)
- Terminal mode easter egg (green-on-black theme toggle)

## External Dependencies

### Airtable
- REST API for form submissions
- Env vars: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_NAME`
- Fields: Name, Email, Team Size, Use Case, Timestamp, Locale

### GitHub Releases (public repo)
- Separate public repo for release binaries
- Landing page links to `https://github.com/{org}/{repo}/releases/latest/download/{filename}`
- Env vars: `NEXT_PUBLIC_RELEASES_REPO`, `NEXT_PUBLIC_RELEASE_VERSION`

### Demo Sandbox
- Hosted OnboardingTutor instance with pre-indexed sample repo
- Separate deployment (not part of this spec)
- Env var: `NEXT_PUBLIC_DEMO_URL`

## Environment Variables

```
# Airtable
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
AIRTABLE_TABLE_NAME=...

# External URLs
NEXT_PUBLIC_DEMO_URL=https://demo.onboardingtutor.dev
NEXT_PUBLIC_RELEASES_REPO=https://github.com/org/releases
NEXT_PUBLIC_RELEASE_VERSION=1.1.0
```

## Out of Scope

- Demo sandbox backend deployment and pre-indexed sample repo
- Public releases repo setup and CI pipeline
- Airtable base/table creation
- Actual binary uploads
- Analytics/tracking integration
- SEO optimization beyond basic meta tags
