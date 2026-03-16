"use client";

import { useState, useEffect } from "react";

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const placeholders = [
  "Enter your name...",
  "أدخل اسمك...",
  "Type your name here...",
  "اكتب اسمك هنا...",
];

export default function NameInput({ value, onChange }: NameInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typing animation for placeholder
  useEffect(() => {
    if (value.length > 0) return; // Don't animate when user is typing

    const target = placeholders[placeholderIndex];
    let charIndex = 0;
    let deleting = false;
    let timeout: NodeJS.Timeout;

    function tick() {
      if (!deleting) {
        setDisplayedPlaceholder(target.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= target.length) {
          deleting = true;
          timeout = setTimeout(tick, 2000); // Pause before deleting
          return;
        }
        timeout = setTimeout(tick, 60 + Math.random() * 40);
      } else {
        setDisplayedPlaceholder(target.slice(0, charIndex));
        charIndex--;
        if (charIndex < 0) {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          return;
        }
        timeout = setTimeout(tick, 30);
      }
    }

    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, [placeholderIndex, value.length]);

  return (
    <div className="w-full max-w-md mx-auto px-4 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <label
        htmlFor="name-input"
        className="block text-sm font-medium text-text mb-2"
      >
        Your Name <span className="text-text-muted">(English or Arabic)</span>
      </label>
      <div className="relative group">
        <input
          id="name-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          placeholder={value.length === 0 ? displayedPlaceholder : ""}
          maxLength={50}
          className="w-full px-4 py-3 rounded-xl border-2 border-border bg-surface
                     text-text text-base placeholder:text-text-muted/60
                     focus:outline-none focus:border-primary animate-border-gradient
                     transition-all duration-300
                     hover:border-primary/30 hover:shadow-md
                     focus:shadow-lg focus:shadow-primary/10"
          dir="auto"
          autoComplete="off"
        />
        {/* Animated underline indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full transition-all duration-500 w-0 group-focus-within:w-3/4" />
      </div>
      {value.length > 0 && (
        <p className="mt-1.5 text-xs text-text-muted text-right animate-fade-in">
          {value.length}/50
        </p>
      )}
    </div>
  );
}
