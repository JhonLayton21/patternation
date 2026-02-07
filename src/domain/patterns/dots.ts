/**
 * Generador de Dots Pattern
 * 
 * Patrón de puntos (círculos) dispuestos en grid
 * Ideal para dot journals, dot grids, y diseños puntillistas
 */

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

const DOTS_DEFAULTS = {
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
        lineCap: 'round' as const,
        backgroundColor: undefined,
        backgroundOpacity: 1,
    } as Required<StyleConfig>,
};

/**
 * Genera patrón de puntos (círculos)
 * Los puntos se centran en cada celda
 * Radio = cellSize/2 (aprox)
 */
function generateDotsPattern(
    config: PatternGeneratorConfig
): PatternOutput {
    const geometry = {
        cellSize: config.geometry.cellSize ?? DOTS_DEFAULTS.geometry.cellSize,
        gap: config.geometry.gap ?? DOTS_DEFAULTS.geometry.gap,
        width: config.geometry.width ?? DOTS_DEFAULTS.geometry.width,
        height: config.geometry.height ?? DOTS_DEFAULTS.geometry.height,
    };

    const style = {
        strokeColor: config.style.strokeColor ?? DOTS_DEFAULTS.style.strokeColor,
        strokeWidth: config.style.strokeWidth ?? DOTS_DEFAULTS.style.strokeWidth,
        strokeOpacity: config.style.strokeOpacity ?? DOTS_DEFAULTS.style.strokeOpacity,
        lineCap: config.style.lineCap ?? DOTS_DEFAULTS.style.lineCap,
        backgroundColor: config.style.backgroundColor ?? DOTS_DEFAULTS.style.backgroundColor,
        backgroundOpacity: config.style.backgroundOpacity ?? DOTS_DEFAULTS.style.backgroundOpacity,
        strokeDasharray: config.style.strokeDasharray ?? undefined,
    };

    const { cellSize, gap, width, height } = geometry;
    const cellStep = cellSize + gap;
    const radius = cellSize / 3; // Punto pequeño proporcional

    const cols = Math.floor(width / cellStep);
    const rows = Math.floor(height / cellStep);

    const elements: PatternElement[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Centro de la celda
            const cx = col * cellStep + cellSize / 2;
            const cy = row * cellStep + cellSize / 2;

            const element: PatternElement = {
                shape: 'circle',
                x: cx,
                y: cy,
                radius: radius,
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

    return {
        elements,
        dimensions: { width, height },
        metadata: {
            elementCount: elements.length,
            generatedAt: Date.now(),
        },
    };
}

export const dotsPatternGenerator: PatternGenerator = {
    type: 'dots',
    defaults: DOTS_DEFAULTS,
    generate: generateDotsPattern,
};
