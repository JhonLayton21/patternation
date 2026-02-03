import type { PatternConfig } from '../PatternConfig';
import type { PatternOutput, PatternElement } from '../PatternOutput';

/**
 * Valores por defecto para el generador de grid pattern
 */
const DEFAULT_CELL_SIZE = 20;
const DEFAULT_GAP = 0;
const DEFAULT_STROKE_COLOR = '#000000';
const DEFAULT_STROKE_WIDTH = 1;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

/**
 * Genera un patrón de grid (cuadrícula) basado en la configuración proporcionada
 * 
 * Función pura sin efectos secundarios:
 * - No muta el config de entrada
 * - Salida determinista para el mismo input
 * - Retorna solo datos, sin renderizado
 * 
 * @param config - Configuración del patrón (todas las propiedades son opcionales)
 * @returns PatternOutput con elementos rectangulares posicionados en grid
 */
export function generateGridPattern(config: PatternConfig): PatternOutput {
    // Aplicar valores por defecto sin mutar el config original
    const cellSize = config.cellSize ?? DEFAULT_CELL_SIZE;
    const gap = config.gap ?? DEFAULT_GAP;
    const strokeColor = config.strokeColor ?? DEFAULT_STROKE_COLOR;
    const strokeWidth = config.strokeWidth ?? DEFAULT_STROKE_WIDTH;
    const width = config.width ?? DEFAULT_WIDTH;
    const height = config.height ?? DEFAULT_HEIGHT;

    // Calcular el espacio total que ocupa cada celda (tamaño + gap)
    const cellStep = cellSize + gap;

    // Calcular cuántas celdas completas caben en cada dimensión
    const cols = Math.floor(width / cellStep);
    const rows = Math.floor(height / cellStep);

    // Generar elementos del grid
    const elements: PatternElement[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const element: PatternElement = {
                shape: 'rectangle',
                x: col * cellStep,
                y: row * cellStep,
                width: cellSize,
                height: cellSize,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
            };

            elements.push(element);
        }
    }

    // Construir la salida
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
