"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  glowColor?: string;
};

export function HolographicCard({
  children,
  className = "",
  glowColor = "rgba(0,245,255,0.06)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -10;
    const rotateY = (x - 0.5) * 10;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    el.style.setProperty("--mouse-x", `${x * 100}%`);
    el.style.setProperty("--mouse-y", `${y * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative transition-transform duration-150 ease-out will-change-transform ${className}`}
      style={{ "--glow-color": glowColor } as React.CSSProperties}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor} 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}
