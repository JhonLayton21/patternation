'use client';

/**
 * PHASE 6: useClipboard Hook
 * 
 * Copy text to clipboard with visual feedback
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseClipboardResult {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for copy-to-clipboard functionality
 * 
 * @param resetDelay - Time in ms before resetting copied state
 * @returns copied state and copy function
 */
export function useClipboard(resetDelay: number = 2000): UseClipboardResult {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copy = useCallback(async (text: string) => {
    try {
      // Try modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        // Reset after delay
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setCopied(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [resetDelay]);

  const reset = useCallback(() => {
    setCopied(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy, reset };
}
