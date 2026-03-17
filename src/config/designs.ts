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
 * 4 Official TalentS Eid Designs — 1080×1920 portrait (story size)
 *
 * Name positions are derived from the reference images
 * where "الاسم واسم العائلة" (Name and Family Name) is shown.
 */
export const designs: DesignConfig[] = [
  {
    id: "eid-happy",
    name: "Happy Eid",
    imagePath: "/designs/eid-happy.png",
    width: 1080,
    height: 1920,
    text: {
      x: 0.5,
      y: 0.535,
      maxFontSize: 52,
      minFontSize: 24,
      fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      fontWeight: "500",
      color: "#FFFFFF",
      shadow: "1px 1px 8px rgba(0,0,0,0.5)",
      align: "center",
      maxWidthFraction: 0.7,
    },
  },
  {
    id: "eid-mubarak",
    name: "Eid Mubarak",
    imagePath: "/designs/eid-mubarak.png",
    width: 1080,
    height: 1920,
    text: {
      x: 0.5,
      y: 0.512,
      maxFontSize: 52,
      minFontSize: 24,
      fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      fontWeight: "500",
      color: "#FFFFFF",
      shadow: "1px 1px 8px rgba(0,0,0,0.5)",
      align: "center",
      maxWidthFraction: 0.7,
    },
  },
  {
    id: "eid-golden",
    name: "Golden Eid",
    imagePath: "/designs/eid-golden-new.png",
    width: 1080,
    height: 1920,
    text: {
      x: 0.5,
      y: 0.551,
      maxFontSize: 52,
      minFontSize: 24,
      fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      fontWeight: "600",
      color: "#FFFFFF",
      shadow: "1px 1px 8px rgba(0,0,0,0.5)",
      align: "center",
      maxWidthFraction: 0.7,
    },
  },
  {
    id: "eid-stars",
    name: "Eid Stars",
    imagePath: "/designs/eid-stars.png",
    width: 1080,
    height: 1920,
    text: {
      x: 0.5,
      y: 0.675,
      maxFontSize: 52,
      minFontSize: 24,
      fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      fontWeight: "500",
      color: "#FFFFFF",
      shadow: "1px 1px 8px rgba(0,0,0,0.5)",
      align: "center",
      maxWidthFraction: 0.7,
    },
  },
];
