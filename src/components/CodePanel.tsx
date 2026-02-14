'use client';

/**
 * PHASE 7: CodePanel Component
 * 
 * Displays live SVG code from pattern
 * Allows copying to clipboard
 */

import { useState, useCallback, useMemo } from 'react';
import { useClipboard } from '../hooks/useClipboard';
import { generatePatternSVG } from '@/domain/core/patternOrchestrator';
import type { PatternType } from '@/domain/pattern/PatternType';
import type { PatternConfig } from '@/domain/pattern/PatternConfig';
import { Button } from '@/components/ui/button';
import { Code, Copy, Check, X } from 'lucide-react';

export interface CodePanelProps {
  patternType: PatternType;
  config: PatternConfig;
  width: number;
  height: number;
}

/**
 * Prettify SVG (format with indentation)
 */
function prettifySVG(svg: string): string {
  let formatted = svg;
  let indent = 0;

  formatted = formatted
    .replace(/><([^/])/g, '>\n<$1')
    .replace(/></g, '>\n<')
    .split('\n')
    .map((line) => {
      if (line.startsWith('</')) indent--;
      const result = '  '.repeat(Math.max(0, indent)) + line.trim();
      if (!line.startsWith('</') && !line.endsWith('/>') && !line.endsWith('</')) {
        indent++;
      }
      return result;
    })
    .join('\n')
    .trim();

  return formatted;
}

export function CodePanel({
  patternType,
  config,
  width,
  height,
}: CodePanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { copied, copy } = useClipboard();

  // Generate SVG code using the same method as page.tsx
  const svgCode = useMemo(() => {
    try {
      const innerSvg = generatePatternSVG({
        type: patternType,
        config: config,
        renderOptions: {} // Use defaults
      });
      return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${innerSvg}</svg>`;
    } catch (error) {
      console.error('Failed to generate SVG:', error);
      return '<!-- Error generating SVG -->';
    }
  }, [patternType, config, width, height]);

  const formattedCode = useMemo(() => {
    return prettifySVG(svgCode);
  }, [svgCode]);

  const handleCopy = useCallback(async () => {
    try {
      await copy(svgCode);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [svgCode, copy]);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="button button-secondary button-compact"
        title="Show SVG code"
      >
        <Code/> Code
      </Button>
    );
  }

  return (
    <div className="code-panel">
      <div className="code-panel-header">
        <h3 className="code-panel-title">Live SVG Code</h3>
        <div className="code-panel-actions">
          <Button
            onClick={handleCopy}
            className="button button-success"
            title="Copy to clipboard"
          >
            {copied ? (<> <Check className="h-4 w-4"/> 'Copied' </>) : (<> <Copy className="h-4 w-4"/> 'Copy' </>)}
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            className="button button-secondary button-compact"
            title="Hide code"
          >
            <X className="h-4 w-4"/>
          </Button>
        </div>
      </div>

      <div className="code-panel-content">
        <pre className="code-block">
          <code>{formattedCode}</code>
        </pre>
      </div>

      <p className="code-panel-help">
        This SVG is generated in real-time. Copy and paste into any vector editor or HTML.
      </p>
    </div>
  );
}
