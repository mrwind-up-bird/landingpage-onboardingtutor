"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { HolographicCard } from "@/components/ui/HolographicCard";

const FEATURES = [
  { icon: "\u{1F9E0}", color: "text-purple", border: "border-purple/20", glow: "rgba(139,92,246,0.06)" },
  { icon: "\u{1F504}", color: "text-cyan", border: "border-cyan/20", glow: "rgba(0,245,255,0.06)" },
  { icon: "\u{1F4C4}", color: "text-orange", border: "border-orange/20", glow: "rgba(255,107,53,0.06)" },
  { icon: "\u{1F6E1}\uFE0F", color: "text-green", border: "border-green/20", glow: "rgba(0,255,136,0.06)" },
  { icon: "\u{1F393}", color: "text-cyan", border: "border-cyan/20", glow: "rgba(0,245,255,0.06)" },
  { icon: "\u{1F512}", color: "text-orange", border: "border-orange/20", glow: "rgba(255,107,53,0.06)" },
];

type Feature = {
  title: string;
  description: string;
};

export function NyxCore() {
  const t = useTranslations("nyxCore");
  const features = t.raw("features") as Feature[];

  return (
    <section id="nyxcore" className="relative z-[1] bg-deep">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-20 md:py-28">
        <ScrollReveal>
          <div className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-purple mb-3 flex items-center gap-3">
            <span className="block w-6 h-px bg-purple" />
            {t("label")}{" "}
            <span className="font-jp font-light text-text-dim tracking-wider text-xs">
              {t("jp")}
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="font-mono text-3xl md:text-4xl font-bold leading-tight mb-4">
            {t("title")}{" "}
            <span className="text-purple">{t("titleAccent")}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mb-12 leading-relaxed">
            {t("subtitle")}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const style = FEATURES[i];
            return (
              <ScrollReveal key={i} delay={200 + i * 80}>
                <HolographicCard
                  className={`group bg-card/50 ${style.border} border rounded-xl p-6 transition-colors h-full`}
                  glowColor={style.glow}
                >
                  <span className="text-2xl mb-3 block">{style.icon}</span>
                  <h3 className={`font-mono text-sm font-bold ${style.color} mb-2 uppercase tracking-wider`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </HolographicCard>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={700}>
          <div className="mt-10 text-center">
            <a
              href="https://nyxcore.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold px-6 py-3 rounded border border-purple text-purple hover:bg-purple hover:text-void transition-colors duration-200"
            >
              {t("cta")}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
