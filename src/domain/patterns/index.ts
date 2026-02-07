/**
 * Registro centralizado de todos los generadores de patrones
 * 
 * Sistema extensible:
 * 1. Cada patrón es un módulo independiente (grid.ts, dots.ts, etc)
 * 2. Se importan y registran aquí
 * 3. El orquestador consulta este registry
 * 4. Agregar un nuevo patrón = crear archivo + registrar aquí
 * 
 * PHASE 3: Multiple Pattern Types implementados
 */

import { gridPatternGenerator } from './grid';
import { dotsPatternGenerator } from './dots';
import { diagonalGridPatternGenerator } from './diagonalGrid';
import { isometricPatternGenerator } from './isometric';
import { zigzagPatternGenerator } from './zigzag';
import { wavesPatternGenerator } from './waves';
import { crossPatternGenerator } from './cross';
import type { PatternGenerator, PatternGeneratorRegistry } from '../pattern/PatternGeneratorTypes';

/**
 * Inicializa el registry con todos los generadores disponibles
 * 
 * PHASE 3 incluye:
 * - grid: Rejilla clásica
 * - dots: Puntos en grid
 * - diagonalGrid: Líneas diagonales
 * - isometric: Rejilla isométrica
 * - zigzag: Patrón zigzag
 * - waves: Ondas suaves
 * - cross: Graph paper con cruces
 */
export function initializePatternRegistry(): PatternGeneratorRegistry {
    const registry: PatternGeneratorRegistry = new Map();

    // Registrar todos los generadores disponibles
    registerGenerator(registry, gridPatternGenerator);
    registerGenerator(registry, dotsPatternGenerator);
    registerGenerator(registry, diagonalGridPatternGenerator);
    registerGenerator(registry, isometricPatternGenerator);
    registerGenerator(registry, zigzagPatternGenerator);
    registerGenerator(registry, wavesPatternGenerator);
    registerGenerator(registry, crossPatternGenerator);

    return registry;
}

/**
 * Helper para registrar un generador en el registry
 * @param registry - El registry actual
 * @param generator - El generador a registrar
 * @throws Error si el tipo ya está registrado
 */
function registerGenerator(
    registry: PatternGeneratorRegistry,
    generator: PatternGenerator
): void {
    if (registry.has(generator.type)) {
        throw new Error(
            `Pattern type "${generator.type}" is already registered. ` +
            `Each pattern type must have a unique identifier.`
        );
    }
    registry.set(generator.type, generator);
}

/**
 * Obtiene un generador del registry
 * @param registry - El registry
 * @param type - Tipo de patrón
 * @returns El generador para ese tipo
 * @throws Error si el tipo no está registrado
 */
export function getPatternGenerator(
    registry: PatternGeneratorRegistry,
    type: string
): PatternGenerator {
    const generator = registry.get(type);
    if (!generator) {
        const available = Array.from(registry.keys()).join(', ');
        throw new Error(
            `Pattern type "${type}" is not registered. Available types: ${available}`
        );
    }
    return generator;
}

// Exportar tipos para uso en otros módulos
export type { PatternGenerator, PatternGeneratorRegistry } from '../pattern/PatternGeneratorTypes';
export { gridPatternGenerator };
