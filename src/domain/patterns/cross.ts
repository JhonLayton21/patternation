/**
 * Generador de Cross / Graph Paper Pattern
 * 
 * Patrón de líneas horizontales y verticales con énfasis en intersecciones
 * Ideal para papel técnico, cuadrículas, y diseño de ingeniería
 */

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

const CROSS_DEFAULTS = {
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
        strokeDasharray: [],
        backgroundColor: undefined,
        backgroundOpacity: 1,
    } as StyleConfig,
};

/**
 * Genera patrón de cruces (graph paper)
 * Crea líneas verticales y horizontales que se intersectan
 * Opcional: pequeños círculos en las intersecciones
 */
function generateCrossPattern(
    config: PatternGeneratorConfig
): PatternOutput {
    const geometry = {
        cellSize: config.geometry.cellSize ?? CROSS_DEFAULTS.geometry.cellSize,
        gap: config.geometry.gap ?? CROSS_DEFAULTS.geometry.gap,
        width: config.geometry.width ?? CROSS_DEFAULTS.geometry.width,
        height: config.geometry.height ?? CROSS_DEFAULTS.geometry.height,
    };

    const style = {
        strokeColor: config.style.strokeColor ?? CROSS_DEFAULTS.style.strokeColor,
        strokeWidth: config.style.strokeWidth ?? CROSS_DEFAULTS.style.strokeWidth,
        strokeOpacity: config.style.strokeOpacity ?? CROSS_DEFAULTS.style.strokeOpacity,
        lineCap: config.style.lineCap ?? CROSS_DEFAULTS.style.lineCap,
        backgroundColor: config.style.backgroundColor ?? CROSS_DEFAULTS.style.backgroundColor,
        backgroundOpacity: config.style.backgroundOpacity ?? CROSS_DEFAULTS.style.backgroundOpacity,
        strokeDasharray: config.style.strokeDasharray ?? undefined,
    };

    const { cellSize, gap, width, height } = geometry;
    const cellStep = cellSize + gap;

    const cols = Math.ceil(width / cellStep);
    const rows = Math.ceil(height / cellStep);

    const elements: PatternElement[] = [];

    // Líneas verticales
    for (let col = 0; col <= cols; col++) {
        const x = col * cellStep;
        if (x <= width) {
            const element: PatternElement = {
                shape: 'line',
                x: x,
                y: 0,
                stroke: style.strokeColor,
                strokeWidth: style.strokeWidth,
                data: {
                    x2: x,
                    y2: height,
                    strokeOpacity: style.strokeOpacity,
                    lineCap: style.lineCap,
                    strokeDasharray: style.strokeDasharray,
                },
            };
            elements.push(element);
        }
    }

    // Líneas horizontales
    for (let row = 0; row <= rows; row++) {
        const y = row * cellStep;
        if (y <= height) {
            const element: PatternElement = {
                shape: 'line',
                x: 0,
                y: y,
                stroke: style.strokeColor,
                strokeWidth: style.strokeWidth,
                data: {
                    x2: width,
                    y2: y,
                    strokeOpacity: style.strokeOpacity,
                    lineCap: style.lineCap,
                    strokeDasharray: style.strokeDasharray,
                },
            };
            elements.push(element);
        }
    }

    // Puntos pequeños en las intersecciones
    const dotRadius = Math.max(style.strokeWidth * 1.5, 1);
    for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
            const x = col * cellStep;
            const y = row * cellStep;
            if (x <= width && y <= height) {
                const element: PatternElement = {
                    shape: 'circle',
                    x: x,
                    y: y,
                    radius: dotRadius,
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

export const crossPatternGenerator: PatternGenerator = {
    type: 'cross',
    defaults: CROSS_DEFAULTS,
    generate: generateCrossPattern,
};
