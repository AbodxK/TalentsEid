"use client";

import { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
        glowRef.current.style.opacity = "1";
      }
    }

    function handleMouseLeave() {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300"
      aria-hidden="true"
      style={{
        width: 300,
        height: 300,
        background:
          "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
        borderRadius: "50%",
      }}
    />
  );
}
