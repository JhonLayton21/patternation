'use client';

import React, { useState } from 'react';
import PatternCanvas from '@/components/PatternCanvas';
import ControlPanel from '@/components/ControlPanel';
import PreviewControls from '@/components/PreviewControls';
import { initialPatternState, defaultPatternConfig } from '@/domain';
import { generatePatternSVG } from '@/domain/core/patternOrchestrator';
import type { PatternConfig } from '@/domain/pattern/PatternConfig';
import type { PatternType } from '@/domain/pattern/PatternType';

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
          <h1 className="app-title">Patternation</h1>
          <p className="app-subtitle">Generador de patrones creativo</p>
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
