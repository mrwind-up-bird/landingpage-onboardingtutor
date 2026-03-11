"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

const NAV_LINKS = [
  { key: "problem", href: "#problem" },
  { key: "features", href: "#features" },
  { key: "pricing", href: "#pricing" },
  { key: "tech", href: "#tech" },
  { key: "nyxCore", href: "#nyxcore" },
  { key: "downloads", href: "#downloads" },
] as const;

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on resize above md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const switchLocale = () => {
    const next = locale === "en" ? "de" : "en";
    router.push(pathname, { locale: next });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-void/80 border-b border-cyan/15"
            : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-mono text-cyan text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            {"{nyxCore.onboardingTutor}"}
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  className="text-sm text-text-muted hover:text-cyan transition-colors duration-200"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Locale switcher */}
            <button
              onClick={switchLocale}
              className="text-xs font-mono text-text-muted border border-text-dim/40 rounded px-2 py-1 hover:border-cyan/40 hover:text-cyan transition-colors duration-200"
              aria-label="Switch language"
            >
              {locale === "en" ? "DE" : "EN"}
            </button>

            {/* CTA */}
            <a
              href="#start"
              className="text-sm font-mono font-bold px-4 py-2 rounded border border-cyan text-cyan hover:bg-cyan hover:text-void transition-colors duration-200"
            >
              {t("startFree")}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-3 z-[1001]"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-cyan transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-cyan transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-cyan transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        className={`fixed inset-0 z-[999] bg-void/95 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col items-center gap-8 mb-10">
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="text-2xl font-mono text-text-primary hover:text-cyan transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              switchLocale();
              setMenuOpen(false);
            }}
            className="text-sm font-mono text-text-muted border border-text-dim/40 rounded px-3 py-1.5 hover:border-cyan/40 hover:text-cyan transition-colors duration-200"
          >
            {locale === "en" ? "DE" : "EN"}
          </button>
          <a
            href="#start"
            className="text-sm font-mono font-bold px-5 py-2.5 rounded border border-cyan text-cyan hover:bg-cyan hover:text-void transition-colors duration-200"
            onClick={() => setMenuOpen(false)}
          >
            {t("startFree")}
          </a>
        </div>
      </div>
    </>
  );
}
