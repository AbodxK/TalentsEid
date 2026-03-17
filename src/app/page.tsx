"use client";

import { useState, useCallback, useEffect } from "react";
import { DesignConfig } from "@/config/designs";
import Header from "@/components/Header";
import NameInput from "@/components/NameInput";
import DesignGallery from "@/components/DesignGallery";

import DownloadButton from "@/components/DownloadButton";
import Toast from "@/components/Toast";
import FloatingShapes from "@/components/FloatingShapes";
import Sparkles from "@/components/Sparkles";
import MouseGlow from "@/components/MouseGlow";
import SharePanel from "@/components/SharePanel";
import Confetti from "@/components/Confetti";
import LoadingScreen from "@/components/LoadingScreen";
import ThemeToggle from "@/components/ThemeToggle";
import PopCounter from "@/components/PopCounter";
import ScrollReveal from "@/components/ScrollReveal";
import { playPopSound } from "@/lib/pop-sound";
import { getDownloadStats, incrementDownload, DownloadStats } from "@/lib/download-stats";

export default function Home() {
  const [name, setName] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<DesignConfig | null>(
    null
  );
  const [toastVisible, setToastVisible] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popCount, setPopCount] = useState(0);
  const [downloadStats, setDownloadStats] = useState<DownloadStats>({});

  // Load stats on mount
  useEffect(() => {
    setDownloadStats(getDownloadStats());
  }, []);

  const handleDownloadSuccess = useCallback(() => {
    setToastVisible(true);
    setShowShare(true);
    setShowConfetti(true);
    if (selectedDesign) {
      const updated = incrementDownload(selectedDesign.id);
      setDownloadStats({ ...updated });
    }
  }, [selectedDesign]);

  const handleReset = useCallback(() => {
    setSelectedDesign(null);
  }, []);

  const handleBubblePop = useCallback(() => {
    playPopSound();
    setPopCount((prev) => prev + 1);
  }, []);

  return (
    <>
    {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
    <main className={`min-h-screen pb-12 relative transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>

      <FloatingShapes onPop={handleBubblePop} />
      <MouseGlow />
      <Sparkles />
      <ThemeToggle />
      <PopCounter count={popCount} />
      <Header />

      <div className="flex flex-col gap-8 max-w-6xl mx-auto relative z-10">
        {/* Step 1: Name input */}
        <ScrollReveal direction="up" delay={100}>
          <NameInput value={name} onChange={setName} />
        </ScrollReveal>

        {/* Step 2: Design gallery */}
        <ScrollReveal direction="up" delay={200}>
          <DesignGallery
            selectedId={selectedDesign?.id ?? null}
            onSelect={setSelectedDesign}
            downloadStats={downloadStats}
          />
        </ScrollReveal>

        {/* Step 3: Download */}
        <ScrollReveal direction="up" delay={100}>
          <div className="flex flex-col gap-6">
            {selectedDesign && (
              <div className="flex flex-col gap-3 animate-fade-in">
                <DownloadButton
                  design={selectedDesign}
                  name={name}
                  onSuccess={handleDownloadSuccess}
                />
                <SharePanel
                  visible={showShare}
                  designName={selectedDesign?.name ?? ""}
                  userName={name}
                />
                <button
                  onClick={() => { handleReset(); setShowShare(false); }}
                  className="mx-auto text-sm text-text-muted hover:text-text transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-2 py-1"
                >
                  Change design
                </button>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>


      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <Toast
        message="Image downloaded successfully! 🎉"
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </main>
    </>
  );
}
