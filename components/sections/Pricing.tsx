"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { HolographicCard } from "@/components/ui/HolographicCard";
import { Button } from "@/components/ui/Button";

type Props = {
  onOpenForm: () => void;
};

const TIER_KEYS = ["free", "team", "enterprise"] as const;

export function Pricing({ onOpenForm }: Props) {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="relative z-[1] bg-gradient-to-b from-void to-deep">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-20 md:py-28">
        <ScrollReveal>
          <div className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cyan mb-3 flex items-center gap-3">
            <span className="block w-6 h-px bg-cyan" />
            {t("label")}{" "}
            <span className="font-jp font-light text-text-dim tracking-wider text-xs">
              {t("jp")}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="font-mono text-3xl md:text-4xl font-bold leading-tight mb-4">
            {t("title")}{" "}
            <span className="text-cyan">{t("titleAccent")}</span>
          </h2>
          <p className="font-mono text-sm text-text-dim mb-12">
            {t("noCard")}
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {TIER_KEYS.map((tier, i) => {
            const isFeatured = tier === "team";
            const features = t.raw(`tiers.${tier}.features`) as string[];

            return (
              <ScrollReveal key={tier} delay={200 + i * 100}>
                <HolographicCard
                  className={`group h-full rounded-xl p-8 border transition-all ${
                    isFeatured
                      ? "bg-gradient-to-b from-cyan/[0.06] to-card/80 border-cyan/30 shadow-[var(--glow-cyan)]"
                      : "bg-card/50 border-white/[0.06] hover:border-cyan/20"
                  }`}
                  glowColor={
                    isFeatured
                      ? "rgba(0,245,255,0.08)"
                      : "rgba(0,245,255,0.04)"
                  }
                >
                  {isFeatured && (
                    <div className="font-mono text-[0.6rem] text-cyan bg-cyan/[0.1] border border-cyan/25 rounded-full px-3 py-0.5 mb-4 inline-block uppercase tracking-wider">
                      {t("tiers.team.badge")}
                    </div>
                  )}
                  <h3 className="font-mono text-lg font-bold text-text-primary mb-2">
                    {t(`tiers.${tier}.name`)}
                  </h3>
                  <div className="mb-1">
                    <span className="font-mono text-3xl font-extrabold text-cyan">
                      {t(`tiers.${tier}.price`)}
                    </span>
                    {t(`tiers.${tier}.period`) && (
                      <span className="font-mono text-sm text-text-dim ml-1">
                        {t(`tiers.${tier}.period`)}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-text-muted mb-6">
                    {t(`tiers.${tier}.description`)}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-text-muted"
                      >
                        <span className="text-green mt-0.5 text-xs">
                          &#x2713;
                        </span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    {tier === "free" ? (
                      <Button variant="secondary" href="#downloads">
                        {t("tiers.free.cta")}
                      </Button>
                    ) : tier === "team" ? (
                      <Button onClick={onOpenForm}>
                        {t("tiers.team.cta")}
                      </Button>
                    ) : (
                      <Button variant="secondary" onClick={onOpenForm}>
                        {t("tiers.enterprise.cta")}
                      </Button>
                    )}
                  </div>
                </HolographicCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
