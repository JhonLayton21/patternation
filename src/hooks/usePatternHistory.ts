'use client';

/**
 * PHASE 7: usePatternHistory Hook
 * 
 * Simple undo/redo stack for pattern state
 * Tracks all state changes (pattern, geometry, style)
 */

import { useState, useCallback } from 'react';
import type { FullPatternState } from '../domain/share/urlStateCodec';

export interface HistoryItem {
  state: FullPatternState;
  timestamp: number;
  description: string;
}

export interface UsePatternHistoryResult {
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  undo: () => void;
  redo: () => void;
  pushState: (state: FullPatternState, description?: string) => void;
  clearHistory: () => void;
}

const MAX_HISTORY = 20;

/**
 * Hook for undo/redo functionality
 * 
 * @param initialState Initial pattern state
 * @param onStateChange Callback when state changes via undo/redo
 * @returns History controls and state info
 */
export function usePatternHistory(
  initialState: FullPatternState,
  onStateChange: (state: FullPatternState) => void
): UsePatternHistoryResult {
  const [past, setPast] = useState<HistoryItem[]>([
    {
      state: initialState,
      timestamp: Date.now(),
      description: 'Initial state',
    },
  ]);

  const [future, setFuture] = useState<HistoryItem[]>([]);

  const pushState = useCallback(
    (newState: FullPatternState, description?: string) => {
      // Don't track if nothing changed
      const currentState = past[past.length - 1].state;
      if (
        JSON.stringify(currentState.geometry) === JSON.stringify(newState.geometry) &&
        JSON.stringify(currentState.style) === JSON.stringify(newState.style) &&
        currentState.patternType === newState.patternType
      ) {
        return;
      }

      // Add to past, clear future
      const newPast = [
        ...past,
        {
          state: newState,
          timestamp: Date.now(),
          description: description || 'Modified pattern',
        },
      ];

      // Limit history size
      if (newPast.length > MAX_HISTORY) {
        newPast.shift();
      }

      setPast(newPast);
      setFuture([]);
    },
    [past]
  );

  const undo = useCallback(() => {
    if (past.length <= 1) return;

    const newPast = past.slice(0, -1);
    const undoItem = past[past.length - 1];

    setPast(newPast);
    setFuture([undoItem, ...future]);
    onStateChange(newPast[newPast.length - 1].state);
  }, [past, future, onStateChange]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const redoItem = future[0];
    const newFuture = future.slice(1);

    setPast([...past, redoItem]);
    setFuture(newFuture);
    onStateChange(redoItem.state);
  }, [past, future, onStateChange]);

  const clearHistory = useCallback(() => {
    const currentState = past[past.length - 1].state;
    setPast([
      {
        state: currentState,
        timestamp: Date.now(),
        description: 'History cleared',
      },
    ]);
    setFuture([]);
  }, [past]);

  return {
    canUndo: past.length > 1,
    canRedo: future.length > 0,
    historyLength: past.length,
    undo,
    redo,
    pushState,
    clearHistory,
  };
}
