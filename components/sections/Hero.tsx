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
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-dim font-mono text-[0.65rem] uppercase tracking-[0.2em] animate-float" aria-hidden="true">
        <span>{t("scroll")}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
