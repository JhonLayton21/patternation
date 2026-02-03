'use client';

import React, { useState } from 'react';
import PatternCanvas from '@/components/PatternCanvas';
import { initialPatternState, defaultPatternConfig } from '@/domain';
import type { PatternConfig } from '@/domain/pattern/PatternConfig';
import type { PatternType } from '@/domain/pattern/PatternType';

/**
 * MVP Entry Point (Stateful with interactivity)
 */
export default function Home() {
  const [activeType, setActiveType] = useState<PatternType>('grid');
  const [config, setConfig] = useState<PatternConfig>(defaultPatternConfig);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveType(e.target.value as PatternType);
  };

  // Generic handler for numeric inputs
  const handleNumberChange = (key: keyof PatternConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setConfig((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  // Generic handler for string inputs (color)
  const handleStringChange = (key: keyof PatternConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
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

      {/* Controls Section - Semantically grouped */}
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
        {/* Group 1: Pattern Selection */}
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

        {/* Group 2: Dimensions (Fieldset) */}
        <fieldset style={{
          border: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          gap: '20px'
        }}>
          <legend style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
            Pattern Dimensions
          </legend>

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

        {/* Group 3: Appearance */}
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
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
              {config.strokeColor}
            </span>
          </div>
        </section>
      </aside>

      {/* Preview Area */}
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

      {activeType !== 'grid' && (
        <div role="alert" style={{
          color: '#d32f2f',
          background: '#ffebee',
          padding: '10px 20px',
          borderRadius: '4px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⚠️</span>
          <span>Generator for "{activeType}" adds extra complexity and is not implemented in this MVP phase.</span>
        </div>
      )}
    </main>
  );
}
