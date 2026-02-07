/**
 * PreviewControls Component
 * 
 * Toolbar para controlar el preview:
 * - Zoom levels (50%, 100%, 200%)
 * - Checkerboard toggle (para ver transparencia)
 * 
 * Posicionado encima del preview, clean y minimalista
 */

import React from 'react';

export interface PreviewControlsProps {
  zoom: number; // 0.5, 1, 2, etc
  onZoomChange: (zoom: number) => void;
  showCheckerboard: boolean;
  onCheckerboardToggle: () => void;
}

const ZOOM_PRESETS = [
  { label: '50%', value: 0.5 },
  { label: '100%', value: 1 },
  { label: '200%', value: 2 },
];

export const PreviewControls: React.FC<PreviewControlsProps> = ({
  zoom,
  onZoomChange,
  showCheckerboard,
  onCheckerboardToggle,
}) => {
  return (
    <div className="preview-controls">
      <div className="preview-controls-group">
        <div className="zoom-controls">
          {ZOOM_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onZoomChange(preset.value)}
              className={`zoom-button ${zoom === preset.value ? 'active' : ''}`}
              title={`Zoom to ${preset.label}`}
              aria-pressed={zoom === preset.value}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="preview-controls-separator"></div>

        <button
          onClick={onCheckerboardToggle}
          className={`checkerboard-toggle ${showCheckerboard ? 'active' : ''}`}
          title={`Toggle checkerboard background`}
          aria-pressed={showCheckerboard}
        >
          <span className="checkerboard-icon">█</span>
          {showCheckerboard ? 'Checkerboard' : 'Solid'}
        </button>
      </div>
    </div>
  );
};

export default PreviewControls;
