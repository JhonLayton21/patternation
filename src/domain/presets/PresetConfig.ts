/**
 * PHASE 4: Presets System
 * 
 * Estructura serializable para guardar/cargar configuraciones completas
 * de patrones con persistencia en localStorage
 */

import type { PatternType } from '../pattern/PatternType';

/**
 * Estado completo de un patrón (serializable)
 * Reflection de lo que se mantiene en page.tsx
 */
export interface PatternState {
  // Geometry
  patternType: PatternType;
  cellSize: number;
  gap: number;
  
  // Style
  strokeColor: string;
  strokeWidth: number;
  strokeOpacity: number;
  lineCap: 'butt' | 'round' | 'square';
  strokeDasharray: 'solid' | 'dashed' | 'dotted';
  backgroundColor: string;
}

/**
 * Preset: Configuración named + versionada
 * 
 * Permite:
 * - Guardar estado completo
 * - Cargar en un click
 * - Persistencia en localStorage
 */
export interface PresetConfig {
  id: string;              // UUID para identificar único
  name: string;            // Nombre mostrado al usuario
  description?: string;    // Descripción opcional
  version: number;         // Version (future-proofing)
  predefined: boolean;     // true = built-in, false = user-created
  config: PatternState;
  createdAt?: number;      // timestamp para custom presets
}

/**
 * Estructura de almacenamiento en localStorage
 * key: "patternation_presets"
 */
export interface PresetStore {
  version: number;
  presets: PresetConfig[];
}
