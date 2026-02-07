/**
 * Tipos y interfaces base que todos los generadores de patrones deben cumplir
 * Esta es la interfaz principal de extensión para nuevos tipos de patrones
 */

import type { PatternOutput } from './PatternOutput';
import type { GeometryConfig } from './GeometryConfig';
import type { StyleConfig } from './StyleConfig';

/**
 * Configuración unificada para generar un patrón
 * Combina geometría y estilo en una sola interfaz que los generadores usan
 */
export interface PatternGeneratorConfig {
    /**
     * Configuración geométrica del patrón
     */
    geometry: GeometryConfig;

    /**
     * Configuración de estilo del patrón
     */
    style: StyleConfig;
}

/**
 * Interfaz que todos los generadores de patrones deben implementar
 * 
 * Esto permite:
 * - Type-safe pattern generation
 * - Inversión de control en el orquestador
 * - Facilitar testing unitario de cada patrón
 * - Escalabilidad sin cambios arquitectónicos
 * 
 * @example
 * ```typescript
 * const gridGenerator: PatternGenerator = {
 *   type: 'grid',
 *   generate: (config) => {
 *     // Generar et retornar PatternOutput
 *   }
 * };
 * ```
 */
export interface PatternGenerator {
    /**
     * Identificador único del tipo de patrón
     * Debe ser único entre todos los generadores registrados
     */
    type: string;

    /**
     * Función pura que genera el patrón
     * No debe tener efectos secundarios
     * Entrada: config completa del patrón
     * Salida: PatternOutput agnóstico del medio de renderizado
     */
    generate: (config: PatternGeneratorConfig) => PatternOutput;

    /**
     * Configuración por defecto para este patrón
     * Se combina con configuración del usuario
     */
    defaults: {
        geometry: Required<GeometryConfig>;
        style: Required<StyleConfig>;
    };
}

/**
 * Registry de generadores
 * Permite registrar nuevos patrones de forma dinámica
 */
export type PatternGeneratorRegistry = Map<string, PatternGenerator>;
