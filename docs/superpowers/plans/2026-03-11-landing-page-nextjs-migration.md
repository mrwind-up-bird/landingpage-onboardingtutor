# nyxCore Landing Page — Next.js Migration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the static HTML landing page to a Next.js 15 App Router app with TypeScript, Tailwind CSS v4, i18n (EN/DE), Airtable CTA, download section, interactive demo modal, and Vercel deployment.

**Architecture:** Single-page landing page with lazy-loaded section components. All text externalized to next-intl JSON files. Airtable form uses Server Actions. Downloads link to a public GitHub releases repo. Demo opens as a full-screen modal with iframe to a hosted sandbox.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, next-intl, Vercel

**Spec:** `docs/superpowers/specs/2026-03-11-landing-page-nextjs-migration-design.md`

**Existing reference:** `index.html` — current static landing page with all CSS/JS to port

---

## Chunk 1: Foundation

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`
- Modify: `.gitignore`

- [ ] **Step 1: Scaffold Next.js with TypeScript + Tailwind**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --no-turbopack
```

Note: This runs in the existing repo. It will create files without overwriting `index.html`. If it asks to overwrite `.gitignore`, accept — we'll fix it next.

- [ ] **Step 2: Restore .gitignore additions**

Ensure `.gitignore` contains both the Next.js defaults and our additions:
```
.superpowers/
.memory/.initialized
```

- [ ] **Step 3: Install dependencies**

```bash
npm install next-intl
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000, default Next.js page renders.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js 15 with TypeScript + Tailwind"
```

---

### Task 2: Configure design system in Tailwind

**Files:**
- Modify: `tailwind.config.ts`
- Rewrite: `app/globals.css`

- [ ] **Step 1: Configure Tailwind with Neo-Tokyo theme**

`tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#070212",
        deep: "#0d0618",
        primary: "#1a0b2e",
        card: "#1e1035",
        "card-hover": "#261545",
        cyan: "#00f5ff",
        "cyan-dim": "#00b8bf",
        orange: "#ff6b35",
        "orange-dim": "#cc5529",
        purple: "#8b5cf6",
        "purple-bright": "#a78bfa",
        green: "#00ff88",
        red: "#ff3366",
        "text-primary": "#e8e6f0",
        "text-muted": "#7a7590",
        "text-dim": "#4a4565",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        jp: ["var(--font-noto-jp)", "Noto Sans JP", "sans-serif"],
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease-in-out infinite",
        pulse: "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "arrow-pulse": "arrow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(0,245,255,0.4)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 0 8px rgba(0,245,255,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "arrow-pulse": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.8", color: "#00f5ff" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Write globals.css with base styles + custom properties**

`app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --glow-cyan: 0 0 30px rgba(0, 245, 255, 0.25), 0 0 60px rgba(0, 245, 255, 0.1);
    --glow-orange: 0 0 30px rgba(255, 107, 53, 0.25), 0 0 60px rgba(255, 107, 53, 0.1);
    --glow-purple: 0 0 30px rgba(139, 92, 246, 0.25);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: #070212;
    color: #e8e6f0;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer components {
  .glow-cyan {
    box-shadow: var(--glow-cyan);
  }
  .glow-orange {
    box-shadow: var(--glow-orange);
  }
  .glow-purple {
    box-shadow: var(--glow-purple);
  }
  .text-glow-cyan {
    text-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
  }
}
```

- [ ] **Step 3: Verify Tailwind compiles**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css && git commit -m "feat: configure Neo-Tokyo design system in Tailwind"
```

---

### Task 3: Set up i18n with next-intl

**Files:**
- Create: `i18n/config.ts`, `i18n/request.ts`, `i18n/messages/en.json`, `i18n/messages/de.json`, `middleware.ts`, `i18n/routing.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Create i18n config**

`i18n/config.ts`:
```ts
export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

`i18n/routing.ts`:
```ts
import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
});
```

`i18n/request.ts`:
```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Create middleware for locale detection**

`middleware.ts`:
```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 3: Update next.config.ts**

`next.config.ts`:
```ts
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 4: Create minimal translation files**

`i18n/messages/en.json`:
```json
{
  "meta": {
    "title": "nyxCore — Cognitive Vault",
    "description": "The AI-powered knowledge vault that learns how your team thinks."
  },
  "nav": {
    "problem": "Problem",
    "features": "Features",
    "pricing": "Pricing",
    "tech": "Tech",
    "downloads": "Downloads",
    "startFree": "Start Free"
  }
}
```

`i18n/messages/de.json`:
```json
{
  "meta": {
    "title": "nyxCore — Cognitive Vault",
    "description": "Der KI-gestützte Wissenstresor, der lernt wie Ihr Team denkt."
  },
  "nav": {
    "problem": "Problem",
    "features": "Features",
    "pricing": "Preise",
    "tech": "Technik",
    "downloads": "Downloads",
    "startFree": "Kostenlos starten"
  }
}
```

(These will grow as we add section components.)

- [ ] **Step 5: Commit**

```bash
git add i18n/ middleware.ts next.config.ts && git commit -m "feat: set up next-intl with EN/DE locale routing"
```

---

### Task 4: Create app layouts with fonts

**Files:**
- Rewrite: `app/layout.tsx`
- Create: `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/not-found.tsx`

- [ ] **Step 1: Create root layout**

`app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-noto-jp",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%231a0b2e'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%2300f5ff' font-size='20' font-family='monospace'>N</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${jetbrains.variable} ${inter.variable} ${notoJP.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Create locale layout**

`app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider, useMessages } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = messages.meta as Record<string, string>;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale}>{children}</div>
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 3: Create placeholder page and not-found**

`app/[locale]/page.tsx`:
```tsx
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-void text-text-primary">
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-mono text-4xl font-bold text-cyan">
          {"{"}nyx<span className="text-orange">.</span>Core{"}"}
        </h1>
      </div>
    </main>
  );
}
```

`app/[locale]/not-found.tsx`:
```tsx
export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-void">
      <div className="text-center font-mono">
        <h1 className="text-6xl font-bold text-cyan mb-4">404</h1>
        <p className="text-text-muted">Page not found</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify locale routing works**

