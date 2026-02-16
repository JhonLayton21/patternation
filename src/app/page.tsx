'use client';

import React, { useState, useEffect } from 'react';
import PatternCanvas from '@/components/PatternCanvas';
import ControlPanel from '@/components/ControlPanel';
import PreviewControls from '@/components/PreviewControls';
import { initialPatternState, defaultPatternConfig } from '@/domain';
import { generatePatternSVG } from '@/domain/core/patternOrchestrator';
import type { PatternConfig } from '@/domain/pattern/PatternConfig';
import type { PatternType } from '@/domain/pattern/PatternType';
import type { PatternState } from '@/domain/presets';
import { usePresetManager } from '@/hooks/usePresetManager';
import { usePatternHistory } from '@/hooks/usePatternHistory';
import { useShareURL } from '@/hooks/useShareURL';
import { generateRandomPatternState } from '@/domain/random';

/**
 * Utility to download string content as file (SVG)
 */
function downloadSVG(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Utility to convert SVG string to PNG and download
 * Uses browser Canvas API strictly in UI layer
 */
function downloadPNG(svgString: string, width: number, height: number, filename: string) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    alert('Canvas not supported in this browser');
    return;
  }

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(pngUrl);
      URL.revokeObjectURL(url);
    });
  };

  img.src = url;
}

/**
 * Main App - PHASE 1 UX/UI POLISH
 * Layout: 2-column (Controls left, Preview right)
 * Controls organized by sections
 * Preview as main focus
 */
