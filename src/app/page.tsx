"use client";

import { useState, useCallback } from "react";
import { DesignConfig } from "@/config/designs";
import Header from "@/components/Header";
import NameInput from "@/components/NameInput";
import DesignGallery from "@/components/DesignGallery";
import Preview from "@/components/Preview";
import DownloadButton from "@/components/DownloadButton";
import Toast from "@/components/Toast";

export default function Home() {
  const [name, setName] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<DesignConfig | null>(
    null
  );
  const [toastVisible, setToastVisible] = useState(false);

  const handleDownloadSuccess = useCallback(() => {
    setToastVisible(true);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedDesign(null);
  }, []);

  return (
    <main className="min-h-screen pb-12">
      <Header />

      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        {/* Step 1: Name input */}
        <NameInput value={name} onChange={setName} />

        {/* Step 2: Design gallery */}
        <DesignGallery
          selectedId={selectedDesign?.id ?? null}
          onSelect={setSelectedDesign}
        />

        {/* Step 3: Preview + Download */}
        <div className="flex flex-col gap-6">
          <Preview design={selectedDesign} name={name} />

          {selectedDesign && (
            <div className="flex flex-col gap-3 animate-fade-in">
              <DownloadButton
                design={selectedDesign}
                name={name}
                onSuccess={handleDownloadSuccess}
              />
              <button
                onClick={handleReset}
                className="mx-auto text-sm text-text-muted hover:text-text transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded px-2 py-1"
              >
                Change design
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-text-muted py-6">
        <p>Made with care for Eid celebrations</p>
      </footer>

      <Toast
        message="Image downloaded successfully!"
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </main>
  );
}