```bash
npm run dev
```

Visit http://localhost:3000 → should redirect to /en/
Visit http://localhost:3000/de/ → should show German metadata

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/ && git commit -m "feat: add locale layouts with fonts and metadata"
```

---

### Task 5: Layout shell — Nav, Footer, Scanlines, CodeRain

**Files:**
- Create: `components/layout/Nav.tsx`, `components/layout/Footer.tsx`, `components/layout/Scanlines.tsx`, `components/canvas/CodeRain.tsx`, `components/layout/ScrollProgress.tsx`

- [ ] **Step 1: Create Scanlines component**

`components/layout/Scanlines.tsx`:
```tsx
export function Scanlines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
      }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Create ScrollProgress component**

`components/layout/ScrollProgress.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(pct);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-0.5 z-[10000] bg-gradient-to-r from-cyan via-purple to-orange"
      style={{ width: `${progress}%` }}
    />
  );
}
```

- [ ] **Step 3: Create CodeRain canvas component**

`components/canvas/CodeRain.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";

const KATAKANA =
  "ァアィイゥウェエォオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]|\\";
const CHARS = KATAKANA + LATIN;
const FONT_SIZE = 14;

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let columns: number;
    let drops: number[];
    let animId: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      columns = Math.floor(canvas!.width / FONT_SIZE);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    }

    function draw() {
      ctx!.fillStyle = "rgba(7, 2, 18, 0.08)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.font = `${FONT_SIZE}px JetBrains Mono, monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx!.fillStyle = "#ffffff";
        } else if (brightness > 0.8) {
          ctx!.fillStyle = "#00f5ff";
        } else {
          ctx!.fillStyle = "rgba(0, 245, 255, 0.35)";
        }

        ctx!.fillText(char, x, y);

        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const onResize = () => {
      cancelAnimationFrame(animId);
      resize();
      draw();
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-[0.12]"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 4: Create Nav component**

`components/layout/Nav.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/config";

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === "en" ? "de" : "en";
    const path = pathname.replace(`/${locale}`, `/${next}`);
    router.push(path);
  };

  const links = [
    { href: "#problem", label: t("problem") },
    { href: "#powers", label: t("features") },
    { href: "#pricing", label: t("pricing") },
    { href: "#tech", label: t("tech") },
    { href: "#downloads", label: t("downloads") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] px-5 md:px-12 h-[72px] flex items-center justify-between transition-all duration-400 border-b ${
        scrolled
          ? "bg-deep/85 backdrop-blur-xl border-cyan/[0.08]"
          : "border-transparent"
      }`}
    >
      <a href="#" className="font-mono font-extrabold text-xl text-cyan flex items-center gap-1 no-underline">
        <span className="text-text-dim font-light">{"{"}</span>
        nyx<span className="text-orange">.</span>Core
        <span className="text-text-dim font-light">{"}"}</span>
      </a>

      <ul
        className={`list-none flex items-center gap-8 ${
          menuOpen
            ? "flex flex-col fixed top-[72px] inset-x-0 bottom-0 bg-void/[0.97] backdrop-blur-xl p-10 gap-6 z-[999]"
            : "max-md:hidden"
        }`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-xs font-normal text-text-muted uppercase tracking-widest hover:text-cyan transition-colors no-underline"
            >
              {link.label}
            </a>
          </li>
        ))}
        <li>
          <button
            onClick={switchLocale}
            className="font-mono text-xs text-text-muted uppercase tracking-widest hover:text-cyan transition-colors bg-transparent border border-text-dim/20 rounded px-3 py-1 cursor-pointer"
          >
            {locale === "en" ? "DE" : "EN"}
          </button>
        </li>
        <li>
          <a
            href="#start"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-xs font-semibold text-void bg-cyan px-5 py-2 rounded-md no-underline hover:shadow-[var(--glow-cyan)] hover:-translate-y-px transition-all"
          >
            {t("startFree")}
          </a>
        </li>
      </ul>

      <button
        className="md:hidden flex flex-col gap-[5px] bg-transparent border-none p-1 cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-text-primary transition-all ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
        <span className={`block w-6 h-0.5 bg-text-primary transition-all ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-text-primary transition-all ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
      </button>
    </nav>
  );
}
```

- [ ] **Step 5: Create Footer component**

`components/layout/Footer.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [eggClicks, setEggClicks] = useState(0);
  const [terminalMode, setTerminalMode] = useState(false);

  const handleEgg = () => {
    const next = eggClicks + 1;
    if (next >= 3) {
      const newMode = !terminalMode;
      setTerminalMode(newMode);
      document.body.classList.toggle("terminal-mode", newMode);
      setEggClicks(0);
    } else {
      setEggClicks(next);
    }
  };

  const switchLocale = () => {
    const next = locale === "en" ? "de" : "en";
    router.push(pathname.replace(`/${locale}`, `/${next}`));
  };

  const links = ["Docs", "API", "Security", "GitHub", "Status", "Contact"];

  return (
    <footer className="relative z-[1] bg-void border-t border-cyan/[0.06]">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-12">
        <div className="flex justify-between items-start mb-10 flex-wrap gap-8">
          <div>
            <div className="font-mono font-extrabold text-lg text-cyan">
              {"{"}nyx.Core{"}"}
            </div>
            <div className="text-sm text-text-dim">Cognitive Vault</div>
          </div>
          <ul className="flex gap-6 list-none flex-wrap">
            {links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="font-mono text-xs text-text-dim no-underline hover:text-cyan transition-colors tracking-wide"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-white/[0.04] flex-wrap gap-4">
          <span className="font-mono text-[0.7rem] text-text-dim">
            &copy; 2026 nyxCore. All rights reserved.
          </span>
          <div className="flex gap-3">
            <span className="font-mono text-[0.6rem] text-text-dim bg-white/[0.03] border border-white/[0.06] rounded px-2.5 py-1 uppercase tracking-wider">
              Self-Hosted
            </span>
            <span className="font-mono text-[0.6rem] text-text-dim bg-white/[0.03] border border-white/[0.06] rounded px-2.5 py-1 uppercase tracking-wider">
              Local AI (Ollama)
            </span>
            <span className="font-mono text-[0.6rem] text-text-dim bg-white/[0.03] border border-white/[0.06] rounded px-2.5 py-1 uppercase tracking-wider">
              Open Source
            </span>
          </div>
          <button
            onClick={switchLocale}
            className="font-mono text-[0.6rem] text-text-dim hover:text-cyan transition-colors bg-transparent border-none cursor-pointer uppercase tracking-wider"
          >
            {locale === "en" ? "🇩🇪 Deutsch" : "🇬🇧 English"}
          </button>
          <span
            onClick={handleEgg}
            className="cursor-pointer select-none font-mono text-[0.7rem] text-text-dim hover:text-purple-bright transition-all"
            title="Click me three times..."
          >
            ░▒▓
          </span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Wire layout shell into locale layout**

Update `app/[locale]/layout.tsx` — add Nav, Footer, Scanlines, CodeRain, ScrollProgress around `{children}`:

```tsx
// Add imports at top:
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Scanlines } from "@/components/layout/Scanlines";
import { CodeRain } from "@/components/canvas/CodeRain";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

