/**
 * Estado centralizado y serializable de un patrón
 * 
 * Esta interfaz representa TODOS los datos necesarios para:
 * - Reproducir un patrón idéntico
 * - Serializar para presets / share / localStorage
 * - Restaurar el estado sin lógica adicional
 * 
 * Principio: Un único objeto de verdad que fluye por la aplicación
 */

import type { GeometryConfig } from './GeometryConfig';
import type { StyleConfig } from './StyleConfig';

/**
 * Configuración completa y serializable de un patrón
 * 
 * Todos los valores son opcionales porque cada generador
 * tiene sus propios defaults. Esto permite:
 * - Guardar sólo lo que el usuario cambió
 * - Combinar defaults base + user overrides
 * - Compatibilidad hacia atrás si agregamos nuevos campos
 */
export interface PatternState {
    /**
     * Tipo de patrón actual
     * @example 'grid', 'dots', 'waves'
     */
    type: string;

    /**
     * Configuración geométrica
     */
    geometry: GeometryConfig;

    /**
     * Configuración de estilo
     */
    style: StyleConfig;
}

/**
 * Crea un nuevo PatternState con valores iniciales
 * Útil para resetear o crear un patrón nuevo
 */
export function createPatternState(
    type: string,
    geometry: GeometryConfig = {},
    style: StyleConfig = {}
): PatternState {
    return {
        type,
        geometry,
        style,
    };
}

/**
 * Combina defaults con overrides
 * Usado para aplicar defaults de generador + valores del usuario
 * 
 * Dado que los valores en PatternState son opcionales,
 * este helper asegura que siempre tenemos valores válidos
 * 
 * @param defaults - Valores por defecto del generador
 * @param overrides - Valores del usuario (parciales)
 * @returns Configuración completa y válida
 */
export function mergePatternConfig<T extends object>(
    defaults: Required<T>,
    overrides: Partial<T>
): Required<T> {
    return {
        ...defaults,
        ...overrides,
    };
}
