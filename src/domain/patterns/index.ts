/**
 * Registro centralizado de todos los generadores de patrones
 * 
 * Sistema extensible:
 * 1. Cada patrón es un módulo independiente (grid.ts, dots.ts, etc)
 * 2. Se importan y registran aquí
 * 3. El orquestador consulta este registry
 * 4. Agregar un nuevo patrón = crear archivo + registrar aquí
 * 
 * Ventajas:
 * - Escalabilidad clara (no toca el orquestador)
 * - Type-safety: PatternGenerator garantiza interfaz común
 * - Testing fácil para cada generador
 * - Separación de concernos (cada patrón es su propio módulo)
 */

import { gridPatternGenerator } from './grid';
import type { PatternGenerator, PatternGeneratorRegistry } from '../pattern/PatternGeneratorTypes';

/**
 * Inicializa el registry con todos los generadores disponibles
 * 
 * Placeholder para futuros patrones:
 * - dots: import { dotsPatternGenerator } from './dots'
 * - waves: import { wavesPatternGenerator } from './waves'
 * - isometric: import { isometricPatternGenerator } from './isometric'
 */
export function initializePatternRegistry(): PatternGeneratorRegistry {
    const registry: PatternGeneratorRegistry = new Map();

    // Registrar generadores disponibles
    registerGenerator(registry, gridPatternGenerator);

    // TODO: Registrar nuevos patrones aquí según se implemente FASE 3
    // registerGenerator(registry, dotsPatternGenerator);
    // registerGenerator(registry, wavesPatternGenerator);

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
