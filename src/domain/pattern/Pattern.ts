import type { PatternType } from './PatternType';
import type { PatternConfig } from './PatternConfig';

/**
 * Entidad principal que representa un patrón
 */
export interface Pattern {
    /**
     * Identificador único del patrón
     * Generado automáticamente
     */
    id: string;

    /**
     * Nombre descriptivo del patrón
     */
    name: string;

    /**
     * Tipo de patrón
     */
    type: PatternType;

    /**
     * Configuración del patrón
     */
    config: PatternConfig;
}

/**
 * Genera un ID único para un patrón
 * Implementación simple para el MVP
 */
export function generatePatternId(): string {
    return `pattern-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Crea una nueva instancia de Pattern con ID generado automáticamente
 */
export function createPattern(
    name: string,
    type: PatternType,
    config: PatternConfig = {}
): Pattern {
    return {
        id: generatePatternId(),
        name,
        type,
        config,
    };
}
