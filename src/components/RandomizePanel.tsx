'use client';

/**
 * PHASE 5: RandomizePanel Component
 * 
 * UI para exploración creativa:
 * - Botón Randomize
 * - Campo Seed editable
 * - Información sobre reproducibilidad
 */

import React, { useState } from 'react';
import { generateRandomPatternState, generateRandomSeed, isValidSeed } from '@/domain/random';
import type { PatternState } from '@/domain/presets';

export interface RandomizePanelProps {
  currentState: PatternState;
  onRandomize: (state: PatternState, seed: string) => void;
}

export const RandomizePanel: React.FC<RandomizePanelProps> = ({
  currentState,
  onRandomize
}) => {
  const [seed, setSeed] = useState<string>(generateRandomSeed());
  const [lastValidSeed, setLastValidSeed] = useState<string>(seed);

  const handleRandomize = () => {
    // Generate new seed if current is empty
    let newSeed = seed.trim();
    if (!newSeed) {
      newSeed = generateRandomSeed();
      setSeed(newSeed);
    }

    // Generate state from seed
    const randomState = generateRandomPatternState(newSeed);
    setLastValidSeed(newSeed);
    onRandomize(randomState, newSeed);
  };

  const handleSeedChange = (value: string) => {
    setSeed(value);
  };

  const handleGenerateNewSeed = () => {
    const newSeed = generateRandomSeed();
    setSeed(newSeed);
    const randomState = generateRandomPatternState(newSeed);
    setLastValidSeed(newSeed);
    onRandomize(randomState, newSeed);
  };

  const isSeedValid = isValidSeed(seed);

  return (
    <section className="control-section">
      <h3 className="section-title">Randomize</h3>

      {/* Seed Input */}
      <div className="control-group">
        <label htmlFor="seed-input" className="control-label">
          Seed
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            id="seed-input"
            type="text"
            placeholder="Enter seed for reproducibility..."
            value={seed}
            onChange={(e) => handleSeedChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isSeedValid) {
                handleRandomize();
              }
            }}
            className="control-input"
            style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}
          />
          <button
            onClick={handleGenerateNewSeed}
            className="button button-secondary"
            title="Generate random seed"
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            🎲 Seed
          </button>
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)',
            marginTop: '0.5rem'
          }}
        >
          Seed: <span style={{ fontFamily: 'monospace' }}>{lastValidSeed}</span>
        </div>
      </div>

      {/* Randomize Button */}
      <button
        onClick={handleRandomize}
        disabled={!isSeedValid}
        className="button button-primary"
        style={{
          width: '100%',
          marginTop: '0.5rem'
        }}
      >
        🎲 Randomize with Seed
      </button>

      {/* Help Text */}
      <div
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-text-secondary)',
          marginTop: '0.75rem',
          lineHeight: '1.4'
        }}
      >
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Reproducible exploration</strong>
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          • Same seed = same pattern  <br />
          • Leave empty for auto random  <br />
          • Works with all pattern types
        </p>
      </div>
    </section>
  );
};
