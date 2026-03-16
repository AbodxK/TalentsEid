"use client";

import { useState, useRef, useCallback } from "react";
import { DesignConfig } from "@/config/designs";
import { downloadDesign } from "@/lib/canvas-renderer";

interface DownloadButtonProps {
  design: DesignConfig | null;
  name: string;
  onSuccess: () => void;
}

export default function DownloadButton({
  design,
  name,
  onSuccess,
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState("");

  const isValid = design !== null && name.trim().length > 0;
  const trimmedName = name.trim();

  let hint = "";
  if (!trimmedName) hint = "Enter your name first";
  else if (!design) hint = "Select a design first";

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isValid || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setTransform(`translate(${x * 0.15}px, ${y * 0.25}px)`);
    },
    [isValid]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("");
  }, []);

  async function handleDownload() {
    if (!design || !trimmedName) return;
    setDownloading(true);
    try {
      await downloadDesign(design, trimmedName);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
      onSuccess();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center gap-2">
      <button
        ref={buttonRef}
        onClick={handleDownload}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={!isValid || downloading}
        aria-label="Download personalized design"
        className={`
          w-full py-3.5 px-6 rounded-xl text-base font-semibold
          transition-all duration-300 flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          relative overflow-hidden
          ${
            isValid && !downloading
              ? "bg-primary text-white hover:bg-primary-hover active:scale-[0.97] shadow-lg shadow-primary/25 animate-pulse-glow hover:shadow-xl hover:shadow-primary/30"
              : "bg-border text-text-muted cursor-not-allowed"
          }
        `}
        style={{ transform: transform || undefined }}
      >
        {isValid && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover-shine" />
        )}

        {downloading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : showSuccess ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Done!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PNG
          </>
        )}
      </button>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
