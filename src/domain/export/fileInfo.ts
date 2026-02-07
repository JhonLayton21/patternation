/**
 * PHASE 6: File Information Utilities
 * 
 * Calculate and format file info for export display
 */

import { getSVGFileSize } from './svgExporter';
import { estimatePNGFileSize } from './pngExporter';

export interface ExportFileInfo {
  dimensions: {
    width: number;
    height: number;
  };
  svgSize: number;
  pngSize1x: number;
  pngSize2x: number;
  pngSize3x: number;
}

/**
 * Calculate file sizes and info for export
 */
export function calculateExportInfo(
  svgString: string,
  width: number,
  height: number
): ExportFileInfo {
  return {
    dimensions: { width, height },
    svgSize: getSVGFileSize(svgString),
    pngSize1x: estimatePNGFileSize(width, height),
    pngSize2x: estimatePNGFileSize(width * 2, height * 2),
    pngSize3x: estimatePNGFileSize(width * 3, height * 3)
  };
}

/**
 * Format bytes to human-readable size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, exponent);

  return `${size.toFixed(2)} ${units[exponent]}`;
}

/**
 * Format dimensions as string
 */
export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} px`;
}
