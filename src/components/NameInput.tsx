"use client";

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function NameInput({ value, onChange }: NameInputProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <label
        htmlFor="name-input"
        className="block text-sm font-medium text-text mb-2"
      >
        Your Name <span className="text-text-muted">(English or Arabic)</span>
      </label>
      <input
        id="name-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="أدخل اسمك / Enter your name"
        maxLength={50}
        className="w-full px-4 py-3 rounded-xl border border-border bg-surface
                   text-text text-base placeholder:text-text-muted/60
                   focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
                   transition-all duration-200"
        dir="auto"
        autoComplete="off"
      />
      {value.length > 0 && (
        <p className="mt-1.5 text-xs text-text-muted text-right">
          {value.length}/50
        </p>
      )}
    </div>
  );
}
