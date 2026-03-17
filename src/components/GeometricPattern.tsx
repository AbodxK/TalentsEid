"use client";

export default function GeometricPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Large slow-rotating geometric shape top-right */}
      <svg
        className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.03]"
        viewBox="0 0 200 200"
        style={{ animation: "geo-rotate 60s linear infinite" }}
      >
        <g fill="none" stroke="#888888" strokeWidth="0.5">
          {/* Islamic 8-pointed star pattern */}
          <polygon points="100,10 120,80 190,80 130,120 150,190 100,150 50,190 70,120 10,80 80,80" />
          <polygon points="100,30 115,80 170,80 125,110 140,170 100,140 60,170 75,110 30,80 85,80" />
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="50" />
          {/* Connecting lines */}
          <line x1="100" y1="10" x2="100" y2="190" />
          <line x1="10" y1="100" x2="190" y2="100" />
          <line x1="30" y1="30" x2="170" y2="170" />
          <line x1="170" y1="30" x2="30" y2="170" />
        </g>
      </svg>

      {/* Bottom-left pattern */}
      <svg
        className="absolute -bottom-16 -left-16 w-[300px] h-[300px] opacity-[0.03]"
        viewBox="0 0 200 200"
        style={{ animation: "geo-rotate 80s linear infinite reverse" }}
      >
        <g fill="none" stroke="#777777" strokeWidth="0.5">
          <polygon points="100,10 120,80 190,80 130,120 150,190 100,150 50,190 70,120 10,80 80,80" />
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="30" />
          <line x1="100" y1="10" x2="100" y2="190" />
          <line x1="10" y1="100" x2="190" y2="100" />
        </g>
      </svg>

      {/* Center-right subtle pattern */}
      <svg
        className="absolute top-1/2 -right-10 w-[200px] h-[200px]"
        viewBox="0 0 100 100"
        style={{ animation: "geo-pulse 8s ease-in-out infinite" }}
      >
        <g fill="none" stroke="#999999" strokeWidth="0.3">
          <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
          <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" />
          <rect x="40" y="40" width="20" height="20" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="40" />
        </g>
      </svg>
    </div>
  );
}
