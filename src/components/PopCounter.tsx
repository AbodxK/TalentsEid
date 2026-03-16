"use client";

import { useEffect, useState } from "react";

interface PopCounterProps {
  count: number;
}

export default function PopCounter({ count }: PopCounterProps) {
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Show counter after first pop
  useEffect(() => {
    if (count > 0 && !show) setShow(true);
    if (count > 0) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(t);
    }
  }, [count, show]);

  if (!show) return null;

  return (
    <div
      className={`
        fixed bottom-4 left-4 z-[60]
        bg-surface/90 backdrop-blur-sm border border-border
        rounded-full px-4 py-2 shadow-lg
        flex items-center gap-2
        transition-all duration-300
        ${animate ? "scale-110" : "scale-100"}
      `}
      style={{ animation: show ? "fade-in 0.4s ease-out" : undefined }}
    >
      <span className="text-lg">🫧</span>
      <span className={`text-sm font-semibold text-text transition-transform duration-200 ${animate ? "scale-125" : ""}`}>
        {count}
      </span>
      <span className="text-xs text-text-muted hidden sm:inline">popped!</span>
    </div>
  );
}
