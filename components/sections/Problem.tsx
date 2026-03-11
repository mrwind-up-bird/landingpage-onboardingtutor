"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";

export function Problem() {
  const t = useTranslations("problem");
  const fails = t.raw("fails") as string[];

  const inversionText = t("inversionText");
  const boldText = t("inversionBold");
  const parts = inversionText.split(boldText);

  return (
    <section
      id="problem"
      className="relative z-[1] bg-gradient-to-b from-void to-deep"
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
            <span className="text-orange">{t("titleAccent")}</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* What Fails */}
          <ScrollReveal delay={200}>
            <div className="bg-card/50 border border-white/[0.06] rounded-xl p-8">
              <h3 className="font-mono text-lg font-bold text-orange mb-6">
                {t("failTitle")}
              </h3>
              <ul className="space-y-4">
                {fails.map((fail, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-text-muted"
                  >
                    <span className="text-red font-mono text-sm mt-0.5">
                      ✕
                    </span>
                    <span className="text-sm leading-relaxed">{fail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* The Inversion */}
          <ScrollReveal delay={300}>
            <div className="bg-cyan/[0.03] border border-cyan/15 rounded-xl p-8">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan bg-cyan/[0.08] border border-cyan/20 rounded-full px-3 py-1 mb-4">
                {t("inversionBadge")}
              </div>
              <h3 className="font-mono text-lg font-bold text-cyan mb-4">
                {t("inversionTitle")}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {parts[0]}
                <strong className="text-cyan font-semibold">{boldText}</strong>
                {parts[1]}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
