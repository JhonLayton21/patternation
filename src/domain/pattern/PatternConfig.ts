/**
 * DEPRECATED: Usar PatternState en su lugar
 * 
 * PatternConfig se mantiene para compatibilidad hacia atrás
 * pero la nueva arquitectura usa PatternState que separa
 * geometry y style en interfaces específicas.
 * 
 * Migración:
 * - cellSize, gap, width, height → GeometryConfig
 * - stro keColor, strokeWidth → StyleConfig
 */

import type { GeometryConfig } from './GeometryConfig';
import type { StyleConfig } from './StyleConfig';

export interface PatternConfig extends GeometryConfig, StyleConfig {
    // Interfaz combinada para compatibilidad
    // Nuevos código debe usar GeometryConfig y StyleConfig directamente
}
