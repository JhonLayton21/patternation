/**
 * PHASE 7: URL State Codec
 * 
 * Encode/Decode PatternState to/from URL query parameters
 * Allows sharing patterns via URL
 */

import type { PatternType } from '../pattern/PatternType';

/**
 * Full Pattern State (used by PHASE 7 features)
 * This is the complete state structure used during page execution
 */
export interface FullPatternState {
  patternType: PatternType;
  geometry: {
    cellSize: number;
    gap: number;
    width: number;
    height: number;
  };
  style: {
    strokeColor: string;
    strokeWidth: number;
    strokeOpacity: number;
    lineCap: 'butt' | 'round' | 'square';
    strokeDasharray: number[];
    backgroundColor?: string;
    backgroundOpacity: number;
  };
  zoom: number;
  checkerboard: boolean;
}

export interface URLStateParams {
  v?: string;
  pattern?: PatternType;
  cellSize?: number;
  gap?: number;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  lineCap?: string;
  strokeDasharray?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
  zoom?: number;
  checkerboard?: string;
}

/**
 * Encode PatternState to URL query parameters
 */
export function encodePatternState(state: FullPatternState): URLStateParams {
  const params: URLStateParams = {
    v: '1',
  };

  if (state.patternType !== 'grid') {
    params.pattern = state.patternType;
  }

  if (state.geometry.cellSize !== 20) params.cellSize = state.geometry.cellSize;
  if (state.geometry.gap !== 0) params.gap = state.geometry.gap;
  if (state.geometry.width !== 800) params.width = state.geometry.width;
  if (state.geometry.height !== 600) params.height = state.geometry.height;

  if (state.style.strokeColor !== '#000000') params.strokeColor = state.style.strokeColor;
  if (state.style.strokeWidth !== 1) params.strokeWidth = state.style.strokeWidth;
  if (state.style.strokeOpacity !== 1) params.strokeOpacity = state.style.strokeOpacity;
  if (state.style.lineCap !== 'butt') params.lineCap = state.style.lineCap;
  if (state.style.strokeDasharray && state.style.strokeDasharray.length > 0) {
    params.strokeDasharray = JSON.stringify(state.style.strokeDasharray);
  }
  if (state.style.backgroundColor) params.backgroundColor = state.style.backgroundColor;
  if (state.style.backgroundOpacity !== 1) params.backgroundOpacity = state.style.backgroundOpacity;

  if (state.zoom !== 1) params.zoom = state.zoom;
  if (state.checkerboard !== false) params.checkerboard = 'true';

  return params;
}

/**
 * Decode URL query parameters to PatternState
 */
export function decodePatternState(params: URLSearchParams): FullPatternState | null {
  try {
    const version = params.get('v') || '1';
    
    if (version !== '1') {
      console.warn(`Unknown URL state version: ${version}`);
      return null;
    }

    const patternType = (params.get('pattern') as PatternType) || 'grid';
    
    const validPatterns = ['grid', 'dots', 'diagonalGrid', 'isometric', 'zigzag', 'waves', 'cross'];
    if (!validPatterns.includes(patternType)) {
      console.warn(`Invalid pattern type: ${patternType}`);
      return null;
    }

    const cellSize = parseFloat(params.get('cellSize') || '20');
    const gap = parseFloat(params.get('gap') || '0');
    const width = parseInt(params.get('width') || '800', 10);
    const height = parseInt(params.get('height') || '600', 10);

    if (cellSize < 5 || cellSize > 100) return null;
    if (gap < 0 || gap > 50) return null;
    if (width < 200 || width > 5000) return null;
    if (height < 200 || height > 5000) return null;

    const strokeColor = params.get('strokeColor') || '#000000';
    const strokeWidth = parseFloat(params.get('strokeWidth') || '1');
    const strokeOpacity = parseFloat(params.get('strokeOpacity') || '1');
    const lineCap = params.get('lineCap') || 'butt';
    
    let strokeDasharray: number[] = [];
    const dashParam = params.get('strokeDasharray');
    if (dashParam) {
      try {
        strokeDasharray = JSON.parse(dashParam);
        if (!Array.isArray(strokeDasharray)) strokeDasharray = [];
      } catch {
        strokeDasharray = [];
      }
    }

    const backgroundColor = params.get('backgroundColor') || undefined;
    const backgroundOpacity = parseFloat(params.get('backgroundOpacity') || '1');

    if (strokeWidth < 0.5 || strokeWidth > 10) return null;
    if (strokeOpacity < 0 || strokeOpacity > 1) return null;
    if (backgroundOpacity < 0 || backgroundOpacity > 1) return null;
    if (!['butt', 'round', 'square'].includes(lineCap)) return null;

    const zoom = parseFloat(params.get('zoom') || '1');
    const checkerboard = params.get('checkerboard') === 'true';

    if (zoom < 0.25 || zoom > 4) return null;

    return {
      patternType,
      geometry: {
        cellSize,
        gap,
        width,
        height,
      },
      style: {
        strokeColor,
        strokeWidth,
        strokeOpacity,
        lineCap: lineCap as 'butt' | 'round' | 'square',
        strokeDasharray,
        backgroundColor,
        backgroundOpacity,
      },
      zoom,
      checkerboard,
    };
  } catch (error) {
    console.error('Failed to decode URL state:', error);
    return null;
  }
}

/**
 * Generate shareable URL with encoded state
 */
export function generateShareURL(state: FullPatternState, baseURL?: string): string {
  const base = baseURL || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = encodePatternState(state);
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${base}/?${queryString}` : base + '/';
}

/**
 * Extract state from current URL
 */
export function getStateFromURL(): FullPatternState | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  return decodePatternState(params);
}
