"use client";
import { useEffect, useRef } from "react";

const KATAKANA =
  "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヲンヴ";
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
const CHARS = KATAKANA + LATIN;

const FONT_SIZE = 14;

interface Column {
  y: number;
  speed: number;
  length: number;
}

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let paused = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const numCols = () => Math.floor(canvas.width / FONT_SIZE);

    let columns: Column[] = [];

    const initColumns = () => {
      const count = numCols();
      columns = Array.from({ length: count }, () => ({
        y: Math.random() * -canvas.height,
        speed: 0.5 + Math.random() * 1.5,
        length: 10 + Math.floor(Math.random() * 20),
      }));
    };
    initColumns();
    window.addEventListener("resize", initColumns);

    let lastTime = 0;
    const FPS = 20;
    const interval = 1000 / FPS;

    const draw = (timestamp: number) => {
      if (paused) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const delta = timestamp - lastTime;
      if (delta < interval) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp - (delta % interval);

      ctx.fillStyle = "rgba(7, 2, 18, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

      columns.forEach((col, i) => {
        const x = i * FONT_SIZE;
        const yPx = col.y * FONT_SIZE;

        // Lead character: bright white/cyan
        const leadChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = "#e0ffff";
        ctx.fillText(leadChar, x, yPx);

        // Trail characters: faded cyan
        for (let j = 1; j < col.length; j++) {
          const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          const alpha = 1 - j / col.length;
          ctx.fillStyle = `rgba(0, 245, 255, ${alpha * 0.7})`;
          ctx.fillText(trailChar, x, yPx - j * FONT_SIZE);
        }

        col.y += col.speed;

        // Reset when column goes off screen
        if (col.y * FONT_SIZE > canvas.height + col.length * FONT_SIZE) {
          col.y = -col.length;
          col.speed = 0.5 + Math.random() * 1.5;
          col.length = 10 + Math.floor(Math.random() * 20);
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    const handleVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", initColumns);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.12 }}
      aria-hidden="true"
    />
  );
}
