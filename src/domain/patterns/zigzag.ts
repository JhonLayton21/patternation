/**
 * Generador de Zig-zag Pattern
 * 
 * Patrón de líneas en zigzag horizontal
 * Crea un efecto de onda angular
 */

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

const ZIGZAG_DEFAULTS = {
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
        strokeDasharray: [],
        backgroundColor: undefined,
        backgroundOpacity: 1,
    } as StyleConfig,
};

/**
 * Genera patrón zigzag
 * Crea líneas continuas en forma de zigzag
 */
function generateZigzagPattern(
    config: PatternGeneratorConfig
): PatternOutput {
    const geometry = {
        cellSize: config.geometry.cellSize ?? ZIGZAG_DEFAULTS.geometry.cellSize,
        gap: config.geometry.gap ?? ZIGZAG_DEFAULTS.geometry.gap,
        width: config.geometry.width ?? ZIGZAG_DEFAULTS.geometry.width,
        height: config.geometry.height ?? ZIGZAG_DEFAULTS.geometry.height,
    };

    const style = {
        strokeColor: config.style.strokeColor ?? ZIGZAG_DEFAULTS.style.strokeColor,
        strokeWidth: config.style.strokeWidth ?? ZIGZAG_DEFAULTS.style.strokeWidth,
        strokeOpacity: config.style.strokeOpacity ?? ZIGZAG_DEFAULTS.style.strokeOpacity,
        lineCap: config.style.lineCap ?? ZIGZAG_DEFAULTS.style.lineCap,
        backgroundColor: config.style.backgroundColor ?? ZIGZAG_DEFAULTS.style.backgroundColor,
        backgroundOpacity: config.style.backgroundOpacity ?? ZIGZAG_DEFAULTS.style.backgroundOpacity,
        strokeDasharray: config.style.strokeDasharray ?? undefined,
    };

    const { cellSize, gap, width, height } = geometry;
    const step = cellSize + gap;
    const amplitude = cellSize / 2; // Altura del zigzag

    const elements: PatternElement[] = [];

    // Una fila de zigzag se repite verticalmente
    for (let row = 0; row < Math.ceil(height / step); row++) {
        const baseY = row * step;

        // Crear un zigzag que va de izquierda a derecha
        let pathD = '';
        let x = 0;
        let y = baseY;
        let direction = 1; // 1 para arriba, -1 para abajo

        while (x <= width) {
            const nextX = Math.min(x + cellSize, width);
            const nextY = y + amplitude * direction;

            if (pathD === '') {
                pathD = `M ${x} ${y}`;
            }
            
            pathD += ` L ${nextX} ${nextY}`;
            
            x = nextX;
            y = nextY;
            direction *= -1; // Cambiar dirección
        }

        if (pathD) {
            const element: PatternElement = {
                shape: 'path',
                x: 0,
                y: 0,
                stroke: style.strokeColor,
                strokeWidth: style.strokeWidth,
                data: {
                    d: pathD,
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

export const zigzagPatternGenerator: PatternGenerator = {
    type: 'zigzag',
    defaults: ZIGZAG_DEFAULTS,
    generate: generateZigzagPattern,
};
