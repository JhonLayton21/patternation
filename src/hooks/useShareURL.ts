'use client';

/**
 * PHASE 7: useShareURL Hook
 * 
 * Manages URL state synchronization
 * Encodes/decodes PatternState from URL
 */

import { useEffect, useCallback } from 'react';
import { generateShareURL, getStateFromURL } from '../domain/share/urlStateCodec';
import type { FullPatternState } from '../domain/share/urlStateCodec';

export interface UseShareURLResult {
  getShareURL: () => string;
  copyShareURL: () => Promise<void>;
  loadFromURL: () => FullPatternState | null;
}

/**
 * Hook for URL-based pattern sharing
 * 
 * @param state Current pattern state
 * @param onStateLoaded Callback when state is loaded from URL
 * @returns Share functions
 */
export function useShareURL(
  state: FullPatternState,
  onStateLoaded?: (state: FullPatternState) => void
): UseShareURLResult {
  // Load state from URL on mount
  useEffect(() => {
    const urlState = getStateFromURL();
    if (urlState && onStateLoaded) {
      onStateLoaded(urlState);
    }
  }, [onStateLoaded]);

  const getShareURL = useCallback(() => {
    return generateShareURL(state);
  }, [state]);

  const copyShareURL = useCallback(async () => {
    const url = getShareURL();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.error('Failed to copy URL:', err);
        throw err;
      }
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, [getShareURL]);

  const loadFromURL = useCallback(() => {
    return getStateFromURL();
  }, []);

  return {
    getShareURL,
    copyShareURL,
    loadFromURL,
  };
}
