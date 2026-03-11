"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { HolographicCard } from "@/components/ui/HolographicCard";

const PANEL_COLORS = [
  { border: "border-cyan/20", stat: "text-cyan", glow: "rgba(0,245,255,0.06)" },
  { border: "border-orange/20", stat: "text-orange", glow: "rgba(255,107,53,0.06)" },
  { border: "border-green/20", stat: "text-green", glow: "rgba(0,255,136,0.06)" },
  { border: "border-purple/20", stat: "text-purple", glow: "rgba(139,92,246,0.06)" },
];

type Panel = {
  number: string;
  icon: string;
  stat: string;
  subtitle: string;
  features: string[];
};

export function Superpowers() {
  const t = useTranslations("superpowers");
  const panels = t.raw("panels") as Panel[];

  return (
    <section
      id="features"
      className="relative z-[1] bg-deep"
    >
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
          <h2 className="font-mono text-3xl md:text-4xl font-bold leading-tight mb-12">
            {t("title")}{" "}
            <span className="text-cyan">{t("titleAccent")}</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-6">
          {panels.map((panel, i) => {
            const color = PANEL_COLORS[i];
            return (
              <ScrollReveal key={i} delay={200 + i * 100}>
                <HolographicCard
                  className={`group bg-card/50 ${color.border} border rounded-xl p-8 transition-colors h-full`}
                  glowColor={color.glow}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[0.65rem] text-text-dim uppercase tracking-widest">
                      {panel.number}
                    </span>
                    <span className="text-2xl">{panel.icon}</span>
                  </div>
                  <div className={`font-mono text-3xl font-extrabold ${color.stat} mb-1`}>
                    {panel.stat}
                  </div>
                  <div className="font-mono text-sm text-text-muted mb-6">
                    {panel.subtitle}
                  </div>
                  <ul className="space-y-3">
                    {panel.features.map((feature, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-text-muted"
                      >
                        <span className={`${color.stat} mt-1 text-xs`}>
                          &gt;
                        </span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </HolographicCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
