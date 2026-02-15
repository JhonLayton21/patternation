'use client';

/**
 * PHASE 7: HistoryPanel Component
 * 
 * Undo/Redo controls
 */

import type { UsePatternHistoryResult } from '../hooks/usePatternHistory';
import { Button } from './ui/button';
import { Undo2, Redo2 } from 'lucide-react';

export interface HistoryPanelProps {
  history: UsePatternHistoryResult;
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  return (
    <div className="history-panel section">
      <h3 className="section-title">History</h3>

      <div className="history-controls">
        <Button
          onClick={history.undo}
          disabled={!history.canUndo}
          className="button button-secondary"
          title={`Undo (${history.historyLength} states)`}
        >
          <Undo2 className="h-4 w-4"/>
          Undo
        </Button>

        <Button
          onClick={history.redo}
          disabled={!history.canRedo}
          className="button button-secondary"
          title="Redo"
        >
          <Redo2 className="h-4 w-4"/>
          Redo
        </Button>

        <span className="history-length">
          {history.historyLength} state{history.historyLength !== 1 ? 's' : ''}
        </span>
      </div>

      <p className="history-help text-muted" style={{ fontSize: '0.85rem' }}>
        Undo/Redo tracks pattern, geometry, and style changes. Limited to last {20} changes.
      </p>
    </div>
  );
}
