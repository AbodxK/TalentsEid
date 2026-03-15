"use client";

import { useEffect, useRef, useState } from "react";
import { DesignConfig } from "@/config/designs";
import { renderDesign } from "@/lib/canvas-renderer";

interface PreviewProps {
  design: DesignConfig | null;
  name: string;
}

export default function Preview({ design, name }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!design) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    // Use a smaller scale for preview to keep it fast
    const previewScale = 0.5;

    renderDesign(design, name, previewScale)
      .then((rendered) => {
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = rendered.width;
        canvas.height = rendered.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(rendered, 0, 0);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to render preview");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [design, name]);

  if (!design) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="aspect-square rounded-2xl border-2 border-dashed border-border bg-surface flex flex-col items-center justify-center text-text-muted gap-3 p-8">
          <svg
            className="w-12 h-12 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <p className="text-sm text-center">
            Select a design above to see a preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h2 className="text-lg font-semibold text-text mb-3">Preview</h2>
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border bg-surface">
        {loading && (
          <div className="absolute inset-0 bg-surface/80 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-surface/90 flex items-center justify-center z-10 p-4">
            <p className="text-error text-sm text-center">{error}</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          role="img"
          aria-label={`Preview of ${design.name} design with name: ${name || "no name entered"}`}
        />
      </div>
    </div>
  );
}
