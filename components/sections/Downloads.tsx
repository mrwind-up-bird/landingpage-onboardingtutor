"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { HolographicCard } from "@/components/ui/HolographicCard";
import { detectOS, getDownloads, type Platform } from "@/lib/detect-os";

const RAW_REPO = process.env.NEXT_PUBLIC_RELEASES_REPO ?? "";
const RAW_VERSION = process.env.NEXT_PUBLIC_RELEASE_VERSION ?? "1.1.0";
const RELEASES_REPO = RAW_REPO.startsWith("https://github.com/")
  ? RAW_REPO
  : "https://github.com/mrwind-up-bird/landingpage-onboardingtutor";
const VERSION = /^\d+\.\d+\.\d+$/.test(RAW_VERSION) ? RAW_VERSION : "1.1.0";
const DOCKER_CMD = "docker compose --env-file .local.env up";

export function Downloads() {
  const t = useTranslations("downloads");
  const [os, setOs] = useState<Platform>("unknown");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOs(detectOS());
  }, []);

  const downloads = getDownloads(VERSION);

  const copyCommand = async () => {
    await navigator.clipboard.writeText(DOCKER_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="downloads" className="relative z-[1] bg-void">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((dl, i) => {
            const isDetected = dl.platform === os;
            return (
              <ScrollReveal key={dl.filename} delay={200 + i * 100}>
                <HolographicCard
                  className={`group bg-card/50 border rounded-xl p-8 transition-all h-full ${
                    isDetected
                      ? "border-cyan/40 shadow-[var(--glow-cyan)]"
                      : "border-white/[0.06] hover:border-cyan/20"
                  }`}
                >
                  {isDetected && (
                    <div className="font-mono text-[0.6rem] text-cyan bg-cyan/[0.08] border border-cyan/20 rounded-full px-3 py-0.5 mb-4 inline-block uppercase tracking-wider">
                      {t("recommended")}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{dl.icon}</span>
                    <div>
                      <div className="font-mono text-lg font-bold text-text-primary">
                        {dl.label}
                      </div>
                      <div className="font-mono text-xs text-text-dim">
                        {dl.format} &middot; {dl.size}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`${RELEASES_REPO}/releases/download/v${VERSION}/${dl.filename}`}
                    className="inline-block font-mono text-sm font-semibold text-void bg-cyan px-6 py-2.5 rounded-lg no-underline hover:shadow-[var(--glow-cyan)] hover:-translate-y-0.5 transition-all"
                  >
                    Download
                  </a>
                </HolographicCard>
              </ScrollReveal>
            );
          })}

          {/* Source code card */}
          <ScrollReveal delay={600}>
            <HolographicCard className="group bg-card/50 border border-white/[0.06] hover:border-cyan/20 rounded-xl p-8 transition-all h-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{"\uD83D\uDCE6"}</span>
                <div>
                  <div className="font-mono text-lg font-bold text-text-primary">
                    {t("sourceTitle")}
                  </div>
                  <div className="font-mono text-xs text-text-dim">
                    {t("sourceDesc")}
                  </div>
                </div>
              </div>
              <a
                href={`${RELEASES_REPO}/archive/refs/tags/v${VERSION}.zip`}
                className="inline-block font-mono text-sm font-semibold text-void bg-cyan px-6 py-2.5 rounded-lg no-underline hover:shadow-[var(--glow-cyan)] hover:-translate-y-0.5 transition-all"
              >
                Download .zip
              </a>
            </HolographicCard>
          </ScrollReveal>

          {/* Docker + Ollama card */}
          <ScrollReveal delay={700}>
            <HolographicCard className="group bg-card/50 border border-white/[0.06] hover:border-cyan/20 rounded-xl p-8 transition-all h-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{"\uD83D\uDC33"}</span>
                <div>
                  <div className="font-mono text-lg font-bold text-text-primary">
                    {t("dockerTitle")}
                  </div>
                  <div className="font-mono text-xs text-text-dim">
                    {t("dockerDesc")}
                  </div>
                </div>
              </div>
              <div className="bg-void/80 border border-white/[0.06] rounded-lg p-4 flex items-center justify-between gap-3">
                <code className="font-mono text-xs text-cyan break-all">
                  {DOCKER_CMD}
                </code>
                <button
                  onClick={copyCommand}
                  className="font-mono text-[0.65rem] text-text-muted bg-white/[0.04] border border-white/[0.08] rounded px-4 py-2.5 min-h-[44px] hover:text-cyan hover:border-cyan/30 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? t("copied") : t("copyCommand")}
                </button>
              </div>
            </HolographicCard>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={600}>
          <p className="text-center mt-8">
            <a
              href={`${RELEASES_REPO}/releases`}
              className="font-mono text-sm text-text-dim hover:text-cyan transition-colors no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("allReleases")}
            </a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
