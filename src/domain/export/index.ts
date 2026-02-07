/**
 * PHASE 6: Export Module
 * Public API for advanced export functionality
 */

export {
  generateSVGPattern,
  generateSVGCanvas,
  prettifySVG,
  minifySVG,
  getSVGFileSize,
  type SVGExportFormat
} from './svgExporter';

export {
  svgStringToCanvas,
  downloadCanvasAsPNG,
  exportPNGWithScale,
  estimatePNGFileSize,
  type PNGScale
} from './pngExporter';

export {
  calculateExportInfo,
  formatFileSize,
  formatDimensions,
  type ExportFileInfo
} from './fileInfo';
