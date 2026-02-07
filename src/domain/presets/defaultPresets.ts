/**
 * PHASE 4: Presets Predefinidos
 * 
 * 4 templates listos para usar en segundos
 * - Notebook Grid
 * - Dot Journal
 * - Isometric Paper
 * - Minimal Grid
 */

import type { PresetConfig } from './PresetConfig';

/**
 * Notebook Grid
 * Clásico: grid de tamaño standard para cuadernos
 */
export const NOTEBOOK_GRID: PresetConfig = {
  id: 'preset-notebook-grid',
  name: 'Notebook Grid',
  description: 'Rejilla clásica de tamaño standard para cuadernos',
  version: 2,
  predefined: true,
  config: {
    patternType: 'grid',
    cellSize: 20,
    gap: 1,
    strokeColor: '#333333',
    strokeWidth: 1.5,
    strokeOpacity: 0.8,
    lineCap: 'butt',
    strokeDasharray: 'solid',
    backgroundColor: '#f5f5f0'
  }
};

/**
 * Dot Journal
 * Patrón de puntos para bullet journals y notas creativas
 */
export const DOT_JOURNAL: PresetConfig = {
  id: 'preset-dot-journal',
  name: 'Dot Journal',
  description: 'Puntos para bullet journals y notas creativas',
  version: 2,
  predefined: true,
  config: {
    patternType: 'dots',
    cellSize: 15,
    gap: 0,
    strokeColor: '#999999',
    strokeWidth: 1.5,
    strokeOpacity: 1,
    lineCap: 'round',
    strokeDasharray: 'solid',
    backgroundColor: '#ffffff'
  }
};

/**
 * Isometric Paper
 * Grid isométrico para dibujo técnico y 3D
 */
export const ISOMETRIC_PAPER: PresetConfig = {
  id: 'preset-isometric-paper',
  name: 'Isometric Paper',
  description: 'Grid isométrico para dibujo técnico y perspectiva',
  version: 2,
  predefined: true,
  config: {
    patternType: 'isometric',
    cellSize: 25,
    gap: 0,
    strokeColor: '#0099cc',
    strokeWidth: 1,
    strokeOpacity: 0.9,
    lineCap: 'butt',
    strokeDasharray: 'solid',
    backgroundColor: '#ffffff'
  }
};

/**
 * Minimal Grid
 * Minimalista: grid muy simple y sutil
 */
export const MINIMAL_GRID: PresetConfig = {
  id: 'preset-minimal-grid',
  name: 'Minimal Grid',
  description: 'Grid minimalista y sutil',
  version: 2,
  predefined: true,
  config: {
    patternType: 'grid',
    cellSize: 30,
    gap: 0,
    strokeColor: '#dddddd',
    strokeWidth: 0.5,
    strokeOpacity: 0.5,
    lineCap: 'butt',
    strokeDasharray: 'solid',
    backgroundColor: '#ffffff'
  }
};

/**
 * Array de todos los presets predefinidos en order
 */
export const DEFAULT_PRESETS: PresetConfig[] = [
  NOTEBOOK_GRID,
  DOT_JOURNAL,
  ISOMETRIC_PAPER,
  MINIMAL_GRID
];
