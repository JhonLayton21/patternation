/**
 * Generador de Grid Pattern
 * 
 * Implementa la interfaz PatternGenerator.
 * Cada patrón es un módulo independiente que puede:
 * - Ser testeado aisladamente
 * - Tener sus propios defaults
 * - Ser usado sin dependencias externas
 * 
 * Estructura:
 * - type: identificador único
 * - defaults: configuración base para grid
 * - generate: función pura que crea el patrón
 */

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

/**
 * Defaults específicos para el patrón Grid
 * Se usan como base y se combinan con config del usuario
 */
const GRID_DEFAULTS = {
    geometry: {
        cellSize: 20,
        gap: 0,
        width: 800,
        height: 600,
    } as Required<GeometryConfig>,
    style: {
        strokeColor: '#000000',
        strokeWidth: 1,
        strokeOpacity: 1,
        lineCap: 'butt' as const,
        backgroundColor: undefined,
        backgroundOpacity: 1,
    } as Required<StyleConfig>,
};

/**
 * Función pura de generación de grid
 * 
 * Lógica:
 * 1. Combina defaults con config del usuario
 * 2. Calcula células basadas en cellSize + gap
 * 3. Itera grid y crea rectangles
 * 4. Retorna PatternOutput listo para renderizar
 */
function generateGridPattern(
    config: PatternGeneratorConfig
): PatternOutput {
    // Combinar defaults con overrides del usuario
    const geometry = {
        cellSize: config.geometry.cellSize ?? GRID_DEFAULTS.geometry.cellSize,
        gap: config.geometry.gap ?? GRID_DEFAULTS.geometry.gap,
        width: config.geometry.width ?? GRID_DEFAULTS.geometry.width,
        height: config.geometry.height ?? GRID_DEFAULTS.geometry.height,
    };

    const style = {
        strokeColor: config.style.strokeColor ?? GRID_DEFAULTS.style.strokeColor,
        strokeWidth: config.style.strokeWidth ?? GRID_DEFAULTS.style.strokeWidth,
        strokeOpacity: config.style.strokeOpacity ?? GRID_DEFAULTS.style.strokeOpacity,
        lineCap: config.style.lineCap ?? GRID_DEFAULTS.style.lineCap,
        backgroundColor: config.style.backgroundColor ?? GRID_DEFAULTS.style.backgroundColor,
        backgroundOpacity: config.style.backgroundOpacity ?? GRID_DEFAULTS.style.backgroundOpacity,
        strokeDasharray: config.style.strokeDasharray ?? undefined,
    };

    const { cellSize, gap, width, height } = geometry;

    // Calcular el paso de cada celda (tamaño + gap)
    const cellStep = cellSize + gap;

    // Calcular cuántas celdas completas caben
    const cols = Math.floor(width / cellStep);
    const rows = Math.floor(height / cellStep);

    // Generar elementos
    const elements: PatternElement[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const element: PatternElement = {
                shape: 'rectangle',
                x: col * cellStep,
                y: row * cellStep,
                width: cellSize,
                height: cellSize,
                stroke: style.strokeColor,
                strokeWidth: style.strokeWidth,
                data: {
                    strokeOpacity: style.strokeOpacity,
                    lineCap: style.lineCap,
                    strokeDasharray: style.strokeDasharray,
                },
            };

            elements.push(element);
        }
    }

    // Construir salida
    const output: PatternOutput = {
        elements,
        dimensions: {
            width,
            height,
        },
        metadata: {
            elementCount: elements.length,
            generatedAt: Date.now(),
        },
    };

    return output;
}

/**
 * Implementación de PatternGenerator para Grid
 * 
 * Exportar como singleton para inyección en registry
 */
export const gridPatternGenerator: PatternGenerator = {
    type: 'grid',
    defaults: GRID_DEFAULTS,
    generate: generateGridPattern,
};
