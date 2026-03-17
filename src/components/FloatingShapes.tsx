"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

// Element images mapping: [light, dark]
const elementImages: [string, string][] = [
  // Star
  ["/Elements for bubbles/Light/website elements.png", "/Elements for bubbles/Dark/elements-13.png"],
  // Dallah (coffee pot)
  ["/Elements for bubbles/Light/website elements 1-14.png", "/Elements for bubbles/Dark/elements-14.png"],
  // Cups
  ["/Elements for bubbles/Light/website elements 1-15.png", "/Elements for bubbles/Dark/elements-15.png"],
  // Crescent moon
  ["/Elements for bubbles/Light/website elements 4.png", "/Elements for bubbles/Dark/elements-17.png"],
  // Candy
  ["/Elements for bubbles/Light/website elements 2.png", "/Elements for bubbles/Dark/elements-18.png"],
];

const BUBBLE_COUNT = 12;

interface PhysicsBubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  iconIndex: number;
  wobblePhase: number;
  wobbleSpeed: number;
  alive: boolean;
  popping: boolean;
  dropping: boolean;
  opacity: number;
}

function randomBubble(id: number, fromTop = false): PhysicsBubble {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const isMobile = w < 768;
  const size = isMobile
    ? 25 + Math.random() * 35   // 25–60px on mobile
    : 40 + Math.random() * 80;  // 40–120px on desktop
  const h = typeof window !== "undefined" ? window.innerHeight : 800;

  let x: number, y: number;
  if (fromTop) {
    const edge = Math.floor(Math.random() * 3);
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
    iconIndex: Math.floor(Math.random() * elementImages.length),
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.01 + Math.random() * 0.02,
    alive: true,
    popping: false,
    dropping: fromTop,
    opacity: fromTop ? 0 : 1,
  };
}

function PopFragments({ x, y }: { x: number; y: number }) {
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
            backgroundColor: "#888888",
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
          background: `radial-gradient(circle, rgba(150,150,150,0.5) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

interface FloatingShapesProps {
  onPop?: () => void;
}

export default function FloatingShapes({ onPop }: FloatingShapesProps) {
  const { theme } = useTheme();
  const bubblesRef = useRef<PhysicsBubble[]>([]);
  const [renderBubbles, setRenderBubbles] = useState<PhysicsBubble[]>([]);
  const [pops, setPops] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const animRef = useRef<number>(0);
  const nextId = useRef(BUBBLE_COUNT);

  useEffect(() => {
    bubblesRef.current = Array.from({ length: BUBBLE_COUNT }, (_, i) => randomBubble(i, false));
    setRenderBubbles([...bubblesRef.current]);
  }, []);

  useEffect(() => {
    let frameCount = 0;

    function tick() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (const b of bubblesRef.current) {
        if (!b.alive) continue;

        b.wobblePhase += b.wobbleSpeed;
        const wobbleX = Math.sin(b.wobblePhase) * 0.4;
        const wobbleY = Math.cos(b.wobblePhase * 0.7) * 0.25;

        b.x += b.vx + wobbleX;
        b.y += b.vy + wobbleY;

        if (b.dropping) {
          b.opacity = Math.min(1, b.opacity + 0.02);
          b.vx += (((Math.random() - 0.5) * 0.5) - b.vx) * 0.02;
          b.vy += (((Math.random() - 0.5) * 0.3) - b.vy) * 0.02;
          if (b.opacity >= 1 && b.x > 0 && b.x < w - b.size && b.y > 0 && b.y < h - b.size) {
            b.dropping = false;
          }
        }

        if (b.x < -b.size * 0.5) b.vx = Math.abs(b.vx) + 0.2;
        if (b.x > w - b.size * 0.5) b.vx = -(Math.abs(b.vx) + 0.2);
        if (b.y < -b.size * 0.5) b.vy = Math.abs(b.vy) + 0.15;
        if (b.y > h - b.size * 0.5) b.vy = -(Math.abs(b.vy) + 0.15);

        b.vx *= 0.999;
        b.vy *= 0.999;

        if (Math.random() < 0.005) {
          b.vx += (Math.random() - 0.5) * 0.3;
          b.vy += (Math.random() - 0.5) * 0.2;
        }

        const maxSpeed = 1.2;
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (speed > maxSpeed) {
          b.vx = (b.vx / speed) * maxSpeed;
          b.vy = (b.vy / speed) * maxSpeed;
        }
      }

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

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const popId = Date.now() + id;
    setPops((prev) => [...prev, { id: popId, x: cx, y: cy }]);

    setTimeout(() => {
      const b = bubblesRef.current.find((b) => b.id === id);
      if (b) b.alive = false;
    }, 300);

    setTimeout(() => {
      setPops((prev) => prev.filter((p) => p.id !== popId));
    }, 700);

    setTimeout(() => {
      const newBubble = randomBubble(nextId.current++, true);
      bubblesRef.current.push(newBubble);
    }, 800 + Math.random() * 1200);
  }, [onPop]);

  // Pick light (index 0) or dark (index 1) image set
  const themeIndex = theme === "dark" ? 0 : 1;
  const isDark = theme === "dark";

  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-[15] pointer-events-none" aria-hidden="true">
        {renderBubbles.map((bubble) => {
          const imgSrc = elementImages[bubble.iconIndex][themeIndex];
          const imgSize = bubble.size * 0.55;

          return (
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
              <div
                onClick={(e) => handlePop(bubble.id, e)}
                className={`
                  w-full h-full rounded-full cursor-pointer
                  hover:scale-110 active:scale-95
                  ${bubble.popping ? "animate-bubble-pop" : "transition-transform duration-150"}
                `}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  background: isDark
                    ? `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.01) 60%, transparent 70%)`
                    : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 30%, rgba(200,200,210,0.15) 60%, rgba(180,180,200,0.05) 80%, transparent 100%)`,
                  boxShadow: isDark
                    ? `inset 0 0 ${bubble.size * 0.15}px rgba(255,255,255,0.1), 0 0 ${bubble.size * 0.08}px rgba(150,150,150,0.06)`
                    : `inset 0 0 ${bubble.size * 0.2}px rgba(255,255,255,0.6), 0 ${bubble.size * 0.03}px ${bubble.size * 0.1}px rgba(0,0,0,0.06), 0 0 ${bubble.size * 0.05}px rgba(100,100,120,0.1)`,
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid rgba(255,255,255,0.6)",
                  backdropFilter: "blur(0.5px)",
                }}
              >
                {/* Bubble shine highlight */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: "40%",
                    height: "25%",
                    top: "12%",
                    left: "18%",
                    background: isDark
                      ? "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 100%)",
                    borderRadius: "50%",
                    transform: "rotate(-20deg)",
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt=""
                  width={imgSize}
                  height={imgSize}
                  style={{
                    width: imgSize,
                    height: imgSize,
                    objectFit: "contain",
                    opacity: 0.45,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>

      {pops.map((pop) => (
        <PopFragments key={pop.id} x={pop.x} y={pop.y} />
      ))}
    </>
  );
}
