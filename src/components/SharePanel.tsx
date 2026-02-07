'use client';

/**
 * PHASE 7: SharePanel Component
 * 
 * Share pattern via URL
 */

import { useState, useCallback } from 'react';
import { useClipboard } from '../hooks/useClipboard';
import type { UseShareURLResult } from '../hooks/useShareURL';

export interface SharePanelProps {
  share: UseShareURLResult;
}

export function SharePanel({ share }: SharePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { copied, copy } = useClipboard();

  const handleCopyShare = useCallback(async () => {
    try {
      await share.copyShareURL();
      await copy('');  // Trigger copy feedback from useClipboard
    } catch (err) {
      console.error('Failed to copy share URL:', err);
    }
  }, [share, copy]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="button button-secondary button-compact"
        title="Share pattern"
      >
        🔗 Share
      </button>
    );
  }

  const shareURL = share.getShareURL();

  return (
    <div className="share-panel section">
      <div className="share-panel-header">
        <h3 className="section-title">Share Pattern</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="button button-secondary button-compact"
          title="Close"
        >
          ✕
        </button>
      </div>

      <div className="share-url-container">
        <input
          type="text"
          value={shareURL}
          readOnly
          className="share-url-input"
          title="Shareable URL"
        />
        <button
          onClick={handleCopyShare}
          className="button button-success"
          title="Copy URL to clipboard"
        >
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>

      <p className="share-help text-muted" style={{ fontSize: '0.85rem' }}>
        Share this URL to let others view the exact same pattern. 
        All settings are encoded in the link.
      </p>
    </div>
  );
}
