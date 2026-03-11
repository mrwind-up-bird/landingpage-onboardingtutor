"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";

type Block = {
  title: string;
  items: string[];
};

const BLOCK_COLORS = ["border-orange/30", "border-cyan/30", "border-purple/30"];
const BLOCK_TITLE_COLORS = ["text-orange", "text-cyan", "text-purple"];

export function TechDeepDive() {
  const t = useTranslations("tech");
  const blocks = t.raw("blocks") as Block[];
  const badges = t.raw("security.badges") as string[];

  return (
    <section id="tech" className="relative z-[1] bg-deep">
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

        {/* Architecture blocks */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-12">
          {blocks.map((block, i) => (
            <ScrollReveal
              key={i}
              delay={200 + i * 100}
              className="flex-1 flex items-stretch"
            >
              <div
                className={`flex-1 bg-card/50 border ${BLOCK_COLORS[i]} rounded-xl p-6 hover:border-cyan/50 transition-colors`}
              >
                <h3
                  className={`font-mono text-sm font-bold ${BLOCK_TITLE_COLORS[i]} mb-4 uppercase tracking-wider`}
                >
                  {block.title}
                </h3>
                <ul className="space-y-2">
                  {block.items.map((item, j) => (
                    <li
                      key={j}
                      className="font-mono text-xs text-text-muted flex items-center gap-2"
                    >
                      <span className={`${BLOCK_TITLE_COLORS[i]} text-[0.6rem]`}>
                        &gt;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {i < blocks.length - 1 && (
                <div className="hidden md:flex items-center px-2">
                  <span className="font-mono text-xl text-text-dim animate-arrow-pulse">
                    &rarr;
                  </span>
                </div>
              )}
            </ScrollReveal>
          ))}
        </div>

        {/* Security badges */}
        <ScrollReveal delay={500}>
          <div className="text-center">
            <h3 className="font-mono text-sm font-bold text-green mb-4 uppercase tracking-wider">
              {t("security.title")}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className="font-mono text-[0.65rem] text-text-dim bg-white/[0.03] border border-white/[0.06] rounded px-3 py-1.5 uppercase tracking-wider"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
