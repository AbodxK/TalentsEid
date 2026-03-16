"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const eidIcons = [
  // Crescent moon
  `M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.4 0 2.7-.3 3.9-.8C12.7 19.8 10 16.2 10 12s2.7-7.8 5.9-9.2C14.7 2.3 13.4 2 12 2z`,
  // Lantern
  `M9 2h6l1 3H8L9 2zM8 6h8v1c0 1-1 2-1 2v8s1 1 1 2v1H8v-1c0-1 1-2 1-2V9S8 8 8 7V6zm3 3v7h2V9h-2z`,
  // Star
  `M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z`,
  // Mosque dome
  `M12 3C8 3 5 7 5 10v2H3v9h18v-9h-2v-2c0-3-3-7-7-7zm0 2c3 0 5 3 5 5v2H7v-2c0-2 2-5 5-5zm-1 7h2v7h-2v-7z`,
  // Gift/present
  `M20 12v8H4v-8h16zm-2-4H6a2 2 0 00-2 2h16a2 2 0 00-2-2zm-6-4c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z`,
  // Tea cup
  `M5 10h10v6a4 4 0 01-4 4H9a4 4 0 01-4-4v-6zm12 1h1a2 2 0 010 4h-1v-4zM8 6c0-1 .5-2 2-3 1.5 1 2 2 2 3H8z`,
  // Dates/palm
  `M12 2s3 2 3 6c0 2-1 3-3 4 2-1 3-2 3-4 0-4-3-6-3-6zm-4 8c-1 0-2 1-2 3s2 4 4 5v4h4v-4c2-1 4-3 4-5s-1-3-2-3c-1 0-2 1-2 2 0-1-1-2-2-2s-2 1-2 2c0-1-1-2-2-2z`,
  // Crescent + star
  `M12 2C8 2 5 5 5 9c0 2.5 1.3 4.8 3.3 6.1L7 22l5-3 5 3-1.3-6.9C17.7 13.8 19 11.5 19 9c0-4-3-7-7-7zm2.5 5.5l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2.7-1.5z`,
];

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#e0e7ff", "#818cf8"];
const BUBBLE_COUNT = 12;

interface PhysicsBubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  iconIndex: number;
  wobblePhase: number;
  wobbleSpeed: number;
  alive: boolean;
  popping: boolean;
  dropping: boolean; // entering from outside screen
  opacity: number;
}

function randomBubble(id: number, fromTop = false): PhysicsBubble {
  const size = 40 + Math.random() * 80;
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;

  let x: number, y: number;
  if (fromTop) {
    // Drop from random edge
    const edge = Math.floor(Math.random() * 3); // 0=top, 1=left, 2=right
    if (edge === 0) {
      x = Math.random() * w;
      y = -size - Math.random() * 100;
    } else if (edge === 1) {
      x = -size - Math.random() * 50;
      y = Math.random() * h * 0.6;
    } else {
      x = w + Math.random() * 50;
      y = Math.random() * h * 0.6;
    }
  } else {
    x = Math.random() * (w - size);
    y = Math.random() * (h - size);
  }

  return {
    id,
    x,
    y,
    vx: (Math.random() - 0.5) * 0.6,
    vy: fromTop ? 1.5 + Math.random() * 1 : (Math.random() - 0.5) * 0.4,
    size,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    iconIndex: Math.floor(Math.random() * eidIcons.length),
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
    alive: true,
    popping: false,
    dropping: fromTop,
    opacity: fromTop ? 0 : 1,
  };
}

