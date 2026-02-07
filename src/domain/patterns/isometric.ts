/**
 * Generador de Isometric Grid Pattern
 * 
 * Patrón de rejilla isométrica (30-60-90 degrees)
 * Ideal para diseño técnico, sketching, y dibujo 3D
 */

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

const ISOMETRIC_DEFAULTS = {
    geometry: {
        cellSize: 30,
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
 * Genera patrón isométrico
 * Crea una rejilla 3D simulada con tres direcciones de líneas:
 * - Horizontal
 * - A +30°
 * - A -30° (o +150°)
 */
function generateIsometricPattern(
    config: PatternGeneratorConfig
): PatternOutput {
    const geometry = {
        cellSize: config.geometry.cellSize ?? ISOMETRIC_DEFAULTS.geometry.cellSize,
        gap: config.geometry.gap ?? ISOMETRIC_DEFAULTS.geometry.gap,
        width: config.geometry.width ?? ISOMETRIC_DEFAULTS.geometry.width,
        height: config.geometry.height ?? ISOMETRIC_DEFAULTS.geometry.height,
    };

    const style = {
        strokeColor: config.style.strokeColor ?? ISOMETRIC_DEFAULTS.style.strokeColor,
        strokeWidth: config.style.strokeWidth ?? ISOMETRIC_DEFAULTS.style.strokeWidth,
        strokeOpacity: config.style.strokeOpacity ?? ISOMETRIC_DEFAULTS.style.strokeOpacity,
        lineCap: config.style.lineCap ?? ISOMETRIC_DEFAULTS.style.lineCap,
        backgroundColor: config.style.backgroundColor ?? ISOMETRIC_DEFAULTS.style.backgroundColor,
        backgroundOpacity: config.style.backgroundOpacity ?? ISOMETRIC_DEFAULTS.style.backgroundOpacity,
        strokeDasharray: config.style.strokeDasharray ?? undefined,
    };

    const { cellSize, gap, width, height } = geometry;
    const step = cellSize + gap;
    const cos30 = Math.cos(Math.PI / 6); // cos(30°) ≈ 0.866
    const sin30 = Math.sin(Math.PI / 6); // sin(30°) = 0.5

    // Ancho y alto de cada celda isométrica
    const xOffset = step * cos30;
    const yOffset = step * sin30;

    const elements: PatternElement[] = [];

    // Líneas horizontales (→)
    for (let row = 0; row * yOffset <= height + step; row++) {
        const y = row * yOffset;
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

    // Líneas a +30° (↗)
    for (let col = -Math.ceil(height / yOffset); col * xOffset <= width + step; col++) {
        const startX = col * xOffset;
        const startY = 0;
        const endX = startX + (height / sin30) * cos30;
        const endY = height;
        
        const element: PatternElement = {
            shape: 'line',
            x: startX,
            y: startY,
            stroke: style.strokeColor,
            strokeWidth: style.strokeWidth,
            data: {
                x2: endX,
                y2: endY,
                strokeOpacity: style.strokeOpacity,
                lineCap: style.lineCap,
                strokeDasharray: style.strokeDasharray,
            },
        };
        elements.push(element);
    }

    // Líneas a -30° (↖)
    for (let col = 0; col * xOffset <= width + height / sin30 * cos30 + step; col++) {
        const startX = col * xOffset;
        const startY = 0;
        const endX = startX - (height / sin30) * cos30;
        const endY = height;
        
        const element: PatternElement = {
            shape: 'line',
            x: startX,
            y: startY,
            stroke: style.strokeColor,
            strokeWidth: style.strokeWidth,
            data: {
                x2: endX,
                y2: endY,
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

export const isometricPatternGenerator: PatternGenerator = {
    type: 'isometric',
    defaults: ISOMETRIC_DEFAULTS,
    generate: generateIsometricPattern,
};