// Replace the return JSX with:
return (
  <NextIntlClientProvider messages={messages}>
    <div lang={locale}>
      <ScrollProgress />
      <CodeRain />
      <Scanlines />
      <Nav />
      {children}
      <Footer />
    </div>
  </NextIntlClientProvider>
);
```

- [ ] **Step 7: Add footer translations to en.json and de.json**

Add to `i18n/messages/en.json`:
```json
{
  "footer": {
    "rights": "All rights reserved."
  }
}
```

Add to `i18n/messages/de.json`:
```json
{
  "footer": {
    "rights": "Alle Rechte vorbehalten."
  }
}
```

- [ ] **Step 8: Verify layout renders**

```bash
npm run dev
```

Visit http://localhost:3000/en/ — should see code rain, scanlines, nav bar with links, footer, scroll progress bar. Check mobile (resize to 640px) — hamburger menu should appear.

- [ ] **Step 9: Verify build**

```bash
npm run build
```

- [ ] **Step 10: Commit**

```bash
git add components/ app/ i18n/ && git commit -m "feat: add layout shell with Nav, Footer, CodeRain, Scanlines"
```

---

## Chunk 2: UI Primitives & Effects

### Task 6: Button component

**Files:**
- Create: `components/ui/Button.tsx`

- [ ] **Step 1: Create Button with variants**

`components/ui/Button.tsx`:
```tsx
import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "tertiary";

type BaseProps = {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type Props = ButtonProps | LinkProps;

const styles: Record<Variant, string> = {
  primary:
    "font-mono text-sm font-semibold text-void bg-cyan border-none px-8 py-3.5 rounded-lg cursor-pointer no-underline transition-all relative overflow-hidden hover:shadow-[var(--glow-cyan)] hover:-translate-y-0.5",
  secondary:
    "font-mono text-sm font-medium text-cyan bg-transparent border border-cyan/25 px-8 py-3.5 rounded-lg cursor-pointer no-underline transition-all hover:bg-cyan/[0.06] hover:border-cyan/50",
  tertiary:
    "font-mono text-sm font-medium text-text-muted bg-transparent border-none px-6 py-3.5 cursor-pointer no-underline transition-colors hover:text-cyan relative after:absolute after:bottom-2.5 after:left-6 after:right-6 after:h-px after:bg-text-dim hover:after:bg-cyan after:transition-colors",
};

export function Button({ variant = "primary", children, className = "", ...props }: Props) {
  const classes = `${styles[variant]} ${className}`.trim();

  if ("href" in props && props.href) {
    return (
      <a className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/Button.tsx && git commit -m "feat: add Button component with primary/secondary/tertiary variants"
```

---

### Task 7: HolographicCard component

**Files:**
- Create: `components/ui/HolographicCard.tsx`

- [ ] **Step 1: Create HolographicCard**

`components/ui/HolographicCard.tsx`:
```tsx
"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glowColor?: string;
};

export function HolographicCard({ children, className = "", glowColor = "rgba(0,245,255,0.06)" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -10;
    const rotateY = (x - 0.5) * 10;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    el.style.setProperty("--mouse-x", `${x * 100}%`);
    el.style.setProperty("--mouse-y", `${y * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative transition-transform duration-150 ease-out will-change-transform ${className}`}
      style={{ "--glow-color": glowColor } as React.CSSProperties}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 hover-parent:opacity-100 rounded-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor} 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/HolographicCard.tsx && git commit -m "feat: add HolographicCard with mousemove tilt + radial shine"
```

---

### Task 8: Counter and TypeWriter effects

**Files:**
- Create: `components/ui/Counter.tsx`, `components/effects/TypeWriter.tsx`, `components/effects/ScrollReveal.tsx`

- [ ] **Step 1: Create Counter component**

`components/ui/Counter.tsx`:
```tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function Counter({ target, duration = 2000, prefix = "", suffix = "", className = "" }: Props) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            setValue(Math.round(easeOutCubic(progress) * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value}{suffix}
    </span>
  );
}
```

- [ ] **Step 2: Create TypeWriter component**

`components/effects/TypeWriter.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
};

export function TypeWriter({ text, speed = 50, delay = 0, className = "" }: Props) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse text-cyan">|</span>
    </span>
  );
}
```

- [ ] **Step 3: Create ScrollReveal wrapper**

`components/effects/ScrollReveal.tsx`:
```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function ScrollReveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/Counter.tsx components/effects/ && git commit -m "feat: add Counter, TypeWriter, and ScrollReveal effects"
```

---

## Chunk 3: Content Sections

### Task 9: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`
- Modify: `i18n/messages/en.json`, `i18n/messages/de.json`

