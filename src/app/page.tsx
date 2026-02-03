'use client';

import React, { useState } from 'react';
import PatternCanvas from '@/components/PatternCanvas';
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
  // Encode SVG string to base64 to avoid parsing issues
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Fill white background (optional, but good for PNGs)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Draw SVG image
    // Note: To support high-res scaling, we need to ensure the SVG renders at the target frequency
    // For simple patterns, drawing the image stretched works if the SVG is vector commands.
    // However, if the SVG has fixed width/height attributes, it might scale.
    // Ideally, we'd inject the width/height into the SVG string before blob creation, 
    // but drawing to larger canvas usually works for SVG sources.
    ctx.drawImage(img, 0, 0, width, height);

    // Export to PNG
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
 * MVP Entry Point (Stateful with interactivity)
 */
export default function Home() {
  const [activeType, setActiveType] = useState<PatternType>('grid');
  const [config, setConfig] = useState<PatternConfig>(defaultPatternConfig);

  // Export Resolution State
  const [exportWidth, setExportWidth] = useState<number>(2000);
  const [exportHeight, setExportHeight] = useState<number>(2000);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveType(e.target.value as PatternType);
  };

  const handleNumberChange = (key: keyof PatternConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setConfig((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleStringChange = (key: keyof PatternConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // Export Resolution Handlers
  const handleExportWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExportWidth(parseInt(e.target.value, 10));
  };

  const handleExportHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExportHeight(parseInt(e.target.value, 10));
  };

  const generateCurrentSVG = () => {
    return generatePatternSVG({
      type: activeType,
      config: config,
      renderOptions: initialPatternState.renderOptions
    });
  };

  const handleDownloadSVG = () => {
    try {
      const svg = generateCurrentSVG();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      downloadSVG(svg, `pattern-${activeType}-${timestamp}.svg`);
    } catch (error) {
      console.error('Export SVG failed:', error);
    }
  };

  const handleDownloadPNG = () => {
    try {
      const svg = generateCurrentSVG();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      // Use configured export dimensions
      downloadPNG(svg, exportWidth, exportHeight, `pattern-${activeType}-${timestamp}.png`);
    } catch (error) {
      console.error('Export PNG failed:', error);
    }
  };

  return (
    <main style={{
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Patternation MVP
        </h1>
        <p style={{ color: '#666' }}>Core Logic + SVG Renderer + React</p>
      </div>

      <aside
        aria-label="Pattern Configuration Controls"
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          border: '1px solid #ddd'
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="pattern-select" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Pattern Type:</label>
          <select
            id="pattern-select"
            value={activeType}
            onChange={handleTypeChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="grid">Grid</option>
            <option value="dots">Dots (WIP)</option>
            <option value="waves">Waves (WIP)</option>
            <option value="noise">Noise (WIP)</option>
          </select>
        </section>

        <div role="separator" style={{ width: '1px', height: '40px', background: '#ccc' }}></div>

        <fieldset style={{
          border: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          gap: '20px'
        }}>
          <legend style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Pattern Dimensions</legend>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="size-slider" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Cell Size: {config.cellSize}px
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem' }} aria-hidden="true">5</span>
              <input
                id="size-slider"
                type="range"
                min="5"
                max="100"
                step="1"
                value={config.cellSize ?? 20}
                onChange={handleNumberChange('cellSize')}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label htmlFor="gap-slider" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Gap: {config.gap}px
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem' }} aria-hidden="true">0</span>
              <input
                id="gap-slider"
                type="range"
                min="0"
                max="50"
                step="1"
                value={config.gap ?? 0}
                onChange={handleNumberChange('gap')}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        </fieldset>

        <div role="separator" style={{ width: '1px', height: '40px', background: '#ccc' }}></div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label htmlFor="color-picker" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Stroke Color
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              id="color-picker"
              type="color"
              value={config.strokeColor ?? '#000000'}
              onChange={handleStringChange('strokeColor')}
              style={{ cursor: 'pointer', height: '30px', width: '50px', padding: 0, border: 'none' }}
            />
          </div>
        </section>

        <div role="separator" style={{ width: '1px', height: '40px', background: '#ccc' }}></div>

        {/* Export Resolution */}
        <fieldset style={{
          border: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}>
          <legend style={{ fontSize: '0.9rem', fontWeight: 600 }}>PNG Size (px)</legend>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input
              type="number"
              value={exportWidth}
              onChange={handleExportWidthChange}
              placeholder="W"
              style={{ width: '60px', padding: '5px' }}
              aria-label="Export Width"
            />
            <span style={{ alignSelf: 'center' }}>x</span>
            <input
              type="number"
              value={exportHeight}
              onChange={handleExportHeightChange}
              placeholder="H"
              style={{ width: '60px', padding: '5px' }}
              aria-label="Export Height"
            />
          </div>
        </fieldset>

        <div role="separator" style={{ width: '1px', height: '40px', background: '#ccc' }}></div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleDownloadSVG}
            style={{
              padding: '6px 12px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              width: '100%'
            }}
          >
            Export SVG
          </button>
          <button
            onClick={handleDownloadPNG}
            style={{
              padding: '6px 12px',
              background: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              width: '100%'
            }}
          >
            Export PNG
          </button>
        </section>
      </aside>

      <section
        aria-label="Pattern Preview"
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <PatternCanvas
          type={activeType}
          config={config}
          renderOptions={initialPatternState.renderOptions}
          className="pattern-preview"
        />
      </section>
    </main>
  );
}
