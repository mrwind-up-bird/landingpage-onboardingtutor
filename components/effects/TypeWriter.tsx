"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
};

export function TypeWriter({
  text,
  speed = 50,
  delay = 0,
  className = "",
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayed(text);
      return;
    }
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay, prefersReduced, text]);

  useEffect(() => {
    if (prefersReduced) return;
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [started, displayed, text, speed, prefersReduced]);

  const done = displayed.length >= text.length;

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-pulse text-cyan">|</span>}
    </span>
  );
}
