"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Counter } from "@/components/ui/Counter";

type Quote = {
  stat: string;
  statNum: number;
  text: string;
  cite: string;
  company: string;
};

export function SocialProof() {
  const t = useTranslations("socialProof");
  const quotes = t.raw("quotes") as Quote[];

  return (
    <section className="relative z-[1] bg-gradient-to-b from-deep to-void">
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

        <div className="grid md:grid-cols-2 gap-8">
          {quotes.map((quote, i) => (
            <ScrollReveal key={i} delay={200 + i * 100}>
              <div className="bg-card/50 border border-white/[0.06] rounded-xl p-8 relative">
                <span className="absolute top-4 right-6 font-jp text-6xl text-cyan/[0.08] leading-none select-none">
                  &lsquo;
                </span>
                <div className="font-mono text-4xl font-extrabold text-cyan mb-4">
                  <Counter
                    target={quote.statNum}
                    suffix={quote.stat.replace(String(quote.statNum), "")}
                  />
                </div>
                <blockquote className="text-sm text-text-muted leading-relaxed mb-6 italic">
                  &ldquo;{quote.text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan/10 flex items-center justify-center text-cyan font-mono text-xs font-bold">
                    {quote.cite[0]}
                  </div>
                  <div>
                    <div className="font-mono text-xs text-text-primary">
                      {quote.cite}
                    </div>
                    <div className="font-mono text-[0.65rem] text-text-dim">
                      {quote.company}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
