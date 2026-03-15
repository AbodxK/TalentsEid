export interface DesignConfig {
  /** Unique identifier */
  id: string;
  /** Display name shown in the gallery */
  name: string;
  /** Path to the template image in /public */
  imagePath: string;
  /** Final output dimensions */
  width: number;
  height: number;
  /** Text placement configuration */
  text: {
    /** X position as a fraction of width (0–1) */
    x: number;
    /** Y position as a fraction of height (0–1) */
    y: number;
    /** Maximum font size in pixels (auto-shrinks for long names) */
    maxFontSize: number;
    /** Minimum font size — below this the text just clips */
    minFontSize: number;
    /** Font family (include Arabic-friendly fallback) */
    fontFamily: string;
    /** Font weight */
    fontWeight: string;
    /** Text color */
    color: string;
    /** Optional text shadow for readability */
    shadow?: string;
    /** Text alignment: "center" | "left" | "right" */
    align: CanvasTextAlign;
    /** Maximum width as fraction of design width (safe area) */
    maxWidthFraction: number;
  };
}

/**
 * HOW TO ADD A NEW DESIGN:
 * 1. Place your template image in /public/designs/
 * 2. Add a new entry below with the correct dimensions and text config
 * 3. Adjust x, y, maxFontSize, color, etc. to position the name on your design
 *
 * The x/y values are fractions (0-1) of the image dimensions.
 * For example, x: 0.5, y: 0.6 places text at the center horizontally
 * and 60% down from the top.
 */
export const designs: DesignConfig[] = [
  {
    id: "eid-golden",
    name: "Golden Eid",
    imagePath: "/designs/eid-golden.png",
    width: 1080,
    height: 1080,
    text: {
      x: 0.5,
      y: 0.72,
      maxFontSize: 64,
      minFontSize: 24,
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
      fontWeight: "700",
      color: "#D4A843",
      shadow: "2px 2px 8px rgba(0,0,0,0.5)",
      align: "center",
      maxWidthFraction: 0.8,
    },
  },
  {
    id: "eid-floral",
    name: "Floral Eid",
    imagePath: "/designs/eid-floral.png",
    width: 1080,
    height: 1080,
    text: {
      x: 0.5,
      y: 0.68,
      maxFontSize: 58,
      minFontSize: 22,
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
      fontWeight: "600",
      color: "#FFFFFF",
      shadow: "1px 1px 6px rgba(0,0,0,0.7)",
      align: "center",
      maxWidthFraction: 0.75,
    },
  },
  {
    id: "eid-minimal",
    name: "Minimal Eid",
    imagePath: "/designs/eid-minimal.png",
    width: 1080,
    height: 1080,
    text: {
      x: 0.5,
      y: 0.75,
      maxFontSize: 56,
      minFontSize: 20,
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
      fontWeight: "500",
      color: "#1e293b",
      align: "center",
      maxWidthFraction: 0.7,
    },
  },
  {
    id: "eid-crescent",
    name: "Crescent Night",
    imagePath: "/designs/eid-crescent.png",
    width: 1080,
    height: 1350,
    text: {
      x: 0.5,
      y: 0.8,
      maxFontSize: 60,
      minFontSize: 22,
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
      fontWeight: "700",
      color: "#F5E6C8",
      shadow: "2px 2px 10px rgba(0,0,0,0.6)",
      align: "center",
      maxWidthFraction: 0.8,
    },
  },
  {
    id: "eid-geometric",
    name: "Geometric Eid",
    imagePath: "/designs/eid-geometric.png",
    width: 1080,
    height: 1080,
    text: {
      x: 0.5,
      y: 0.65,
      maxFontSize: 54,
      minFontSize: 20,
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
      fontWeight: "600",
      color: "#FFFFFF",
      shadow: "1px 1px 4px rgba(0,0,0,0.4)",
      align: "center",
      maxWidthFraction: 0.7,
    },
  },
  {
    id: "eid-watercolor",
    name: "Watercolor Eid",
    imagePath: "/designs/eid-watercolor.png",
    width: 1080,
    height: 1080,
    text: {
      x: 0.5,
      y: 0.7,
      maxFontSize: 60,
      minFontSize: 22,
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
      fontWeight: "600",
      color: "#2d5016",
      align: "center",
      maxWidthFraction: 0.75,
    },
  },
];
