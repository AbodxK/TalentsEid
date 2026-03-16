"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme } = useTheme();

  return (
    <header className="text-center py-6 md:py-10 px-4 relative overflow-hidden">
        <div
          className="inline-block animate-slide-up relative h-16 md:h-20 w-[180px] mx-auto"
          style={{ animation: "slide-up 0.6s ease-out both, float 5s ease-in-out 0.6s infinite" }}
        >
          {/* Light mode logo */}
          <Image
            src="/logo.png"
            alt="TalentS logo"
            width={180}
            height={80}
            priority
            className={`h-16 md:h-20 w-auto absolute inset-0 mx-auto transition-opacity duration-300 ${theme === "dark" ? "opacity-0" : "opacity-100"}`}
          />
          {/* Dark mode logo */}
          <Image
            src="/logoWhite.png"
            alt="TalentS logo"
            width={180}
            height={80}
            priority
            className={`h-16 md:h-20 w-auto absolute inset-0 mx-auto transition-opacity duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
          />
        </div>
    </header>
  );
}
