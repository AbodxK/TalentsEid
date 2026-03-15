"use client";

import Image from "next/image";
import { designs, DesignConfig } from "@/config/designs";

interface DesignGalleryProps {
  selectedId: string | null;
  onSelect: (design: DesignConfig) => void;
}

export default function DesignGallery({
  selectedId,
  onSelect,
}: DesignGalleryProps) {
  return (
    <section className="px-4 w-full max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-text mb-4">Choose a Design</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
        {designs.map((design, index) => {
          const isSelected = selectedId === design.id;
          return (
            <button
              key={design.id}
              onClick={() => onSelect(design)}
              aria-label={`Select ${design.name} design`}
              aria-pressed={isSelected}
              className={`
                group relative rounded-2xl overflow-hidden border-2 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                animate-fade-in
                ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                    : "border-border hover:border-primary/40 hover:shadow-lg"
                }
              `}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="aspect-square relative bg-border/30">
                <Image
                  src={design.imagePath}
                  alt={design.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <span className="text-white text-sm font-medium drop-shadow">
                  {design.name}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
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