function PopFragments({ x, y, color }: { x: number; y: number; color: string }) {
  const fragments = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 40 + Math.random() * 30;
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.05,
    };
  });

  return (
    <div className="fixed pointer-events-none z-30" style={{ left: x, top: y }}>
      {fragments.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full animate-pop-fragment"
          style={{
            width: f.size,
            height: f.size,
            backgroundColor: color,
            opacity: 0.6,
            ["--tx" as string]: `${f.tx}px`,
            ["--ty" as string]: `${f.ty}px`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-pop-flash"
        style={{
          width: 60,
          height: 60,
          background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

interface FloatingShapesProps {
  onPop?: () => void;
}

export default function FloatingShapes({ onPop }: FloatingShapesProps) {
  const bubblesRef = useRef<PhysicsBubble[]>([]);
  const [renderBubbles, setRenderBubbles] = useState<PhysicsBubble[]>([]);
  const [pops, setPops] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const animRef = useRef<number>(0);
  const nextId = useRef(BUBBLE_COUNT);

  // Initialize bubbles
  useEffect(() => {
    bubblesRef.current = Array.from({ length: BUBBLE_COUNT }, (_, i) => randomBubble(i, false));
    setRenderBubbles([...bubblesRef.current]);
  }, []);

  // Physics loop
  useEffect(() => {
    let frameCount = 0;

    function tick() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (const b of bubblesRef.current) {
        if (!b.alive) continue;

        // Wobble motion
        b.wobblePhase += b.wobbleSpeed;
        const wobbleX = Math.sin(b.wobblePhase) * 0.4;
        const wobbleY = Math.cos(b.wobblePhase * 0.7) * 0.25;

        b.x += b.vx + wobbleX;
        b.y += b.vy + wobbleY;

        // Dropping bubble: decelerate and fade in
        if (b.dropping) {
          b.opacity = Math.min(1, b.opacity + 0.02);
          // Slow down to normal speed
          b.vx += (((Math.random() - 0.5) * 0.5) - b.vx) * 0.02;
          b.vy += (((Math.random() - 0.5) * 0.3) - b.vy) * 0.02;
          if (b.opacity >= 1 && b.x > 0 && b.x < w - b.size && b.y > 0 && b.y < h - b.size) {
            b.dropping = false;
          }
        }

        // Soft bounce off edges (wrap around with gentle push)
        if (b.x < -b.size * 0.5) {
          b.vx = Math.abs(b.vx) + 0.2;
        }
        if (b.x > w - b.size * 0.5) {
          b.vx = -(Math.abs(b.vx) + 0.2);
        }
        if (b.y < -b.size * 0.5) {
          b.vy = Math.abs(b.vy) + 0.15;
        }
        if (b.y > h - b.size * 0.5) {
          b.vy = -(Math.abs(b.vy) + 0.15);
        }

        // Dampen velocity to keep motion gentle
        b.vx *= 0.999;
        b.vy *= 0.999;

        // Random drift changes
        if (Math.random() < 0.005) {
          b.vx += (Math.random() - 0.5) * 0.3;
          b.vy += (Math.random() - 0.5) * 0.2;
        }

        // Clamp max speed
        const maxSpeed = 1.2;
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        }
      }

      // Update React state every 2 frames for performance
      frameCount++;
      if (frameCount % 2 === 0) {
        setRenderBubbles(bubblesRef.current.filter((b) => b.alive).map((b) => ({ ...b })));
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handlePop = useCallback((id: number, e: React.MouseEvent) => {
    const bubble = bubblesRef.current.find((b) => b.id === id);
    if (!bubble || !bubble.alive || bubble.popping) return;

    bubble.popping = true;
    onPop?.();

    // Pop fragments
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const popId = Date.now() + id;
    setPops((prev) => [...prev, { id: popId, x: cx, y: cy, color: bubble.color }]);

    // Kill bubble after animation
    setTimeout(() => {
      const b = bubblesRef.current.find((b) => b.id === id);
      if (b) b.alive = false;
    }, 300);

    // Clean up fragments
    setTimeout(() => {
      setPops((prev) => prev.filter((p) => p.id !== popId));
    }, 700);

    // Spawn replacement dropping from outside
    setTimeout(() => {
      const newBubble = randomBubble(nextId.current++, true);
      bubblesRef.current.push(newBubble);
    }, 800 + Math.random() * 1200);
  }, []);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-[1]" aria-hidden="true">
        {renderBubbles.map((bubble) => {
          const iconPath = eidIcons[bubble.iconIndex];
          const iconSize = bubble.size * 0.35;

          return (
            /* Outer wrapper handles position only */
            <div
              key={bubble.id}
              className="absolute"
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                opacity: bubble.opacity,
                pointerEvents: "auto",
                willChange: "left, top",
              }}
            >
              {/* Inner div handles pop animation + hover */}
              <div
                onClick={(e) => handlePop(bubble.id, e)}
                className={`
                  w-full h-full rounded-full cursor-pointer
                  hover:scale-110 active:scale-95
                  ${bubble.popping ? "animate-bubble-pop" : "transition-transform duration-150"}
                `}
                style={{
                  background: `radial-gradient(circle at 35% 35%, ${bubble.color}25 0%, ${bubble.color}12 50%, ${bubble.color}08 100%)`,
                  border: `1.5px solid ${bubble.color}20`,
                  backdropFilter: "blur(1px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Bubble shine */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: bubble.size * 0.3,
                    height: bubble.size * 0.2,
                    top: "15%",
                    left: "20%",
                    background: `linear-gradient(135deg, ${bubble.color}30 0%, transparent 100%)`,
                    borderRadius: "50%",
                    transform: "rotate(-30deg)",
                  }}
                />

                {/* Eid icon */}
                <svg
                  width={iconSize}
                  height={iconSize}
                  viewBox="0 0 24 24"
                  fill={bubble.color}
                  opacity={0.35}
                  className="relative z-10"
                >
                  <path d={iconPath} />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {pops.map((pop) => (
        <PopFragments key={pop.id} x={pop.x} y={pop.y} color={pop.color} />
      ))}
    </>
  );
}
