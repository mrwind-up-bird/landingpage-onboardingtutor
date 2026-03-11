"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const FOOTER_LINKS = [
  { label: "Docs", href: "#docs" },
  { label: "API", href: "#api" },
  { label: "Security", href: "#security" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Status", href: "#status" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const easterEggClicks = useRef(0);

  const switchLocale = () => {
    const next = locale === "en" ? "de" : "en";
    router.push(pathname, { locale: next });
  };

  const handleEasterEgg = () => {
    easterEggClicks.current += 1;
    if (easterEggClicks.current >= 3) {
      easterEggClicks.current = 0;
      document.body.classList.toggle("terminal-mode");
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-cyan/10 bg-void/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top row: logo + links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Logo */}
          <div>
            <div className="font-mono text-cyan text-lg font-bold tracking-tight mb-1">
              {"{nyx.Core}"}
            </div>
            <div className="text-xs text-text-muted font-sans">
              Cognitive Vault
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-text-muted hover:text-cyan transition-colors duration-200"
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-cyan/10">
          {/* Copyright */}
          <p className="text-xs text-text-dim font-sans">
            &copy; {year} nyxCore. {t("rights")}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-3">
            {["Self-Hosted", "Local AI", "Open Source"].map((badge) => (
              <span
                key={badge}
                className="text-xs font-mono px-2 py-0.5 rounded border border-cyan/20 text-cyan/60"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Locale switcher */}
            <button
              onClick={switchLocale}
              className="text-xs font-mono text-text-muted border border-text-dim/40 rounded px-2 py-1 hover:border-cyan/40 hover:text-cyan transition-colors duration-200"
              aria-label="Switch language"
            >
              {locale === "en" ? "DE" : "EN"}
            </button>

            {/* Terminal easter egg */}
            <button
              onClick={handleEasterEgg}
              className="text-xs font-mono text-text-dim hover:text-text-muted transition-colors duration-200 select-none"
              aria-label="Easter egg"
              title="???"
            >
              ░▒▓
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
