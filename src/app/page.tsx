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

  return (
    <main style={{
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px'
    }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Patternation MVP
      </h1>

      {/* Pattern Selector */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <label htmlFor="pattern-select">Pattern Type:</label>
        <select
          id="pattern-select"
          value={activeType}
          onChange={handleTypeChange}
          style={{ padding: '5px' }}
        >
          <option value="grid">Grid (Implemented)</option>
          <option value="dots">Dots (Future)</option>
          <option value="waves">Waves (Future)</option>
          <option value="noise">Noise (Future)</option>
        </select>
      </div>

      <PatternCanvas
        type={activeType}
        config={config}
        renderOptions={initialPatternState.renderOptions}
        className="pattern-preview shadow-lg"
      />

      {activeType !== 'grid' && (
        <p style={{ color: 'red', fontSize: '0.8rem' }}>
          * This pattern generator is not implemented yet. Canvas will be empty.
        </p>
      )}
    </main>
  );
}
