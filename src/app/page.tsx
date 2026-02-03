import React from 'react';
import PatternCanvas from '@/components/PatternCanvas';
import { initialPatternState } from '@/domain';

/**
 * MVP Entry Point
 * Renders the PatternCanvas with the default configuration.
 * Currently stateless (Phase 2.2).
 */
export default function Home() {
  return (
    <main style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <PatternCanvas
        type={initialPatternState.type}
        config={initialPatternState.config}
        renderOptions={initialPatternState.renderOptions}
        className="pattern-preview"
      />
    </main>
  );
}
