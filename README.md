# TalentsEid — Personalized Eid Design Generator

A responsive web app where users enter their name, choose a design template, and download a personalized image.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. User enters their name (English or Arabic)
2. Browses the design gallery and selects a template
3. Sees a live preview with their name rendered on the design
4. Downloads the final PNG image

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with fonts
│   ├── page.tsx          # Main page (state management)
│   └── globals.css       # Global styles + Tailwind theme
├── components/
│   ├── Header.tsx        # Page header/branding
│   ├── NameInput.tsx     # Name input field
│   ├── DesignGallery.tsx # Design selection grid
│   ├── Preview.tsx       # Live canvas preview
│   ├── DownloadButton.tsx# Download with validation
│   └── Toast.tsx         # Success notification
├── config/
│   └── designs.ts        # Design template configurations
├── lib/
│   └── canvas-renderer.ts# Canvas text rendering + download
public/
└── designs/              # Template images (replace these!)
```

## Adding Your Own Designs

### Step 1: Add your image

Place your template image in `/public/designs/`. Recommended size: **1080x1080px** (square) or **1080x1350px** (portrait).

### Step 2: Configure the template

Open `src/config/designs.ts` and add a new entry:

```ts
{
  id: "my-design",           // Unique ID (used in filename)
  name: "My Design",         // Display name in gallery
  imagePath: "/designs/my-design.png",
  width: 1080,               // Image width in pixels
  height: 1080,              // Image height in pixels
  text: {
    x: 0.5,                  // Horizontal position (0-1, 0.5 = center)
    y: 0.7,                  // Vertical position (0-1, 0.7 = 70% from top)
    maxFontSize: 60,          // Starting font size (shrinks for long names)
    minFontSize: 22,          // Minimum font size
    fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
    fontWeight: "600",
    color: "#FFFFFF",         // Text color
    shadow: "2px 2px 8px rgba(0,0,0,0.5)", // Optional text shadow
    align: "center",          // "center", "left", or "right"
    maxWidthFraction: 0.8,    // Max text width as fraction of image width
  },
}
```

### Text Position Guide

- `x: 0.5, y: 0.5` = dead center
- `x: 0.5, y: 0.7` = centered, 70% down from top
- `x: 0.5, y: 0.85` = centered, near bottom
- Increase `maxFontSize` for larger text
- The font auto-shrinks for long names down to `minFontSize`

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys.

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4**
- **Canvas API** for text rendering and image generation
- **Static export** — no server required

## Regenerating Placeholder Designs

```bash
node scripts/generate-placeholders.js
```

This creates sample designs in `/public/designs/`. Replace them with your own artwork.
