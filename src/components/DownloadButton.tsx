"use client";

import { useState } from "react";
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

  const isValid = design !== null && name.trim().length > 0;
  const trimmedName = name.trim();

  let hint = "";
  if (!trimmedName) hint = "Enter your name first";
  else if (!design) hint = "Select a design first";

  async function handleDownload() {
    if (!design || !trimmedName) return;
    setDownloading(true);
    try {
      await downloadDesign(design, trimmedName);
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
        onClick={handleDownload}
        disabled={!isValid || downloading}
        aria-label="Download personalized design"
        className={`
          w-full py-3.5 px-6 rounded-xl text-base font-semibold
          transition-all duration-200 flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          ${
            isValid && !downloading
              ? "bg-primary text-white hover:bg-primary-hover active:scale-[0.98] shadow-lg shadow-primary/25"
              : "bg-border text-text-muted cursor-not-allowed"
          }
        `}
      >
        {downloading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download PNG
          </>
        )}
      </button>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
}
