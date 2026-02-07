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
import type { PatternState } from '@/domain/presets';
import { PresetsPanel } from './PresetsPanel';
import { RandomizePanel } from './RandomizePanel';

export interface ControlPanelProps {
  activeType: PatternType;
  config: PatternConfig;
  exportWidth: number;
  exportHeight: number;
  onTypeChange: (type: PatternType) => void;
  onCellSizeChange: (value: number) => void;
  onGapChange: (value: number) => void;
  onStrokeColorChange: (value: string) => void;
  onStrokeWidthChange: (value: number) => void;
  onStrokeOpacityChange: (value: number) => void;
  onLineCapChange: (value: 'butt' | 'round' | 'square') => void;
  onDashPatternChange: (pattern: 'solid' | 'dashed' | 'dotted') => void;
  onBackgroundColorChange: (value: string | undefined) => void;
  onExportWidthChange: (value: number) => void;
  onExportHeightChange: (value: number) => void;
  onDownloadSVG: () => void;
  onDownloadPNG: () => void;
  isExporting?: boolean;
  currentState?: PatternState;
  onLoadPreset?: (state: PatternState) => void;
  onRandomize?: (state: PatternState, seed: string) => void;
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
  onStrokeWidthChange,
  onStrokeOpacityChange,
  onLineCapChange,
  onDashPatternChange,
  onBackgroundColorChange,
  onExportWidthChange,
  onExportHeightChange,
  onDownloadSVG,
  onDownloadPNG,
  isExporting = false,
  currentState,
  onLoadPreset,
  onRandomize,
}) => {
  return (
    <div className="control-panel">
      {/* SECTION: Presets */}
      {currentState && onLoadPreset && (
        <>
          <PresetsPanel
            currentState={currentState}
            onLoadPreset={onLoadPreset}
          />
          <div className="section-divider"></div>
        </>
      )}

      {/* SECTION: Randomize */}
      {currentState && onRandomize && (
        <>
          <RandomizePanel
            currentState={currentState}
            onRandomize={onRandomize}
          />
          <div className="section-divider"></div>
        </>
      )}

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
            <option value="dots">Dots</option>
            <option value="diagonalGrid">Diagonal Grid</option>
            <option value="isometric">Isometric</option>
            <option value="zigzag">Zig-zag</option>
            <option value="waves">Waves</option>
            <option value="cross">Cross</option>
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

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="stroke-width-slider" className="control-label">
              Stroke Width
            </label>
            <span className="control-value">{config.strokeWidth ?? 1}px</span>
          </div>
          <input
            id="stroke-width-slider"
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={config.strokeWidth ?? 1}
            onChange={(e) => onStrokeWidthChange(parseFloat(e.target.value))}
            className="control-input slider-input"
          />
        </div>

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="stroke-opacity-slider" className="control-label">
              Opacity
            </label>
            <span className="control-value">{Math.round((config.strokeOpacity ?? 1) * 100)}%</span>
          </div>
          <input
            id="stroke-opacity-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.strokeOpacity ?? 1}
            onChange={(e) => onStrokeOpacityChange(parseFloat(e.target.value))}
            className="control-input slider-input"
          />
        </div>

        <div className="control-group">
          <label htmlFor="line-cap-select" className="control-label">
            Line Cap
          </label>
          <select
            id="line-cap-select"
            value={config.lineCap ?? 'butt'}
            onChange={(e) => onLineCapChange(e.target.value as 'butt' | 'round' | 'square')}
            className="control-input select-input"
          >
            <option value="butt">Butt (Flat)</option>
            <option value="round">Round</option>
            <option value="square">Square</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="dash-pattern-select" className="control-label">
            Line Style
          </label>
          <select
            id="dash-pattern-select"
            value={(() => {
              if (!config.strokeDasharray) return 'solid';
              if (JSON.stringify(config.strokeDasharray) === JSON.stringify([5, 5])) return 'dashed';
              if (JSON.stringify(config.strokeDasharray) === JSON.stringify([2, 3])) return 'dotted';
              return 'solid';
            })()}
            onChange={(e) => {
              const val = e.target.value as 'solid' | 'dashed' | 'dotted';
              onDashPatternChange(val);
            }}
            className="control-input select-input"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="bg-color-picker" className="control-label">
            Background
          </label>
          <div className="color-picker-wrapper">
            <input
              id="bg-color-picker"
              type="color"
              value={config.backgroundColor ?? '#ffffff'}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="control-input color-input"
            />
            <button
              onClick={() => onBackgroundColorChange(undefined)}
              className="btn btn-small btn-secondary"
              title="Make background transparent"
            >
              × Transparent
            </button>
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
