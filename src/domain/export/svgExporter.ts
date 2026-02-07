/**
 * PHASE 6: SVG Export Utilities
 * 
 * Genera SVG limpio y producción-ready en dos formatos:
 * 1. Como pattern reutilizable (<pattern> element)
 * 2. Como canvas completo (SVG plano con dimensiones explícitas)
 */

import type { PatternType } from '@/domain/pattern/PatternType';
import type { PatternConfig } from '@/domain/pattern/PatternConfig';
import { generatePatternSVG } from '@/domain/core/patternOrchestrator';
import { initialPatternState } from '@/domain/defaults';

export type SVGExportFormat = 'pattern' | 'canvas';

/**
 * Generate exportable SVG as reusable pattern
 * Output can be used as background in CSS or embedded in SVG
 */
export function generateSVGPattern(
  patternType: PatternType,
  config: PatternConfig,
  width: number = 1000,
  height: number = 1000
): string {
  const svg = generatePatternSVG({
    type: patternType,
    config: config,
    renderOptions: initialPatternState.renderOptions
  });

  // Parse the pattern out of the generated SVG
  // Wrap as reusable <pattern>
  const patternId = `pattern-${patternType}-${Date.now()}`;

  // Extract pattern elements from main SVG
  const canvas = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="${patternId}" patternUnits="userSpaceOnUse" width="${width}" height="${height}">
      ${svg}
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#${patternId})"/>
</svg>`;

  return canvas;
}

/**
 * Generate clean, flat SVG (canvas format)
 * Suitable for export, web use, design tools
 */
export function generateSVGCanvas(
  patternType: PatternType,
  config: PatternConfig,
  width: number = 1000,
  height: number = 1000
): string {
  const svg = generatePatternSVG({
    type: patternType,
    config: config,
    renderOptions: initialPatternState.renderOptions
  });

  // Return as clean canvas SVG
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${svg}
</svg>`;
}

/**
 * Pretty-print SVG with indentation for readability
 */
export function prettifySVG(svg: string): string {
  let indent = 0;
  const indentStr = '  ';

  return svg
    .replace(/></g, '>\n<')
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing tags
      if (trimmed.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }

      const result = indentStr.repeat(indent) + trimmed;

      // Increase indent for opening tags (not self-closing)
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
        indent++;
      }

      // Self-closing or closing tags reset indent
      if (trimmed.endsWith('/>') || trimmed.startsWith('</')) {
        indent = Math.max(0, indent - (trimmed.endsWith('/>') ? 1 : 0));
      }

      return result;
    })
    .filter((line) => line.trim())
    .join('\n');
}

/**
 * Minify SVG (remove whitespace)
 */
export function minifySVG(svg: string): string {
  return svg
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/>\s+</g, '><') // Remove spaces between tags
    .trim();
}

/**
 * Get SVG file size in bytes
 */
export function getSVGFileSize(svg: string): number {
  return new TextEncoder().encode(svg).length;
}
