/**
 * Domain exports - Pattern module
 * 
 * Exporta interfaces y tipos para trabajar con patrones
 * Separado en dos grupos: Compatibilidad (v1) y Nueva arquitectura (v2)
 */

// ===== COMPATIBILIDAD V1 =====
export type { PatternType } from './PatternType';
export type { PatternConfig } from './PatternConfig';
export type { PatternOutput, PatternElement } from './PatternOutput';
export type { Pattern } from './Pattern';
export { generatePatternId, createPattern } from './Pattern';
export { generateGridPattern } from './generators';

// ===== NUEVA ARQUITECTURA V2 =====
// Interfaces de configuración (separadas por concernos)
export type { GeometryConfig } from './GeometryConfig';
export type { StyleConfig } from './StyleConfig';
export type { ExportConfig } from './ExportConfig';

// Interfaces de generador
export type {
    PatternGenerator,
    PatternGeneratorConfig,
    PatternGeneratorRegistry,
} from './PatternGeneratorTypes';

// Estado serializable
export type { PatternState } from './PatternState';
export { createPatternState, mergePatternConfig } from './PatternState';
