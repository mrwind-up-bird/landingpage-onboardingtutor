"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Button } from "@/components/ui/Button";

type Props = {
  onOpenForm: () => void;
};

export function CtaFinal({ onOpenForm }: Props) {
  const t = useTranslations("ctaFinal");

  return (
    <section
      id="start"
      className="relative z-[1] bg-gradient-to-b from-deep to-void"
    >
      <div className="max-w-[860px] mx-auto px-5 md:px-12 py-24 md:py-32 text-center relative">
        {/* Radial glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,245,255,0.06) 0%, transparent 70%)",
          }}
        />

        <ScrollReveal>
          <span className="font-jp font-light text-text-dim tracking-[0.3em] mb-3 block text-sm">
            {t("jp")}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="font-mono text-3xl md:text-5xl font-extrabold leading-tight mb-6 relative z-[1]">
            {t("title")}{" "}
            <span className="text-cyan">{t("titleAccent")}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-base md:text-lg text-text-muted max-w-[560px] mx-auto mb-10 leading-relaxed relative z-[1]">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex gap-4 justify-center flex-wrap relative z-[1]">
            <Button onClick={onOpenForm}>{t("ctaPrimary")}</Button>
            <Button href="#demo" variant="secondary">
              {t("ctaSecondary")}
            </Button>
            <Button href="#" variant="tertiary">
              {t("ctaTertiary")}
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
