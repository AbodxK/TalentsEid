"use client";

export default function Header() {
  return (
    <header className="text-center py-8 md:py-12 px-4">
      <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-primary-light rounded-full">
        <span className="text-sm font-medium text-primary">✦ TalentsEid</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-text tracking-tight">
        Personalize Your Eid Design
      </h1>
      <p className="mt-3 text-text-muted text-base md:text-lg max-w-xl mx-auto">
        Enter your name, choose a design, and download a beautiful personalized
        image — in seconds.
      </p>
    </header>
  );
}
