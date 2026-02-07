/**
 * ControlPanel Component
 * 
 * Organiza todos los controles existentes en 4 secciones claras:
 * - Pattern Type
 * - Geometry (cellSize, gap)
 * - Style (strokeColor)
 * - Export (PNG size, buttons)
 * 
 * Props son callbacks, este componente es "presentational" y scanneable
 */

import React from 'react';
import type { PatternConfig } from '@/domain/pattern/PatternConfig';
import type { PatternType } from '@/domain/pattern/PatternType';

export interface ControlPanelProps {
  activeType: PatternType;
  config: PatternConfig;
  exportWidth: number;
  exportHeight: number;
  onTypeChange: (type: PatternType) => void;
  onCellSizeChange: (value: number) => void;
  onGapChange: (value: number) => void;
  onStrokeColorChange: (value: string) => void;
  onExportWidthChange: (value: number) => void;
  onExportHeightChange: (value: number) => void;
  onDownloadSVG: () => void;
  onDownloadPNG: () => void;
  isExporting?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  activeType,
  config,
  exportWidth,
  exportHeight,
  onTypeChange,
  onCellSizeChange,
  onGapChange,
  onStrokeColorChange,
  onExportWidthChange,
  onExportHeightChange,
  onDownloadSVG,
  onDownloadPNG,
  isExporting = false,
}) => {
  return (
    <div className="control-panel">
      {/* SECTION: Pattern */}
      <section className="control-section">
        <h3 className="section-title">Pattern</h3>
        <div className="control-group">
          <label htmlFor="pattern-select" className="control-label">
            Type
          </label>
          <select
            id="pattern-select"
            value={activeType}
            onChange={(e) => onTypeChange(e.target.value as PatternType)}
            className="control-input select-input"
          >
            <option value="grid">Grid</option>
            <option value="dots">Dots (WIP)</option>
            <option value="waves">Waves (WIP)</option>
            <option value="noise">Noise (WIP)</option>
          </select>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: Geometry */}
      <section className="control-section">
        <h3 className="section-title">Geometry</h3>

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="size-slider" className="control-label">
              Cell Size
            </label>
            <span className="control-value">{config.cellSize ?? 20}px</span>
          </div>
          <input
            id="size-slider"
            type="range"
            min="5"
            max="100"
            step="1"
            value={config.cellSize ?? 20}
            onChange={(e) => onCellSizeChange(parseInt(e.target.value, 10))}
            className="control-input slider-input"
          />
        </div>

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="gap-slider" className="control-label">
              Gap
            </label>
            <span className="control-value">{config.gap ?? 0}px</span>
          </div>
          <input
            id="gap-slider"
            type="range"
            min="0"
            max="50"
            step="1"
            value={config.gap ?? 0}
            onChange={(e) => onGapChange(parseInt(e.target.value, 10))}
            className="control-input slider-input"
          />
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: Style */}
      <section className="control-section">
        <h3 className="section-title">Style</h3>

        <div className="control-group">
          <label htmlFor="color-picker" className="control-label">
            Stroke Color
          </label>
          <div className="color-picker-wrapper">
            <input
              id="color-picker"
              type="color"
              value={config.strokeColor ?? '#000000'}
              onChange={(e) => onStrokeColorChange(e.target.value)}
              className="control-input color-input"
            />
            <span className="color-value">{config.strokeColor ?? '#000000'}</span>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: Export */}
      <section className="control-section">
        <h3 className="section-title">Export</h3>

        <div className="control-group">
          <label htmlFor="export-dimensions" className="control-label">
            PNG Size (px)
          </label>
          <div className="export-dimensions-wrapper">
            <input
              id="export-width"
              type="number"
              value={exportWidth}
              onChange={(e) => onExportWidthChange(parseInt(e.target.value, 10))}
              className="control-input number-input"
              aria-label="Export Width"
            />
            <span className="dimension-separator">×</span>
            <input
              id="export-height"
              type="number"
              value={exportHeight}
              onChange={(e) => onExportHeightChange(parseInt(e.target.value, 10))}
              className="control-input number-input"
              aria-label="Export Height"
            />
          </div>
        </div>

        <div className="button-group">
          <button
            onClick={onDownloadSVG}
            disabled={isExporting}
            className="btn btn-primary"
            title="Download pattern as SVG"
          >
            {isExporting ? '⏳ Exporting...' : '↓ Export SVG'}
          </button>
          <button
            onClick={onDownloadPNG}
            disabled={isExporting}
            className="btn btn-secondary"
            title="Download pattern as PNG"
          >
            {isExporting ? '⏳ Exporting...' : '↓ Export PNG'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ControlPanel;
