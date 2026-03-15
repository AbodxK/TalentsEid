import { DesignConfig } from "@/config/designs";

/** Load an image from a URL and return an HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/** Parse CSS text-shadow into canvas-compatible values */
function parseShadow(shadow: string): {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
} {
  const match = shadow.match(
    /(-?\d+)px\s+(-?\d+)px\s+(-?\d+)px\s+(.*)/
  );
  if (!match)
    return { offsetX: 0, offsetY: 0, blur: 0, color: "transparent" };
  return {
    offsetX: parseInt(match[1]),
    offsetY: parseInt(match[2]),
    blur: parseInt(match[3]),
    color: match[4].trim(),
  };
}

/** Detect if text contains Arabic characters */
function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
    text
  );
}

/**
 * Calculate the optimal font size that fits within the max width.
 * Shrinks from maxFontSize down to minFontSize.
 */
function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  fontWeight: string,
  maxFontSize: number,
  minFontSize: number,
  maxWidth: number
): number {
  let fontSize = maxFontSize;
  while (fontSize > minFontSize) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    if (metrics.width <= maxWidth) break;
    fontSize -= 2;
  }
  return fontSize;
}

/**
 * Render the name onto the design image and return as a canvas.
 * Used for both preview and final download.
 */
export async function renderDesign(
  design: DesignConfig,
  name: string,
  scale: number = 1
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = design.width * scale;
  canvas.height = design.height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context");

  const img = await loadImage(design.imagePath);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  if (!name.trim()) return canvas;

  const { text } = design;
  const maxWidth = design.width * text.maxWidthFraction * scale;
  const scaledMaxFont = text.maxFontSize * scale;
  const scaledMinFont = text.minFontSize * scale;

  const fontSize = fitFontSize(
    ctx,
    name,
    text.fontFamily,
    text.fontWeight,
    scaledMaxFont,
    scaledMinFont,
    maxWidth
  );

  ctx.font = `${text.fontWeight} ${fontSize}px ${text.fontFamily}`;
  ctx.fillStyle = text.color;
  ctx.textAlign = text.align;
  ctx.textBaseline = "middle";

  // Set text direction for Arabic
  if (containsArabic(name)) {
    ctx.direction = "rtl";
  } else {
    ctx.direction = "ltr";
  }

  const posX = design.width * text.x * scale;
  const posY = design.height * text.y * scale;

  // Apply shadow if configured
  if (text.shadow) {
    const shadow = parseShadow(text.shadow);
    ctx.shadowOffsetX = shadow.offsetX * scale;
    ctx.shadowOffsetY = shadow.offsetY * scale;
    ctx.shadowBlur = shadow.blur * scale;
    ctx.shadowColor = shadow.color;
  }

  ctx.fillText(name, posX, posY, maxWidth);

  // Reset shadow
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  return canvas;
}

/** Render and trigger a PNG download */
export async function downloadDesign(
  design: DesignConfig,
  name: string
): Promise<void> {
  const canvas = await renderDesign(design, name, 1);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to create blob"))),
      "image/png",
      1.0
    );
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = name.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").replace(/\s+/g, "-");
  link.download = `${design.id}-${safeName || "design"}.png`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
