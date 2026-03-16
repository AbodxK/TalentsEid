"use client";

import { useState } from "react";

interface SharePanelProps {
  visible: boolean;
  designName: string;
  userName: string;
}

export default function SharePanel({ visible, designName, userName }: SharePanelProps) {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const shareText = `Check out my personalized Eid design! 🌙✨ — ${userName}`;
  const siteUrl = typeof window !== "undefined" ? window.location.href : "";

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + siteUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = siteUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Eid Design",
          text: shareText,
          url: siteUrl,
        });
      } catch {
        // User cancelled
      }
    }
  }

  return (
    <div className="animate-fade-in flex flex-col items-center gap-3 mt-2">
      <p className="text-sm text-text-muted font-medium">Share your design</p>
      <div className="flex items-center gap-3">
        {/* WhatsApp */}
        <button
          onClick={shareWhatsApp}
          aria-label="Share on WhatsApp"
          className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </button>

        {/* Twitter/X */}
        <button
          onClick={shareTwitter}
          aria-label="Share on X (Twitter)"
          className="w-11 h-11 rounded-full bg-black hover:bg-gray-800 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* Native Share (mobile) / Copy Link (desktop) */}
        {"share" in (typeof navigator !== "undefined" ? navigator : {}) ? (
          <button
            onClick={nativeShare}
            aria-label="Share"
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg ${
              copied
                ? "bg-success text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {copied ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.757 8.25" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
