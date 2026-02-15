'use client';

/**
 * PHASE 6: ExportPanel Component
 * 
 * Advanced export with multiple formats (SVG pattern/canvas, PNG @1x/@2x/@3x)
 * File info, clipboard copy, and visual feedback
 */

import React, { useState, useMemo } from 'react';
import { useClipboard } from '@/hooks/useClipboard';
import {
  generateSVGCanvas,
  generateSVGPattern,
  minifySVG,
  calculateExportInfo,
  formatFileSize,
  formatDimensions,
  exportPNGWithScale,
  type SVGExportFormat,
  type PNGScale
} from '@/domain/export';
import type { PatternType } from '@/domain/pattern/PatternType';
import type { PatternConfig } from '@/domain/pattern/PatternConfig';
import { Button } from '@/components/ui/button';
import { Copy, Download, Check, Loader } from 'lucide-react';

export interface ExportPanelProps {
  patternType: PatternType;
  config: PatternConfig;
  exportWidth: number;
  exportHeight: number;
  isExporting?: boolean;
  onExportStart?: () => void;
  onExportComplete?: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  patternType,
  config,
  exportWidth,
  exportHeight,
  isExporting = false,
  onExportStart,
  onExportComplete
}) => {
  const [svgFormat, setSvgFormat] = useState<SVGExportFormat>('canvas');
  const { copied, copy } = useClipboard(2000);

  // Generate SVG strings
  const svgCanvas = useMemo(
    () => generateSVGCanvas(patternType, config, exportWidth, exportHeight),
    [patternType, config, exportWidth, exportHeight]
  );

  const svgPattern = useMemo(
    () => generateSVGPattern(patternType, config, exportWidth, exportHeight),
    [patternType, config, exportWidth, exportHeight]
  );

  // Get SVG to show (based on format)
  const activeSVG = svgFormat === 'pattern' ? svgPattern : svgCanvas;
  const minifiedSVG = minifySVG(activeSVG);

  // Calculate file info
  const fileInfo = useMemo(
    () => calculateExportInfo(minifiedSVG, exportWidth, exportHeight),
    [minifiedSVG, exportWidth, exportHeight]
  );

  const handleDownloadSVG = async () => {
    onExportStart?.();
    try {
      const blob = new Blob([activeSVG], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pattern-${patternType}-${svgFormat}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => onExportComplete?.(), 300);
    }
  };

  const handleCopySVG = async () => {
    await copy(activeSVG);
  };

  const handleDownloadPNG = async (scale: PNGScale) => {
    onExportStart?.();
    try {
      await exportPNGWithScale(
        svgCanvas,
        exportWidth,
        exportHeight,
        scale,
        config.backgroundColor,
        `pattern-${patternType}@${scale}x.png`
      );
    } catch (error) {
      console.error('PNG export failed:', error);
    } finally {
      setTimeout(() => onExportComplete?.(), 300);
    }
  };

  return (
    <section className="control-section">
      <h3 className="section-title">Export</h3>

      {/* Dimensions and Format */}
      <div className="control-group">
        <label className="control-label">Dimensions</label>
        <div className="export-dimensions-display">
          <input
            type="number"
            value={exportWidth}
            className="control-input number-input"
            disabled
            aria-label="Export Width"
            style={{ flex: 1 }}
          />
          <span style={{ padding: '0.5rem', color: 'var(--color-text-secondary)' }}>×</span>
          <input
            type="number"
            value={exportHeight}
            className="control-input number-input"
            disabled
            aria-label="Export Height"
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
          {formatDimensions(exportWidth, exportHeight)}
        </div>
      </div>

      {/* File Info */}
      <div
        style={{
          padding: '0.75rem',
          backgroundColor: 'var(--color-bg-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          marginTop: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>SVG:</span>
          <span style={{ fontWeight: 600 }}>{formatFileSize(fileInfo.svgSize)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>PNG @1x:</span>
          <span style={{ fontWeight: 600 }}>{formatFileSize(fileInfo.pngSize1x)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>PNG @2x:</span>
          <span style={{ fontWeight: 600 }}>{formatFileSize(fileInfo.pngSize2x)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>PNG @3x:</span>
          <span style={{ fontWeight: 600 }}>{formatFileSize(fileInfo.pngSize3x)}</span>
        </div>
      </div>

      {/* SVG Export Options */}
      <div className="control-group" style={{ marginTop: '1rem' }}>
        <label htmlFor="svg-format-select" className="control-label">
          SVG Format
        </label>
        <select
          id="svg-format-select"
          value={svgFormat}
          onChange={(e) => setSvgFormat(e.target.value as SVGExportFormat)}
          className="control-input select-input"
        >
          <option value="canvas">Canvas (flat)</option>
          <option value="pattern">Pattern (reusable)</option>
        </select>
        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
          {svgFormat === 'canvas'
            ? 'Flat SVG, ready for web or design tools'
            : 'Reusable pattern element for backgrounds'}
        </div>
      </div>

      {/* SVG Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Button
          onClick={handleDownloadSVG}
          disabled={isExporting}
          className="button button-primary"
          style={{ flex: 1 }}
          title="Download SVG file"
        >
          {isExporting ? (<><Loader className="h-4 w-4"/>Exporting...</>) : (<><Download className="h-4 w-4"/>SVG</>)}
        </Button>
        <Button
          onClick={handleCopySVG}
          disabled={isExporting}
          className={`button ${copied ? 'button-success' : 'button-secondary'}`}
          style={{ flex: 1 }}
          title="Copy SVG to clipboard"
        >
          {copied ? (<><Check className="h-4 w-4"/>Copied</>) : (<><Copy className="h-4 w-4"/>Copy</>)}
        </Button>
      </div>

      {/* PNG Export Scales */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.5rem',
          marginTop: '1rem'
        }}
      >
        <Button
          onClick={() => handleDownloadPNG(1)}
          disabled={isExporting}
          className="button button-secondary"
          style={{ fontSize: '0.85rem' }}
          title="Download PNG @1x"
        >
          {isExporting ? (<><Loader className="h-4 w-4"/>Exporting...</>) : (<><Download className="h-4 w-4"/> @1x</>)}
        </Button>
        <Button
          onClick={() => handleDownloadPNG(2)}
          disabled={isExporting}
          className="button button-secondary"
          style={{ fontSize: '0.85rem' }}
          title="Download PNG @2x (Retina)"
        >
          {isExporting ? (<><Loader className="h-4 w-4"/>Exporting...</>) : (<><Download className="h-4 w-4"/> @2x</>)}
        </Button>
        <Button
          onClick={() => handleDownloadPNG(3)}
          disabled={isExporting}
          className="button button-secondary"
          style={{ fontSize: '0.85rem' }}
          title="Download PNG @3x (Ultra high-res)"
        >
          {isExporting ? (<><Loader className="h-4 w-4"/>Exporting...</>) : (<><Download className="h-4 w-4"/> @3x</>)}
        </Button>
      </div>

      {/* Help text */}
      <div style={{ fontSize: '0.75rem', marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Export tips:</strong>
        </p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
          <li>SVG: infinitely scalable, smallest file size</li>
          <li>PNG: raster, use for fixed sizes or web</li>
          <li>@2x/@3x: for high-DPI screens (Retina, modern phones)</li>
        </ul>
      </div>
    </section>
  );
};
