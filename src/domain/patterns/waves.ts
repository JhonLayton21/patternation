/**
 * Generador de Waves Pattern
 * 
 * Patrón de ondas suaves y continuas
 * Puede ser usado para diseños orgánicos y decorativos
 */

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

const WAVES_DEFAULTS = {
    geometry: {
        cellSize: 40,
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
 * Genera patrón de ondas
 * Crea líneas ondulantes suaves repitiéndose
 */
function generateWavesPattern(
    config: PatternGeneratorConfig
): PatternOutput {
    const geometry = {
        cellSize: config.geometry.cellSize ?? WAVES_DEFAULTS.geometry.cellSize,
        gap: config.geometry.gap ?? WAVES_DEFAULTS.geometry.gap,
        width: config.geometry.width ?? WAVES_DEFAULTS.geometry.width,
        height: config.geometry.height ?? WAVES_DEFAULTS.geometry.height,
    };

    const style = {
        strokeColor: config.style.strokeColor ?? WAVES_DEFAULTS.style.strokeColor,
        strokeWidth: config.style.strokeWidth ?? WAVES_DEFAULTS.style.strokeWidth,
        strokeOpacity: config.style.strokeOpacity ?? WAVES_DEFAULTS.style.strokeOpacity,
        lineCap: config.style.lineCap ?? WAVES_DEFAULTS.style.lineCap,
        backgroundColor: config.style.backgroundColor ?? WAVES_DEFAULTS.style.backgroundColor,
        backgroundOpacity: config.style.backgroundOpacity ?? WAVES_DEFAULTS.style.backgroundOpacity,
        strokeDasharray: config.style.strokeDasharray ?? undefined,
    };

    const { cellSize, gap, width, height } = geometry;
    const step = cellSize + gap;
    const amplitude = cellSize / 3;
    const frequency = 2 * Math.PI / step; // Una onda completa por cellSize

    const elements: PatternElement[] = [];

    // Generar múltiples ondas horizontales
    for (let row = 0; row < Math.ceil(height / step); row++) {
        const baseY = row * step;
        let pathD = '';

        // Muestrear la onda en pequeños intervalos para aproximarla
        const samples = Math.max(Math.ceil(width / 5), 20); // Al menos 20 puntos
        for (let i = 0; i <= samples; i++) {
            const x = (i / samples) * width;
            // Onda senoidal suave
            const y = baseY + amplitude * Math.sin(frequency * x);

            if (i === 0) {
                pathD = `M ${x} ${y}`;
            } else {
                pathD += ` L ${x} ${y}`;
            }
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

export const wavesPatternGenerator: PatternGenerator = {
    type: 'waves',
    defaults: WAVES_DEFAULTS,
    generate: generateWavesPattern,
};