- [ ] **Step 1: Add hero translations**

Add to both `en.json` and `de.json` (EN values shown, translate for DE):

```json
{
  "hero": {
    "badge": "Now in Public Beta",
    "jp": "ナレッジ・ヴォールト",
    "headlineTop": "From Knowledge Chaos",
    "headlineBottom": "to Cognitive Clarity",
    "subtitle": "The AI-powered knowledge vault that learns how your team thinks — built for developers who hate documentation but love shipping.",
    "ctaPrimary": "Start Free Trial →",
    "ctaSecondary": "See Live Demo",
    "scroll": "Scroll"
  }
}
```

DE version:
```json
{
  "hero": {
    "badge": "Jetzt in Public Beta",
    "jp": "ナレッジ・ヴォールト",
    "headlineTop": "Vom Wissens-Chaos",
    "headlineBottom": "zur kognitiven Klarheit",
    "subtitle": "Der KI-gestützte Wissenstresor, der lernt wie Ihr Team denkt — für Entwickler, die Docs hassen aber Shipping lieben.",
    "ctaPrimary": "Kostenlos starten →",
    "ctaSecondary": "Live Demo",
    "scroll": "Scrollen"
  }
}
```

- [ ] **Step 2: Create Hero component**

`components/sections/Hero.tsx`:
```tsx
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { TypeWriter } from "@/components/effects/TypeWriter";
import { ScrollReveal } from "@/components/effects/ScrollReveal";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-5 md:px-12 pt-[120px] pb-20">
      <div className="max-w-[860px] relative z-[2]">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-medium text-cyan bg-cyan/[0.06] border border-cyan/15 rounded-full px-4 py-1.5 mb-8 uppercase tracking-[0.15em]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
            {t("badge")}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <span className="font-jp font-light text-text-dim tracking-[0.3em] mb-3 block text-sm md:text-base">
            {t("jp")}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="font-mono text-4xl md:text-5xl lg:text-[4.2rem] font-extrabold leading-[1.1] tracking-tight mb-6 bg-gradient-to-br from-text-primary via-cyan to-purple-bright bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift">
            {t("headlineTop")}
            <br />
            {t("headlineBottom")}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <p className="text-base md:text-xl text-text-muted max-w-[640px] mx-auto mb-12 leading-relaxed">
            <TypeWriter text={t("subtitle")} speed={30} delay={800} />
          </p>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button href="#start">{t("ctaPrimary")}</Button>
            <Button href="#demo" variant="secondary">
              {t("ctaSecondary")}
            </Button>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-dim font-mono text-[0.65rem] uppercase tracking-[0.2em] animate-float">
        <span>{t("scroll")}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add Hero to page.tsx**

Update `app/[locale]/page.tsx`:
```tsx
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  );
}
```

- [ ] **Step 4: Verify Hero renders**

```bash
npm run dev
```

Expected: Hero section visible at /en/ with code rain behind it, gradient headline, typewriter subtitle, CTA buttons.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx app/[locale]/page.tsx i18n/messages/ && git commit -m "feat: add Hero section with typewriter, gradient headline, CTAs"
```

---

### Task 10: Problem, Superpowers, SocialProof sections

**Files:**
- Create: `components/sections/Problem.tsx`, `components/sections/Superpowers.tsx`, `components/sections/SocialProof.tsx`
- Modify: `i18n/messages/en.json`, `i18n/messages/de.json`

- [ ] **Step 1: Add translations for all three sections**

Add to `en.json` (add equivalent DE translations to `de.json`):
```json
{
  "problem": {
    "label": "Problem",
    "jp": "問題",
    "title": "Traditional knowledge bases",
    "titleAccent": "are fundamentally broken.",
    "failTitle": "What Fails",
    "fails": [
      "They assume people will write docs (they won't)",
      "They optimize for search, not learning",
      "They treat knowledge as static snapshots, not living conversations",
      "They ignore the tribal knowledge that actually runs your systems"
    ],
    "inversionBadge": "⚡ Ipcha Mistabra",
    "inversionTitle": "The Inversion",
    "inversionText": "Instead of forcing developers to document, we {bold}extract knowledge directly from your codebase{/bold} — architecture, imports, symbols, complexity, churn. Point CKB at your repo, ask questions in plain English, and get answers grounded in real code context. The AI plans the queries. You just ask."
  },
  "superpowers": {
    "label": "Superpowers",
    "jp": "超能力",
    "title": "Four capabilities that",
    "titleAccent": "change everything.",
    "panels": [
      {
        "number": "PANEL 01",
        "icon": "🚀",
        "stat": "3 Days",
        "subtitle": "Onboarding — Down from 3 months",
        "features": [
          "Interactive architecture graphs — explore modules, dependencies & call chains with React Flow",
          "AI-guided onboarding plans — structured paths through your codebase",
          "Ask anything in natural language — \"How does auth work?\" answered with real code context",
          "Guided walkthroughs — AI explains not just what the code does, but why it exists"
        ]
      },
      {
        "number": "PANEL 02",
        "icon": "⚡",
        "stat": "14 CKB Tools",
        "subtitle": "Codebase Knowledge Base — Semantic analysis",
        "features": [
          "Architecture analysis — treemaps, heatmaps & dependency graphs with metrics",
          "Hotspot detection — churn, complexity & coupling scores per file",
          "Symbol search & call graph tracing across your entire codebase",
          "Cycle detection & semantic boundary inference via Tarjan's algorithm"
        ]
      },
      {
        "number": "PANEL 03",
        "icon": "🧠",
        "stat": "4 Providers",
        "subtitle": "Pluggable AI — Choose your model",
        "features": [
          "Gemini, OpenAI, Anthropic — bring your own API key",
          "Ollama support — run fully local, zero data leaves your machine",
          "AI plans CKB queries automatically — no prompt engineering needed",
          "Real-time WebSocket streaming — instant, token-by-token responses"
        ]
      },
      {
        "number": "PANEL 04",
        "icon": "🔮",
        "stat": "Visual IDE",
        "subtitle": "Code Intelligence — See your system",
        "features": [
          "Graph visualization — architecture, callgraph & file tree views with drill-down",
          "Color modes — complexity, churn, LOC & type-based node coloring",
          "Built-in IDE view — browse files with syntax highlighting",
          "i18n ready — German & English out of the box, extensible"
        ]
      }
    ]
  },
  "socialProof": {
    "label": "Proof",
    "jp": "証拠",
    "title": "Teams are already",
    "titleAccent": "shipping faster.",
    "quotes": [
      {
        "stat": "87%",
        "text": "We reduced new developer ramp-up time by 87%. Juniors are pushing to production in their first week.",
        "cite": "Lead Architect",
        "company": "Series B SaaS Startup"
      },
      {
        "stat": "47×",
        "text": "Our senior devs finally stopped answering the same questions 47 times a day. They're actually building now.",
        "cite": "Engineering Manager",
        "company": "Fortune 500"
      }
    ]
  }
}
```

