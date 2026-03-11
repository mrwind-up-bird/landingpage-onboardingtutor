"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function DemoModal({ open, onClose }: Props) {
  const t = useTranslations("demo");
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    dialog.addEventListener("keydown", handleTab);
    return () => dialog.removeEventListener("keydown", handleTab);
  }, [open]);

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

  if (!open) return null;

  const rawDemoUrl = process.env.NEXT_PUBLIC_DEMO_URL ?? "";
  const demoUrl = rawDemoUrl.startsWith("https://") ? rawDemoUrl : null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-void/90 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-dialog-title"
    >
      <div
        ref={dialogRef}
        className="relative w-[95vw] h-[70vh] md:h-[90vh] max-w-[1400px] bg-card border border-cyan/15 rounded-xl overflow-hidden transition-transform duration-300"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-deep border-b border-cyan/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-orange" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-green" aria-hidden="true" />
            <span
              id="demo-dialog-title"
              className="ml-2 font-mono text-xs text-text-dim"
            >
              onboarding-tutor — live demo
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-xs text-text-muted hover:text-cyan transition-colors bg-transparent border-none cursor-pointer"
          >
            {t("close")} &#x2715;
          </button>
        </div>

        {/* Iframe */}
        {demoUrl ? (
          <iframe
            src={demoUrl}
            className="w-full h-[calc(100%-40px)] border-none"
            title="Onboarding Tutor Demo"
            sandbox="allow-scripts allow-forms allow-popups"
          />
        ) : (
          <div className="flex items-center justify-center h-[calc(100%-40px)] font-mono text-text-muted">
            {t("loading")}
          </div>
        )}
      </div>
    </div>
  );
}
