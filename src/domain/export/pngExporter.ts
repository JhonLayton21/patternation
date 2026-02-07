/**
 * PHASE 6: PNG Export Utilities
 * 
 * Export pattern as PNG with support for multiple scales
 * (@1x, @2x, @3x) and background color handling
 */

export type PNGScale = 1 | 2 | 3;

/**
 * Convert SVG string to PNG canvas
 * Respects background color (transparent or filled)
 */
export function svgStringToCanvas(
  svgString: string,
  width: number,
  height: number,
  backgroundColor?: string
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();

    // Handle background
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Transparent: canvas already transparent
      ctx.clearRect(0, 0, width, height);
    }

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG image'));
    };

    // Convert SVG to data URL
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.src = url;
  });
}

/**
 * Download PNG from canvas
 */
export function downloadCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

/**
 * Export PNG with specific scale
 * 
 * @param svgString - SVG to export
 * @param baseWidth - Base width in pixels
 * @param baseHeight - Base height in pixels
 * @param scale - Scale factor (1, 2, or 3)
 * @param backgroundColor - Optional background color
 * @param filename - Output filename
 */
export async function exportPNGWithScale(
  svgString: string,
  baseWidth: number,
  baseHeight: number,
  scale: PNGScale = 1,
  backgroundColor?: string,
  filename?: string
): Promise<void> {
  const scaledWidth = baseWidth * scale;
  const scaledHeight = baseHeight * scale;

  // Adjust SVG viewBox for scaling
  const scaledSVG = svgString.replace(
    /width="(\d+)" height="(\d+)"/,
    `width="${scaledWidth}" height="${scaledHeight}"`
  );

  const canvas = await svgStringToCanvas(
    scaledSVG,
    scaledWidth,
    scaledHeight,
    backgroundColor
  );

  const scaleLabel = scale === 1 ? '@1x' : `@${scale}x`;
  const defaultFilename = `pattern-${scaleLabel}.png`;

  downloadCanvasAsPNG(canvas, filename || defaultFilename);
}

/**
 * Get PNG file size estimate (rough)
 * Actual PNG size depends on compression
 */
export function estimatePNGFileSize(width: number, height: number): number {
  // Rough estimate: uncompressed pixel data is width * height * 4 bytes
  // PNG compression typically reduces this to 20-50% depending on content
  const uncompressed = width * height * 4;
  const compressed = Math.round(uncompressed * 0.35); // 35% of original
  return compressed;
}