- [ ] **Step 2: Create Problem component**

Create `components/sections/Problem.tsx` — port the Problem section from `index.html` using `useTranslations("problem")`, `ScrollReveal`, and the same two-column grid layout (problem card + inversion card). Use Tailwind classes matching the existing CSS. Bold text in inversion handled by splitting the translation string on `{bold}` / `{/bold}` and wrapping in `<strong className="text-cyan font-semibold">`.

- [ ] **Step 3: Create Superpowers component**

Create `components/sections/Superpowers.tsx` — uses `useTranslations("superpowers")`. 2x2 `manga-grid` layout. Each panel is a `HolographicCard` with panel number, icon, stat (with color class based on index: cyan, orange, green, purple), subtitle, and feature list. Port panel colors: default cyan, `.panel-orange`, `.panel-green`, `.panel-purple` mapped to Tailwind border colors.

- [ ] **Step 4: Create SocialProof component**

Create `components/sections/SocialProof.tsx` — uses `useTranslations("socialProof")`. Two-column grid. Each card has a Japanese quote mark `「` as decorative element, the stat number as a `Counter` component, blockquote text, and cite line.

- [ ] **Step 5: Wire into page.tsx**

Add imports and render in order: `<Hero />`, `<Problem />`, `<Superpowers />`, `<SocialProof />`.

- [ ] **Step 6: Verify all sections render**

```bash
npm run dev
```

Scroll through /en/ — all four sections should be visible with scroll animations, holographic tilt on manga panels, and counter animations.

- [ ] **Step 7: Commit**

```bash
git add components/sections/ i18n/messages/ app/[locale]/page.tsx && git commit -m "feat: add Problem, Superpowers, and SocialProof sections"
```

---

## Chunk 4: Feature Sections

### Task 11: Demo section + DemoModal

**Files:**
- Create: `components/sections/Demo.tsx`, `components/demo/DemoModal.tsx`
- Modify: `i18n/messages/en.json`, `i18n/messages/de.json`

- [ ] **Step 1: Add demo translations**

```json
{
  "demo": {
    "label": "Demo",
    "jp": "実演",
    "title": "See it in action.",
    "titleAccent": "Live.",
    "tryLive": "Try it Live — No Signup Required",
    "comingSoon": "Coming Soon",
    "loading": "Loading demo...",
    "close": "Close"
  }
}
```

- [ ] **Step 2: Create DemoModal**

`components/demo/DemoModal.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DemoModal({ open, onClose }: Props) {
  const t = useTranslations("demo");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className={`fixed inset-0 z-[2000] flex items-center justify-center bg-void/90 backdrop-blur-md transition-all duration-300 ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative w-[95vw] h-[90vh] max-w-[1400px] bg-card border border-cyan/15 rounded-xl overflow-hidden transition-transform duration-300 ${
          open ? "scale-100" : "scale-90"
        }`}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-deep border-b border-cyan/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red" />
            <div className="w-3 h-3 rounded-full bg-orange" />
            <div className="w-3 h-3 rounded-full bg-green" />
            <span className="ml-2 font-mono text-xs text-text-dim">
              onboarding-tutor — live demo
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-text-muted hover:text-cyan transition-colors bg-transparent border-none cursor-pointer"
          >
            {t("close")} ✕
          </button>
        </div>

        {/* Iframe */}
        {demoUrl ? (
          <iframe
            src={demoUrl}
            className="w-full h-[calc(100%-40px)] border-none"
            title="Onboarding Tutor Demo"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <div className="flex items-center justify-center h-[calc(100%-40px)] font-mono text-text-muted">
            {t("loading")}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Demo section**

`components/sections/Demo.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { DemoModal } from "@/components/demo/DemoModal";

const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL;

