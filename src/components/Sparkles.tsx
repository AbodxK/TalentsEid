"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  decay: number;
  color: string;
  type: "circle" | "star";
}

const COLORS = ["#888888", "#999999", "#aaaaaa", "#bbbbbb", "#cccccc", "#dddddd"];

export default function Sparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMouseMove);

    function spawnParticle(x: number, y: number) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 1.2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: 1.5 + Math.random() * 3,
        opacity: 0.6 + Math.random() * 0.4,
        decay: 0.008 + Math.random() * 0.012,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: Math.random() > 0.6 ? "star" : "circle",
      });
    }

    // Ambient particles that spawn randomly
    function spawnAmbient() {
      if (!canvas) return;
      if (particles.current.length < 60) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2 - Math.random() * 0.5,
          size: 1 + Math.random() * 2.5,
          opacity: 0.3 + Math.random() * 0.4,
          decay: 0.003 + Math.random() * 0.006,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          type: Math.random() > 0.5 ? "star" : "circle",
        });
      }
    }

    function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.lineTo(x, y - outerRadius);
      ctx.closePath();
      ctx.fill();
    }

    function animate(time: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn mouse trail particles
      if (time - lastSpawn.current > 40 && mouse.current.x > 0) {
        spawnParticle(
          mouse.current.x + (Math.random() - 0.5) * 20,
          mouse.current.y + (Math.random() - 0.5) * 20
        );
        lastSpawn.current = time;
      }

      // Ambient particles
      if (time % 3 < 1) spawnAmbient();

      // Update and draw
      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= p.decay;
        p.size *= 0.998;

        if (p.opacity <= 0) return false;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === "star") {
          drawStar(ctx, p.x, p.y, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}
