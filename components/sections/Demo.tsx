"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { DemoModal } from "@/components/demo/DemoModal";

const rawDemoUrl = process.env.NEXT_PUBLIC_DEMO_URL ?? "";
const demoUrl = rawDemoUrl.startsWith("https://") ? rawDemoUrl : null;

export function Demo() {
  const t = useTranslations("demo");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="demo" className="relative z-[1] bg-deep">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-20 md:py-28">
        <ScrollReveal>
          <div className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cyan mb-3 flex items-center gap-3">
            <span className="block w-6 h-px bg-cyan" aria-hidden="true" />
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

        <ScrollReveal delay={200}>
          <div className="max-w-[800px] mx-auto">
            {/* Browser chrome frame */}
            <div className="border border-cyan/15 rounded-xl overflow-hidden">
              {/* Title bar */}
              <div className="bg-card px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-orange" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-green" aria-hidden="true" />
                <span className="ml-2 font-mono text-xs text-text-dim">
                  onboarding-tutor — demo
                </span>
              </div>

              {/* Screenshot area with play overlay */}
              <div className="relative bg-void p-8 min-h-[300px]">
                {/* Fake chat UI */}
                <div className="flex gap-2 mb-4" aria-hidden="true">
                  <span className="bg-card rounded px-3 py-1 font-mono text-xs text-cyan">
                    Chat
                  </span>
                  <span className="bg-card rounded px-3 py-1 font-mono text-xs text-text-dim">
                    IDE
                  </span>
                  <span className="bg-card rounded px-3 py-1 font-mono text-xs text-text-dim">
                    Graph
                  </span>
                </div>
                <div className="bg-card rounded-lg p-4 mb-3" aria-hidden="true">
                  <p className="font-mono text-sm text-text-muted">
                    How does the auth middleware work?
                  </p>
                </div>
                <div className="bg-cyan/[0.04] border-l-2 border-cyan rounded-r-lg p-4" aria-hidden="true">
                  <p className="font-mono text-sm text-text-primary leading-relaxed">
                    The auth middleware in src/middleware/auth.js validates JWT
                    tokens and attaches the user context to each request...
                  </p>
                </div>

                {/* Play overlay or Coming Soon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  {demoUrl ? (
                    <button
                      onClick={() => setModalOpen(true)}
                      aria-label={t("tryLive")}
                      className="w-16 h-16 rounded-full bg-cyan/90 flex items-center justify-center text-2xl shadow-[var(--glow-cyan)] hover:scale-110 transition-transform cursor-pointer border-none"
                    >
                      &#x25B6;
                    </button>
                  ) : (
                    <span className="font-mono text-sm font-semibold text-orange bg-orange/10 border border-orange/20 rounded-full px-6 py-2">
                      {t("comingSoon")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {demoUrl && (
              <p className="text-center mt-4 font-mono text-sm text-text-dim">
                {t("tryLive")}
              </p>
            )}
          </div>
        </ScrollReveal>

        <DemoModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </section>
  );
}