export default function Home() {
  const [activeType, setActiveType] = useState<PatternType>('grid');
  const [config, setConfig] = useState<PatternConfig>(defaultPatternConfig);
  const [exportWidth, setExportWidth] = useState<number>(2000);
  const [exportHeight, setExportHeight] = useState<number>(2000);
  const [zoom, setZoom] = useState<number>(1);
  const [showCheckerboard, setShowCheckerboard] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // PHASE 4: Presets
  usePresetManager(); // Initialize preset manager (loads from localStorage)

  // PHASE 5: Random & Seed
  const [currentSeed, setCurrentSeed] = useState<string>('');

  /**
   * Build FULL current state for preset/random/history/share systems
   * Includes UI state (zoom, checkerboard) for URL sharing
   */
  const getCurrentFullState = (): PatternState => ({
    patternType: activeType,
    geometry: {
      cellSize: config.cellSize ?? 20,
      gap: config.gap ?? 0,
      width: exportWidth,
      height: exportHeight,
    },
    style: {
      strokeColor: config.strokeColor ?? '#000000',
      strokeWidth: config.strokeWidth ?? 1,
      strokeOpacity: config.strokeOpacity ?? 1,
      lineCap: config.lineCap ?? 'butt',
      strokeDasharray: config.strokeDasharray ?? [],
      backgroundColor: config.backgroundColor,
      backgroundOpacity: 1,
    },
    zoom,
    checkerboard: showCheckerboard,
  });

  /**
   * Build legacy state for presets (backward compatible)
   */
  const getCurrentState = (): PatternState => ({
    patternType: activeType,
    cellSize: config.cellSize ?? 20,
    gap: config.gap ?? 0,
    strokeColor: config.strokeColor ?? '#000000',
    strokeWidth: config.strokeWidth ?? 1,
    strokeOpacity: config.strokeOpacity ?? 1,
    lineCap: config.lineCap ?? 'butt',
    strokeDasharray: (config.strokeDasharray ? (Array.isArray(config.strokeDasharray) ? 'dashed' : config.strokeDasharray) : 'solid') as 'solid' | 'dashed' | 'dotted',
    backgroundColor: config.backgroundColor ?? '#ffffff'
  });

  // PHASE 7: History (Undo/Redo)
  const history = usePatternHistory(getCurrentFullState(), (state) => {
    // Apply state from history
    setActiveType(state.patternType);
    setConfig({
      cellSize: state.geometry.cellSize,
      gap: state.geometry.gap,
      strokeColor: state.style.strokeColor,
      strokeWidth: state.style.strokeWidth,
      strokeOpacity: state.style.strokeOpacity,
      lineCap: state.style.lineCap,
      strokeDasharray: state.style.strokeDasharray,
      backgroundColor: state.style.backgroundColor,
    });
    setExportWidth(state.geometry.width);
    setExportHeight(state.geometry.height);
    setZoom(state.zoom ?? 1);
    setShowCheckerboard(state.checkerboard ?? false);
  });

  // PHASE 7: Share (URL state)
  const share = useShareURL(getCurrentFullState(), (state) => {
    // Load state from URL on first mount
    setActiveType(state.patternType);
    setConfig({
      cellSize: state.geometry.cellSize,
      gap: state.geometry.gap,
      strokeColor: state.style.strokeColor,
      strokeWidth: state.style.strokeWidth,
      strokeOpacity: state.style.strokeOpacity,
      lineCap: state.style.lineCap,
      strokeDasharray: state.style.strokeDasharray,
      backgroundColor: state.style.backgroundColor,
    });
    setExportWidth(state.geometry.width);
    setExportHeight(state.geometry.height);
    setZoom(state.zoom ?? 1);
    setShowCheckerboard(state.checkerboard ?? false);
  });

  /**
   * Load a preset: apply all its values to the current state
   */
  const handleLoadPreset = (presetState: PatternState) => {
    setActiveType(presetState.patternType);
    
    // Convert strokeDasharray string back to array format if needed
    let dasharray: number[] | undefined;
    if (presetState.strokeDasharray === 'dashed') {
      dasharray = [5, 5];
    } else if (presetState.strokeDasharray === 'dotted') {
      dasharray = [2, 3];
    }

    setConfig({
      cellSize: presetState.cellSize,
      gap: presetState.gap,
      strokeColor: presetState.strokeColor,
      strokeWidth: presetState.strokeWidth,
      strokeOpacity: presetState.strokeOpacity,
      lineCap: presetState.lineCap,
      strokeDasharray: dasharray,
      backgroundColor: presetState.backgroundColor
    });
  };

  /**
   * Apply random pattern with seed
   */
  const handleRandomize = (randomState: PatternState, seed: string) => {
    setCurrentSeed(seed);
    setActiveType(randomState.patternType);

    // Convert strokeDasharray string back to array format if needed
    let dasharray: number[] | undefined;
    if (randomState.strokeDasharray === 'dashed') {
      dasharray = [5, 5];
    } else if (randomState.strokeDasharray === 'dotted') {
      dasharray = [2, 3];
    }

    setConfig({
      cellSize: randomState.cellSize,
      gap: randomState.gap,
      strokeColor: randomState.strokeColor,
      strokeWidth: randomState.strokeWidth,
      strokeOpacity: randomState.strokeOpacity,
      lineCap: randomState.lineCap,
      strokeDasharray: dasharray,
      backgroundColor: randomState.backgroundColor
    });
  };

  /**
   * Track state changes for history
   * Push to history when pattern/geometry/style changes
   */
  useEffect(() => {
    const newState = getCurrentFullState();
    // Use a small delay to batch rapid changes
    const timer = setTimeout(() => {
      history.pushState(newState, 'Pattern modified');
    }, 300);
    return () => clearTimeout(timer);
  }, [activeType, config, exportWidth, exportHeight]);

  const handleTypeChange = (type: PatternType) => {
    setActiveType(type);
  };

  const handleCellSizeChange = (value: number) => {
    setConfig((prev) => ({ ...prev, cellSize: value }));
  };

  const handleGapChange = (value: number) => {
    setConfig((prev) => ({ ...prev, gap: value }));
  };

  const handleStrokeColorChange = (value: string) => {
    setConfig((prev) => ({ ...prev, strokeColor: value }));
  };

  const handleStrokeWidthChange = (value: number) => {
    setConfig((prev) => ({ ...prev, strokeWidth: value }));
  };

  const handleStrokeOpacityChange = (value: number) => {
    setConfig((prev) => ({ ...prev, strokeOpacity: value }));
  };

  const handleLineCapChange = (value: 'butt' | 'round' | 'square') => {
    setConfig((prev) => ({ ...prev, lineCap: value }));
  };

  const handleDashPatternChange = (pattern: 'solid' | 'dashed' | 'dotted') => {
    let dasharray: number[] | undefined;
    if (pattern === 'dashed') {
      dasharray = [5, 5];
    } else if (pattern === 'dotted') {
      dasharray = [2, 3];
    }
    setConfig((prev) => ({ ...prev, strokeDasharray: dasharray }));
  };

  const handleBackgroundColorChange = (value: string | undefined) => {
    setConfig((prev) => ({ ...prev, backgroundColor: value }));
  };

  const handleExportWidthChange = (value: number) => {
    setExportWidth(value);
  };

  const handleExportHeightChange = (value: number) => {
    setExportHeight(value);
  };

  const generateCurrentSVG = () => {
    return generatePatternSVG({
      type: activeType,
      config: config,
      renderOptions: initialPatternState.renderOptions
    });
  };

  const handleDownloadSVG = async () => {
    try {
      setIsExporting(true);
      const svg = generateCurrentSVG();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadSVG(svg, `pattern-${activeType}-${timestamp}.svg`);
      
      // Feedback: Show brief success state
      setTimeout(() => setIsExporting(false), 500);
    } catch (error) {
      console.error('Export SVG failed:', error);
      setIsExporting(false);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      setIsExporting(true);
      const svg = generateCurrentSVG();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadPNG(svg, exportWidth, exportHeight, `pattern-${activeType}-${timestamp}.png`);
      
      // Feedback: Show brief success state
      setTimeout(() => setIsExporting(false), 500);
    } catch (error) {
      console.error('Export PNG failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <main className="app-main">
      {/* HEADER */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title text-4xl!">Patternation</h1>
          <p className="app-subtitle text-xl!">Generador de patrones creativo</p>
        </div>
      </header>

      {/* MAIN LAYOUT: 2 columns */}
      <div className="app-container">
        {/* LEFT COLUMN: Controls */}
        <aside className="controls-column">
          <ControlPanel
            activeType={activeType}
            config={config}
            exportWidth={exportWidth}
            exportHeight={exportHeight}
            onTypeChange={handleTypeChange}
            onCellSizeChange={handleCellSizeChange}
            onGapChange={handleGapChange}
            onStrokeColorChange={handleStrokeColorChange}
            onStrokeWidthChange={handleStrokeWidthChange}
            onStrokeOpacityChange={handleStrokeOpacityChange}
            onLineCapChange={handleLineCapChange}
            onDashPatternChange={handleDashPatternChange}
            onBackgroundColorChange={handleBackgroundColorChange}
            onExportWidthChange={handleExportWidthChange}
            onExportHeightChange={handleExportHeightChange}
            onDownloadSVG={handleDownloadSVG}
            onDownloadPNG={handleDownloadPNG}
            isExporting={isExporting}
            currentState={getCurrentState()}
            onLoadPreset={handleLoadPreset}
            onRandomize={handleRandomize}
            // PHASE 7: Advanced features
            history={history}
            share={share}
          />
        </aside>

        {/* RIGHT COLUMN: Preview */}
        <section className="preview-column">
          <div className="preview-container">
            <PreviewControls
              zoom={zoom}
              onZoomChange={setZoom}
              showCheckerboard={showCheckerboard}
              onCheckerboardToggle={() => setShowCheckerboard(!showCheckerboard)}
            />

            <div className="preview-viewport">
              <PatternCanvas
                type={activeType}
                config={config}
                renderOptions={initialPatternState.renderOptions}
                zoom={zoom}
                showCheckerboard={showCheckerboard}
                className="pattern-preview"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
