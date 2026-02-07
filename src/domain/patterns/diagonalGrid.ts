/**
 * Generador de Diagonal Grid Pattern
 * 
 * Patrón de líneas diagonales a 45°
 * Crea una rejilla diagonal que cubre todo el canvas
 */

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

const DIAGONAL_GRID_DEFAULTS = {
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
 * Genera patrón diagonal (45°)
 * Crea líneas diagonales que se repiten
 */
function generateDiagonalGridPattern(
    config: PatternGeneratorConfig
): PatternOutput {
    const geometry = {
        cellSize: config.geometry.cellSize ?? DIAGONAL_GRID_DEFAULTS.geometry.cellSize,
        gap: config.geometry.gap ?? DIAGONAL_GRID_DEFAULTS.geometry.gap,
        width: config.geometry.width ?? DIAGONAL_GRID_DEFAULTS.geometry.width,
        height: config.geometry.height ?? DIAGONAL_GRID_DEFAULTS.geometry.height,
    };

    const style = {
        strokeColor: config.style.strokeColor ?? DIAGONAL_GRID_DEFAULTS.style.strokeColor,
        strokeWidth: config.style.strokeWidth ?? DIAGONAL_GRID_DEFAULTS.style.strokeWidth,
        strokeOpacity: config.style.strokeOpacity ?? DIAGONAL_GRID_DEFAULTS.style.strokeOpacity,
        lineCap: config.style.lineCap ?? DIAGONAL_GRID_DEFAULTS.style.lineCap,
        backgroundColor: config.style.backgroundColor ?? DIAGONAL_GRID_DEFAULTS.style.backgroundColor,
        backgroundOpacity: config.style.backgroundOpacity ?? DIAGONAL_GRID_DEFAULTS.style.backgroundOpacity,
        strokeDasharray: config.style.strokeDasharray ?? undefined,
    };

    const { cellSize, gap, width, height } = geometry;
    const cellStep = cellSize + gap;

    const elements: PatternElement[] = [];

    // Líneas diagonales (↘) que van de arriba-izq a abajo-der
    // Cubren todo el canvas incluyendo diagonales que salen de los bordes
    for (let offset = -height; offset <= width; offset += cellStep) {
        const element: PatternElement = {
            shape: 'line',
            x: offset,
            y: 0,
            stroke: style.strokeColor,
            strokeWidth: style.strokeWidth,
            data: {
                x2: offset + height, // Diagonal 45°: dx = dy
                y2: height,
                strokeOpacity: style.strokeOpacity,
                lineCap: style.lineCap,
                strokeDasharray: style.strokeDasharray,
            },
        };
        elements.push(element);
    }

    // Líneas diagonales (↙) que van de arriba-der a abajo-izq
    for (let offset = 0; offset <= width + height; offset += cellStep) {
        const element: PatternElement = {
            shape: 'line',
            x: offset,
            y: 0,
            stroke: style.strokeColor,
            strokeWidth: style.strokeWidth,
            data: {
                x2: offset - height, // Diagonal 45° opuesto
                y2: height,
                strokeOpacity: style.strokeOpacity,
                lineCap: style.lineCap,
                strokeDasharray: style.strokeDasharray,
            },
        };
        elements.push(element);
    }

    return {
        elements,
        dimensions: { width, height },
        metadata: {
            elementCount: elements.length,
            generatedAt: Date.now(),
        },
    };
}

export const diagonalGridPatternGenerator: PatternGenerator = {
    type: 'diagonalGrid',
    defaults: DIAGONAL_GRID_DEFAULTS,
    generate: generateDiagonalGridPattern,
};
