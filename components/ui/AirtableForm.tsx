"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { submitToAirtable } from "@/lib/airtable";

type Props = {
  open: boolean;
  onClose: () => void;
};

const TEAM_SIZES = ["1-5", "6-20", "21-50", "50+"];
const USE_CASE_KEYS = [
  "onboarding",
  "architecture",
  "codeReview",
  "knowledgeBase",
  "other",
] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function AirtableForm({ open, onClose }: Props) {
  const t = useTranslations("form");
  const locale = useLocale();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("1-5");
  const [useCase, setUseCase] = useState("onboarding");
  const [status, setStatus] = useState<Status>("idle");
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        onClose();
        setStatus("idle");
        setName("");
        setEmail("");
        setTeamSize("1-5");
        setUseCase("onboarding");
        setRetries(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("submitting");
    const result = await submitToAirtable({
      name: name.trim(),
      email: email.trim(),
      teamSize,
      useCase,
      locale,
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setRetries((r) => r + 1);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-void/90 backdrop-blur-md"
    >
      <div className="relative w-[95vw] max-w-[480px] bg-card border border-cyan/15 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan/10">
          <div>
            <h2 className="font-mono text-lg font-bold text-text-primary">
              {t("title")}
            </h2>
            <p className="font-mono text-xs text-text-dim">{t("subtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-sm text-text-muted hover:text-cyan transition-colors bg-transparent border-none cursor-pointer"
          >
            &#x2715;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wider">
              {t("name")}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="w-full bg-void/60 border border-white/[0.08] rounded-lg px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-dim/50 focus:border-cyan/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wider">
              {t("email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full bg-void/60 border border-white/[0.08] rounded-lg px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-dim/50 focus:border-cyan/40 focus:outline-none transition-colors"
            />
          </div>

          {/* Team Size */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wider">
              {t("teamSize")}
            </label>
            <div className="flex gap-2">
              {TEAM_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setTeamSize(size)}
                  className={`flex-1 font-mono text-xs py-2.5 min-h-[44px] rounded-lg border transition-all cursor-pointer ${
                    teamSize === size
                      ? "bg-cyan/10 border-cyan/40 text-cyan"
                      : "bg-void/40 border-white/[0.08] text-text-dim hover:border-cyan/20"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Use Case */}
          <div>
            <label className="block font-mono text-xs text-text-muted mb-1.5 uppercase tracking-wider">
              {t("useCase")}
            </label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="w-full bg-void/60 border border-white/[0.08] rounded-lg px-4 py-2.5 font-mono text-sm text-text-primary focus:border-cyan/40 focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              {USE_CASE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`useCaseOptions.${key}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Submit / Status */}
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="font-mono text-lg text-green mb-1">
                &#x2713;
              </div>
              <p className="font-mono text-sm text-green">{t("success")}</p>
            </div>
          ) : status === "error" ? (
            <div className="text-center py-2 space-y-2">
              <p className="font-mono text-sm text-red">{t("error")}</p>
              {retries < 2 ? (
                <button
                  type="button"
                  onClick={() => handleSubmit(new Event("submit") as unknown as React.FormEvent)}
                  className="font-mono text-xs text-cyan hover:underline bg-transparent border-none cursor-pointer"
                >
                  {t("retry")}
                </button>
              ) : (
                <a
                  href="mailto:contact@nyxcore.dev"
                  className="font-mono text-xs text-cyan hover:underline"
                >
                  {t("contact")}
                </a>
              )}
            </div>
          ) : (
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full font-mono text-sm font-semibold text-void bg-cyan py-3 rounded-lg border-none cursor-pointer hover:shadow-[var(--glow-cyan)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? t("submitting") : t("submit")}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
