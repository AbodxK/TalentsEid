/**
 * Generates placeholder design images for development.
 * Run: node scripts/generate-placeholders.js
 * Replace these with your own designs in /public/designs/
 */
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "..", "public", "designs");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const designs = [
  {
    filename: "eid-golden.png",
    width: 1080,
    height: 1080,
    bg: ["#1a1a2e", "#16213e"],
    accent: "#D4A843",
    title: "Eid Mubarak",
    subtitle: "عيد مبارك",
    pattern: "stars",
  },
  {
    filename: "eid-floral.png",
    width: 1080,
    height: 1080,
    bg: ["#2d5016", "#1a3a0a"],
    accent: "#a8d08d",
    title: "Eid Mubarak",
    subtitle: "عيد مبارك",
    pattern: "circles",
  },
  {
    filename: "eid-minimal.png",
    width: 1080,
    height: 1080,
    bg: ["#f8fafc", "#e2e8f0"],
    accent: "#6366f1",
    title: "Eid Mubarak",
    subtitle: "عيد مبارك",
    pattern: "lines",
  },
  {
    filename: "eid-crescent.png",
    width: 1080,
    height: 1350,
    bg: ["#0f172a", "#1e293b"],
    accent: "#F5E6C8",
    title: "Eid Mubarak",
    subtitle: "عيد مبارك",
    pattern: "crescent",
  },
  {
    filename: "eid-geometric.png",
    width: 1080,
    height: 1080,
    bg: ["#7c3aed", "#4c1d95"],
    accent: "#ddd6fe",
    title: "Eid Mubarak",
    subtitle: "عيد مبارك",
    pattern: "diamonds",
  },
  {
    filename: "eid-watercolor.png",
    width: 1080,
    height: 1080,
    bg: ["#ecfdf5", "#d1fae5"],
    accent: "#065f46",
    title: "Eid Mubarak",
    subtitle: "عيد مبارك",
    pattern: "dots",
  },
];

function drawPattern(ctx, pattern, w, h, color) {
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  switch (pattern) {
    case "stars":
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.5;
        const size = 3 + Math.random() * 8;
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }
      break;
    case "circles":
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.beginPath();
        ctx.arc(x, y, 20 + Math.random() * 60, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      break;
    case "lines":
      for (let i = 0; i < 15; i++) {
        const y = (i / 15) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      break;
    case "crescent":
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.3, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(w * 0.55, h * 0.28, 130, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      break;
    case "diamonds":
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const size = 15 + Math.random() * 30;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      }
      break;
    case "dots":
      for (let i = 0; i < 80; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.random() * 10, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
  }
  ctx.globalAlpha = 1;
}

for (const d of designs) {
  const canvas = createCanvas(d.width, d.height);
  const ctx = canvas.getContext("2d");

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, d.height);
  grad.addColorStop(0, d.bg[0]);
  grad.addColorStop(1, d.bg[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, d.width, d.height);

  // Decorative pattern
  drawPattern(ctx, d.pattern, d.width, d.height, d.accent);

  // Border frame
  ctx.strokeStyle = d.accent;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, d.width - 80, d.height - 80);
  ctx.globalAlpha = 1;

  // Title text
  ctx.fillStyle = d.accent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 72px sans-serif";
  ctx.fillText(d.title, d.width / 2, d.height * 0.35);

  // Arabic subtitle
  ctx.font = "bold 56px sans-serif";
  ctx.fillText(d.subtitle, d.width / 2, d.height * 0.45);

  // "Your name here" placeholder line
  ctx.globalAlpha = 0.4;
  ctx.font = "32px sans-serif";
  ctx.fillText("— Your Name Here —", d.width / 2, d.height * 0.72);
  ctx.globalAlpha = 1;

  // Decorative divider
  ctx.strokeStyle = d.accent;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(d.width * 0.3, d.height * 0.55);
  ctx.lineTo(d.width * 0.7, d.height * 0.55);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const buffer = canvas.toBuffer("image/png");
  const filePath = path.join(outputDir, d.filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Created: ${filePath}`);
}

console.log("\nAll placeholder designs generated!");
