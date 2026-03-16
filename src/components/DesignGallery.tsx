"use client";

import { useRef } from "react";
import Image from "next/image";
import { designs, DesignConfig } from "@/config/designs";
import { DownloadStats } from "@/lib/download-stats";

interface DesignGalleryProps {
  selectedId: string | null;
  onSelect: (design: DesignConfig) => void;
  downloadStats: DownloadStats;
}

export default function DesignGallery({
  selectedId,
  onSelect,
  downloadStats,
}: DesignGalleryProps) {
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function handleClick(e: React.MouseEvent<HTMLButtonElement>, design: DesignConfig) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    onSelect(design);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>, id: string) {
    const card = cardRefs.current.get(id);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.04)`;
  }

  function handleMouseLeave(id: string) {
    const card = cardRefs.current.get(id);
    if (card) card.style.transform = "";
  }

  function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  }

  return (
    <section className="px-4 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-text mb-4">Choose a Design</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {designs.map((design, index) => {
          const isSelected = selectedId === design.id;
          const count = downloadStats[design.id] || 0;

          return (
            <button
              key={design.id}
              ref={(el) => {
                if (el) cardRefs.current.set(design.id, el);
              }}
              onClick={(e) => handleClick(e, design)}
              onMouseMove={(e) => handleMouseMove(e, design.id)}
              onMouseLeave={() => handleMouseLeave(design.id)}
              aria-label={`Select ${design.name} design`}
              aria-pressed={isSelected}
              className={`
                group relative rounded-2xl overflow-hidden border-2
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                animate-fade-in
                transition-[border-color,box-shadow] duration-300
                ${
                  isSelected
                    ? "border-primary animate-glow-border"
                    : "border-border hover:border-primary/40 hover:shadow-xl"
                }
              `}
              style={{
                animationDelay: `${index * 100}ms`,
                transition: "transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s",
              }}
            >
              <div className="aspect-[9/16] relative bg-border/30 overflow-hidden">
                <Image
                  src={design.imagePath}
                  alt={design.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 group-hover:via-white/10 group-hover:to-white/5 transition-all duration-500" />
              </div>

              {/* Download counter badge — top left */}
              {count > 0 && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full animate-fade-in">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {formatCount(count)}
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-8">
                <span className="text-white text-sm font-medium drop-shadow-lg">
                  {design.name}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 animate-bounce-in">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
