"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
}

// Each letter config: start position, rotation, delay
interface LetterState {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"black" | "logo" | "flash" | "done">("black");
  const [logoReady, setLogoReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; size: number; delay: number; duration: number;
  }>>([]);

  // Generate ambient particles
  useEffect(() => {
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    // Phase 1: Pure black for 400ms
    const t1 = setTimeout(() => setPhase("logo"), 400);

    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === "logo" && logoReady) {
      // Logo animation runs for ~2.2s, then flash
      const t2 = setTimeout(() => setPhase("flash"), 2400);
      return () => clearTimeout(t2);
    }
  }, [phase, logoReady]);

  useEffect(() => {
    if (phase === "flash") {
      const t3 = setTimeout(() => setPhase("done"), 600);
      return () => clearTimeout(t3);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      const t4 = setTimeout(onComplete, 100);
      return () => clearTimeout(t4);
    }
  }, [phase, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`
        fixed inset-0 z-[200] flex items-center justify-center overflow-hidden
        transition-opacity duration-500
        ${phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      style={{ background: "#000" }}
      aria-hidden="true"
    >
      {/* Ambient floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(99, 102, 241, 0.4)",
            animation: `loading-particle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Radial glow behind logo */}
      <div
        className={`
          absolute w-[500px] h-[500px] rounded-full
          transition-all duration-1000 ease-out
          ${phase === "logo" || phase === "flash" ? "opacity-100 scale-100" : "opacity-0 scale-50"}
        `}
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Logo container with animation */}
      <div
        className={`
          relative z-10 flex items-center justify-center
          ${phase === "logo" || phase === "flash" ? "animate-logo-entrance" : "opacity-0"}
        `}
      >
        {/* The logo image */}
        <div className="relative w-[280px] h-[140px] sm:w-[360px] sm:h-[180px]">
          <Image
            src="/logoWhite.png"
            alt="TalentS"
            fill
            className={`
              object-contain
              ${phase === "logo" || phase === "flash" ? "animate-logo-reveal" : "opacity-0"}
            `}
            onLoad={() => setLogoReady(true)}
            priority
          />

          {/* Glitch layers */}
          <div
            className={`
              absolute inset-0 ${phase === "logo" ? "animate-glitch-1" : "opacity-0"}
            `}
          >
            <Image
              src="/logoWhite.png"
              alt=""
              fill
              className="object-contain opacity-50"
              style={{ filter: "hue-rotate(90deg)" }}
              aria-hidden="true"
            />
          </div>
          <div
            className={`
              absolute inset-0 ${phase === "logo" ? "animate-glitch-2" : "opacity-0"}
            `}
          >
            <Image
              src="/logoWhite.png"
              alt=""
              fill
              className="object-contain opacity-50"
              style={{ filter: "hue-rotate(200deg)" }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Orbiting ring */}
        <div
          className={`
            absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full
            border border-gray-500/20
            ${phase === "logo" || phase === "flash" ? "animate-orbit-ring" : "opacity-0"}
          `}
        />

        {/* Second ring */}
        <div
          className={`
            absolute w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full
            border border-gray-400/10
            ${phase === "logo" || phase === "flash" ? "animate-orbit-ring-reverse" : "opacity-0"}
          `}
        />
      </div>

      {/* Scan line sweep */}
      <div
        className={`
          absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gray-400/60 to-transparent
          ${phase === "logo" ? "animate-scan-line" : "opacity-0"}
        `}
      />

      {/* Flash overlay */}
      <div
        className={`
          absolute inset-0 bg-white z-20
          transition-opacity duration-500
          ${phase === "flash" ? "opacity-100" : "opacity-0"}
        `}
        style={{
          animation: phase === "flash" ? "flash-burst 0.6s ease-out forwards" : "none",
        }}
      />
    </div>
  );
}