export function Demo() {
  const t = useTranslations("demo");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="demo" className="relative z-[1] bg-deep">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-20 md:py-28">
        <ScrollReveal>
          <div className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cyan mb-3 flex items-center gap-3">
            <span className="block w-6 h-px bg-cyan" />
            {t("label")} <span className="font-jp font-light text-text-dim tracking-wider text-xs">{t("jp")}</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="font-mono text-3xl md:text-4xl font-bold leading-tight mb-12">
            {t("title")} <span className="text-cyan">{t("titleAccent")}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="max-w-[800px] mx-auto">
            {/* Browser chrome frame */}
            <div className="border border-cyan/15 rounded-xl overflow-hidden">
              {/* Title bar */}
              <div className="bg-card px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red" />
                <div className="w-3 h-3 rounded-full bg-orange" />
                <div className="w-3 h-3 rounded-full bg-green" />
                <span className="ml-2 font-mono text-xs text-text-dim">onboarding-tutor — demo</span>
              </div>

              {/* Screenshot area with play overlay */}
              <div
                className="relative bg-void p-8 min-h-[300px] cursor-pointer group"
                onClick={() => demoUrl && setModalOpen(true)}
              >
                {/* Fake chat UI */}
                <div className="flex gap-2 mb-4">
                  <span className="bg-card rounded px-3 py-1 font-mono text-xs text-cyan">Chat</span>
                  <span className="bg-card rounded px-3 py-1 font-mono text-xs text-text-dim">IDE</span>
                  <span className="bg-card rounded px-3 py-1 font-mono text-xs text-text-dim">Graph</span>
                </div>
                <div className="bg-card rounded-lg p-4 mb-3">
                  <p className="font-mono text-sm text-text-muted">How does the auth middleware work?</p>
                </div>
                <div className="bg-cyan/[0.04] border-l-2 border-cyan rounded-r-lg p-4">
                  <p className="font-mono text-sm text-text-primary leading-relaxed">
                    The auth middleware in src/middleware/auth.js validates JWT tokens and attaches the user context to each request...
                  </p>
                </div>

                {/* Play overlay or Coming Soon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                  {demoUrl ? (
                    <div className="w-16 h-16 rounded-full bg-cyan/90 flex items-center justify-center text-2xl shadow-[var(--glow-cyan)] group-hover:scale-110 transition-transform">
                      ▶
                    </div>
                  ) : (
                    <span className="font-mono text-sm font-semibold text-orange bg-orange/10 border border-orange/20 rounded-full px-6 py-2">
                      {t("comingSoon")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {demoUrl && (
              <p className="text-center mt-4 font-mono text-sm text-text-dim">
                {t("tryLive")}
              </p>
            )}
          </div>
        </ScrollReveal>

        <DemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify demo section and modal**

```bash
npm run dev
```

Test: Without `NEXT_PUBLIC_DEMO_URL` set → "Coming Soon" badge shown. With it set → click play button → modal opens → Escape closes → click outside closes.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Demo.tsx components/demo/ i18n/messages/ app/[locale]/page.tsx && git commit -m "feat: add Demo section with full-screen DemoModal"
```

---

### Task 12: Downloads section with OS detection

**Files:**
- Create: `components/sections/Downloads.tsx`, `lib/detect-os.ts`
- Modify: `i18n/messages/en.json`, `i18n/messages/de.json`

- [ ] **Step 1: Create OS detection utility**

`lib/detect-os.ts`:
```ts
export type Platform = "macos" | "windows" | "linux" | "unknown";

export function detectOS(): Platform {
  if (typeof navigator === "undefined") return "unknown";

  // Modern API
  if ("userAgentData" in navigator) {
    const platform = (navigator as any).userAgentData?.platform?.toLowerCase() ?? "";
    if (platform.includes("mac")) return "macos";
    if (platform.includes("win")) return "windows";
    if (platform.includes("linux")) return "linux";
  }

  // Fallback
  const p = navigator.platform?.toLowerCase() ?? "";
  if (p.includes("mac")) return "macos";
  if (p.includes("win")) return "windows";
  if (p.includes("linux")) return "linux";

  return "unknown";
}

export type DownloadInfo = {
  platform: Platform;
  label: string;
  icon: string;
  filename: string;
  size: string;
  format: string;
};

export function getDownloads(version: string): DownloadInfo[] {
  return [
    {
      platform: "macos",
      label: "macOS",
      icon: "🍎",
      filename: `Onboarding.Tutor-${version}-universal.dmg`,
      size: "180 MB",
      format: "Universal (.dmg)",
    },
    {
      platform: "windows",
      label: "Windows",
      icon: "🪟",
      filename: `Onboarding.Tutor.Setup.${version}.exe`,
      size: "85 MB",
      format: "Setup (.exe)",
    },
    {
      platform: "linux",
      label: "Linux",
      icon: "🐧",
      filename: `Onboarding.Tutor-${version}.AppImage`,
      size: "110 MB",
      format: "AppImage / .deb",
    },
  ];
}
```

- [ ] **Step 2: Write unit test for detect-os**

Create `lib/__tests__/detect-os.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
import { detectOS, getDownloads } from "../detect-os";

describe("detectOS", () => {
  it("returns unknown when navigator is undefined", () => {
    const orig = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", { value: undefined, writable: true });
    expect(detectOS()).toBe("unknown");
    Object.defineProperty(globalThis, "navigator", { value: orig, writable: true });
  });

  it("detects macos from platform", () => {
    Object.defineProperty(navigator, "platform", { value: "MacIntel", configurable: true });
    expect(detectOS()).toBe("macos");
  });
});

describe("getDownloads", () => {
  it("returns 3 platform entries with correct filenames", () => {
    const dl = getDownloads("1.1.0");
    expect(dl).toHaveLength(3);
    expect(dl[0].filename).toBe("Onboarding.Tutor-1.1.0-universal.dmg");
    expect(dl[1].filename).toBe("Onboarding.Tutor.Setup.1.1.0.exe");
    expect(dl[2].filename).toBe("Onboarding.Tutor-1.1.0.AppImage");
  });
});
```

Install vitest if not already: `npm install -D vitest` and add `"test": "vitest run"` to `package.json` scripts.

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Create Downloads section component**

`components/sections/Downloads.tsx` — client component using `detectOS()` on mount. Renders 2x2 grid of platform cards (macOS, Windows, Linux, Docker+Ollama). Detected OS card has `border-cyan shadow-[var(--glow-cyan)]`. Docker card shows `docker compose --env-file .local.env up` with a copy-to-clipboard button. Each card links to `${NEXT_PUBLIC_RELEASES_REPO}/releases/latest/download/${filename}`. "View all releases" link at bottom.

- [ ] **Step 4: Add translations, wire into page.tsx**

- [ ] **Step 5: Verify OS detection highlights correct card**

Test on macOS: macOS card should have cyan glow. Docker card copy button should copy command.

- [ ] **Step 6: Commit**

```bash
git add lib/ components/sections/Downloads.tsx i18n/messages/ app/[locale]/page.tsx && git commit -m "feat: add Downloads section with OS detection and platform cards"
```

---

### Task 13: Pricing section

**Files:**
- Create: `components/sections/Pricing.tsx`
- Modify: `i18n/messages/en.json`, `i18n/messages/de.json`

- [ ] **Step 1: Add pricing translations**

Translate all three tiers (Open Source / Team / Enterprise) with tier name, price, description, and features array. Include `noCard` text "No credit card required."

- [ ] **Step 2: Create Pricing component**

`components/sections/Pricing.tsx` — three `HolographicCard`s in a 3-column grid (stacks on mobile). Middle card (Team) has `featured` styling: cyan border, gradient bg, "Most Popular" badge. CTAs: Open Source → `Button variant="secondary"`, Team → `Button variant="primary"` (triggers Airtable form — we'll wire the `onClick` in Task 15), Enterprise → `Button variant="secondary"`.

- [ ] **Step 3: Wire into page.tsx, verify**

- [ ] **Step 4: Commit**

```bash
git add components/sections/Pricing.tsx i18n/messages/ app/[locale]/page.tsx && git commit -m "feat: add Pricing section with three tiers"
```

---

### Task 14: TechDeepDive and CtaFinal sections

**Files:**
- Create: `components/sections/TechDeepDive.tsx`, `components/sections/CtaFinal.tsx`
- Modify: `i18n/messages/en.json`, `i18n/messages/de.json`

- [ ] **Step 1: Add translations for both sections**

Tech: architecture blocks (Sources, CKB Engine, AI + Frontend) with their list items, security badges. CtaFinal: headline, subtitle, three CTA button labels.

- [ ] **Step 2: Create TechDeepDive**

`components/sections/TechDeepDive.tsx` — three architecture blocks in a flex row with animated arrow separators. Hover on a block highlights its border to cyan. Security badges row below. Interactive SVG can be a follow-up enhancement — start with the styled HTML blocks from the existing page.

- [ ] **Step 3: Create CtaFinal**

`components/sections/CtaFinal.tsx` — centered section with radial gradient bg overlay. Headline, subtitle, three buttons (primary opens Airtable form — wired in next task).

- [ ] **Step 4: Wire into page.tsx — complete composition of all sections**

Replace `app/[locale]/page.tsx` with the full page composition:

```tsx
"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Superpowers } from "@/components/sections/Superpowers";
import { Demo } from "@/components/sections/Demo";
import { SocialProof } from "@/components/sections/SocialProof";
import { Downloads } from "@/components/sections/Downloads";
import { Pricing } from "@/components/sections/Pricing";
import { TechDeepDive } from "@/components/sections/TechDeepDive";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { AirtableForm } from "@/components/ui/AirtableForm";

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Superpowers />
      <Demo />
      <SocialProof />
      <Downloads />
      <Pricing onOpenForm={() => setFormOpen(true)} />
      <TechDeepDive />
      <CtaFinal onOpenForm={() => setFormOpen(true)} />
      <AirtableForm open={formOpen} onClose={() => setFormOpen(false)} />
    </main>
  );
}
```

Note: Since this is now a client component, move `setRequestLocale` to the locale layout. The `Pricing` and `CtaFinal` components accept an `onOpenForm: () => void` prop that their CTA buttons call.

- [ ] **Step 5: Verify full page scroll**

```bash
npm run dev
```

All 11 sections should render in order. Full scroll-through should feel cohesive. CTA buttons won't submit yet (Airtable wired in Task 15).

- [ ] **Step 6: Commit**

```bash
git add components/sections/ i18n/messages/ app/[locale]/page.tsx && git commit -m "feat: add TechDeepDive, CtaFinal, and compose full page"
```

---

## Chunk 5: Airtable Integration, i18n Completion & Deployment

### Task 15: Airtable Server Action + Form Modal

**Files:**
- Create: `lib/airtable.ts`, `components/ui/AirtableForm.tsx`
- Modify: `i18n/messages/en.json`, `i18n/messages/de.json`

- [ ] **Step 1: Create Airtable server action**

`lib/airtable.ts`:
```ts
"use server";

type FormData = {
  name: string;
  email: string;
  teamSize: string;
  useCase: string;
  locale: string;
};

type Result = { success: true } | { success: false; error: string };

export async function submitToAirtable(data: FormData): Promise<Result> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    console.error("Airtable not configured");
    return { success: false, error: "Service unavailable" };
  }

  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Name: data.name,
                Email: data.email,
                "Team Size": data.teamSize,
                "Use Case": data.useCase,
                Locale: data.locale,
                Timestamp: new Date().toISOString(),
              },
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("Airtable error:", res.status, body);
      return { success: false, error: "Submission failed" };
    }

    return { success: true };
  } catch (err) {
    console.error("Airtable network error:", err);
    return { success: false, error: "Network error" };
  }
}
```

- [ ] **Step 2: Write unit test for airtable action**

`lib/__tests__/airtable.test.ts` — mock `fetch`, test success and error paths. Verify correct Airtable API URL and payload structure.

```bash
npm test
```

- [ ] **Step 3: Create AirtableForm modal component**

`components/ui/AirtableForm.tsx` — client component. Props: `open`, `onClose`. Uses `useTranslations("form")`. Single-column form with:
- Name input (required)
- Email input (required, type=email)
- Team Size pill selector (1-5, 6-20, 21-50, 50+) — radio-button-like pills
- Use Case dropdown (Onboarding, Architecture, Code Review, Knowledge Base, Other)
- Submit button

States: idle → submitting → success (auto-close after 2s) → error (retry button, max 2 retries then "Contact us" link).

Client-side validation before submit. Calls `submitToAirtable()` server action.

- [ ] **Step 4: Add form translations**

```json
{
  "form": {
    "title": "Start Free Trial",
    "subtitle": "No credit card required",
    "name": "Name",
    "namePlaceholder": "Your name",
    "email": "Email",
    "emailPlaceholder": "you@company.com",
    "teamSize": "Team Size",
    "useCase": "Primary Use Case",
    "useCaseOptions": {
      "onboarding": "Onboarding",
      "architecture": "Architecture",
      "codeReview": "Code Review",
      "knowledgeBase": "Knowledge Base",
      "other": "Other"
    },
    "submit": "Start Free Trial →",
    "submitting": "Submitting...",
    "success": "We'll be in touch!",
    "error": "Something went wrong.",
    "retry": "Try again",
    "contact": "Contact us directly"
  }
}
```

- [ ] **Step 5: Wire form into Pricing and CtaFinal**

The form state is already managed in `page.tsx` (added in Task 14 Step 4). The `Pricing` and `CtaFinal` components already accept `onOpenForm` prop. Ensure their CTA buttons call it:

In `Pricing.tsx`, the Team tier primary button:
```tsx
<Button onClick={onOpenForm}>{t("tiers.team.cta")}</Button>
```

In `CtaFinal.tsx`, the primary button:
```tsx
<Button onClick={onOpenForm}>{t("ctaPrimary")}</Button>
```

The `AirtableForm` is already rendered in `page.tsx` and controlled by `formOpen` state.

- [ ] **Step 6: Verify form flow**

Test: Click "Start Free Trial" on pricing → form modal opens → fill fields → submit → success state → auto-close. Test validation: empty name shows error. Test error: disconnect network → submit → error state → retry.

- [ ] **Step 7: Commit**

```bash
git add lib/airtable.ts components/ui/AirtableForm.tsx i18n/messages/ app/[locale]/page.tsx && git commit -m "feat: add Airtable form with server action and validation"
```

---

### Task 16: Complete German translations

**Files:**
- Modify: `i18n/messages/de.json`

- [ ] **Step 1: Translate all remaining sections**

Complete `de.json` with German translations for every key in `en.json`. Ensure:
- Technical terms stay in English where appropriate (e.g., "CKB", "Ollama", "Docker", "WebSocket")
- Japanese accent text stays the same
- Button CTAs are natural in German

- [ ] **Step 2: Verify locale switching**

Switch to /de/ — all text should be in German. Switch back to /en/ — all English. No untranslated keys.

- [ ] **Step 3: Commit**

```bash
git add i18n/messages/de.json && git commit -m "feat: complete German translations"
```

---

### Task 17: Terminal mode easter egg CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add terminal mode styles**

Add to `globals.css`:
```css
@layer components {
  body.terminal-mode {
    background: #000 !important;
  }
  body.terminal-mode * {
    font-family: var(--font-jetbrains), monospace !important;
  }
  body.terminal-mode h1,
  body.terminal-mode h2,
  body.terminal-mode h3,
  body.terminal-mode h4 {
    -webkit-text-fill-color: #00ff88 !important;
    background: none !important;
    color: #00ff88 !important;
  }
  body.terminal-mode p,
  body.terminal-mode li,
  body.terminal-mode span,
  body.terminal-mode blockquote {
    color: rgba(0, 255, 136, 0.7) !important;
  }
  body.terminal-mode a {
    color: #00ff88 !important;
  }
}
```

- [ ] **Step 2: Verify easter egg**

```bash
npm run dev
```

Test at http://localhost:3000/en/:
1. Scroll to footer, click `░▒▓` three times → entire page turns green-on-black terminal mode
2. Headings should be `#00ff88`, body text `rgba(0,255,136,0.7)`, links green
3. Click `░▒▓` three more times → reverts to normal Neo-Tokyo theme
4. Verify scanlines still visible in terminal mode

- [ ] **Step 3: Commit**

```bash
git add app/globals.css && git commit -m "feat: add terminal mode easter egg CSS"
```

---

### Task 18: Vercel deployment configuration

**Files:**
- Create: `vercel.json`, `.env.example`
- Modify: `package.json`

- [ ] **Step 1: Create vercel.json**

`vercel.json`:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

- [ ] **Step 2: Create .env.example**

`.env.example`:
```bash
# Airtable (Server-side — do NOT prefix with NEXT_PUBLIC_)
AIRTABLE_API_KEY=
AIRTABLE_BASE_ID=
AIRTABLE_TABLE_NAME=

# External URLs (Client-side)
NEXT_PUBLIC_DEMO_URL=
NEXT_PUBLIC_RELEASES_REPO=https://github.com/org/releases-repo
NEXT_PUBLIC_RELEASE_VERSION=1.1.0
```

- [ ] **Step 3: Verify production build**

```bash
npm run build
```

Expected: Build succeeds with no errors. Static pages generated for /en/ and /de/.

- [ ] **Step 4: Commit**

```bash
git add vercel.json .env.example package.json && git commit -m "chore: add Vercel config and env example"
```

- [ ] **Step 5: Deploy to Vercel**

```bash
npx vercel --prod
```

Or connect the GitHub repo to Vercel dashboard. Set environment variables in Vercel project settings.

- [ ] **Step 6: Verify live deployment**

Visit the Vercel URL:
- `/` redirects to `/en/`
- `/de/` shows German version
- All sections render
- Code rain animates
- Form submission works (if Airtable configured)
- Downloads link to GitHub releases

- [ ] **Step 7: Final commit**

```bash
git add -A && git commit -m "chore: deployment verified"
```
