/**
 * DEPRECATED - Grid Pattern Generator (V1 API)
 * 
 * Mantiene compatibilidad con código existente.
 * Internamente usa el nuevo sistema: /patterns/grid.ts
 * 
 * Migración:
 * - Nuevo código debe usar: import { gridPatternGenerator } from '../../patterns/grid'
 * - Este archivo se mantiene solo por compatibilidad con tests existentes
 */

import type { PatternConfig } from '../PatternConfig';
import type { PatternOutput } from '../PatternOutput';
import { gridPatternGenerator } from '../../patterns/grid';
import type { PatternGeneratorConfig } from '../PatternGeneratorTypes';

/**
 * Genera un patrón de grid (cuadrícula) basado en la configuración proporcionada
 * 
 * COMPATIBILIDAD V1: Esta función acepta PatternConfig antigua
 * Internamente usa el nuevo sistema basado en PatternGenerator
 * 
 * @deprecated Usar gridPatternGenerator.generate() directamente para nuevo código
 */
export function generateGridPattern(config: PatternConfig): PatternOutput {
    // Adaptar API antigua a nueva
    const generatorConfig: PatternGeneratorConfig = {
        geometry: {
            cellSize: config.cellSize,
            gap: config.gap,
            width: config.width,
            height: config.height,
        },
        style: {
            strokeColor: config.strokeColor,
            strokeWidth: config.strokeWidth,
        },
    };

    // Usar el nuevo generador
    return gridPatternGenerator.generate(generatorConfig);
}
