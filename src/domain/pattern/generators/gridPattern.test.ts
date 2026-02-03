import { describe, it, expect } from 'vitest';
import { generateGridPattern } from './gridPattern';
import type { PatternConfig } from '../PatternConfig';

describe('generateGridPattern', () => {
    describe('Default values', () => {
        it('should generate a grid pattern with default values when config is empty', () => {
            const output = generateGridPattern({});

            // Debe generar elementos
            expect(output.elements.length).toBeGreaterThan(0);

            // Dimensiones por defecto
            expect(output.dimensions.width).toBe(800);
            expect(output.dimensions.height).toBe(600);

            // Metadata debe incluir el conteo de elementos
            expect(output.metadata?.elementCount).toBe(output.elements.length);
        });

        it('should use default cellSize of 20px', () => {
            const output = generateGridPattern({ width: 100, height: 100 });

            // Con cellSize=20 y gap=0, cada celda ocupa 20px
            // En 100px caben 5 celdas (100/20 = 5)
            // Total: 5x5 = 25 celdas
            expect(output.elements.length).toBe(25);
            expect(output.elements[0].width).toBe(20);
            expect(output.elements[0].height).toBe(20);
        });

        it('should use default gap of 0', () => {
            const output = generateGridPattern({
                cellSize: 20,
                width: 60,
                height: 60,
            });

            // Con gap=0, las celdas están adyacentes
            const firstElement = output.elements[0];
            const secondElement = output.elements[1];

            expect(firstElement.x).toBe(0);
            expect(secondElement.x).toBe(20); // cellSize sin gap
        });

        it('should use default strokeColor of #000000', () => {
            const output = generateGridPattern({});

            output.elements.forEach((element) => {
                expect(element.stroke).toBe('#000000');
            });
        });

        it('should use default strokeWidth of 1', () => {
            const output = generateGridPattern({});

            output.elements.forEach((element) => {
                expect(element.strokeWidth).toBe(1);
            });
        });
    });

    describe('Custom configuration', () => {
        it('should generate a grid with custom cellSize and gap', () => {
            const output = generateGridPattern({
                cellSize: 30,
                gap: 5,
                width: 400,
                height: 300,
            });

            expect(output.dimensions.width).toBe(400);
            expect(output.dimensions.height).toBe(300);

            // Verificar que los elementos tienen el tamaño correcto
            expect(output.elements[0].width).toBe(30);
            expect(output.elements[0].height).toBe(30);
        });

        it('should apply custom strokeColor to all grid cells', () => {
            const customColor = '#FF5733';
            const output = generateGridPattern({ strokeColor: customColor });

            output.elements.forEach((element) => {
                expect(element.stroke).toBe(customColor);
            });
        });

        it('should apply custom strokeWidth to all grid cells', () => {
            const customWidth = 3;
            const output = generateGridPattern({ strokeWidth: customWidth });

            output.elements.forEach((element) => {
                expect(element.strokeWidth).toBe(customWidth);
            });
        });

        it('should position grid cells correctly with gap', () => {
            const output = generateGridPattern({
                cellSize: 20,
                gap: 10,
                width: 100,
                height: 100,
            });

            const firstElement = output.elements[0];
            expect(firstElement.x).toBe(0);
            expect(firstElement.y).toBe(0);

            // Segunda celda en la misma fila
            const secondElement = output.elements[1];
            expect(secondElement.x).toBe(30); // cellSize + gap
            expect(secondElement.y).toBe(0);

            // Calcular cuántas celdas caben en una fila
            // Con cellSize=20 y gap=10, cada celda ocupa 30px
            // En 100px caben 3 celdas (0, 30, 60)
            const cellsPerRow = 3;

            // Primera celda de la segunda fila
            const firstInSecondRow = output.elements[cellsPerRow];
            expect(firstInSecondRow.x).toBe(0);
            expect(firstInSecondRow.y).toBe(30); // cellSize + gap
        });
    });

    describe('Pure function behavior', () => {
        it('should be deterministic - same input produces same output', () => {
            const config: PatternConfig = {
                cellSize: 25,
                gap: 5,
                strokeColor: '#123456',
                width: 200,
                height: 200,
            };

            const output1 = generateGridPattern(config);
            const output2 = generateGridPattern(config);

            expect(output1.elements.length).toBe(output2.elements.length);
            expect(output1.elements[0]).toEqual(output2.elements[0]);
            expect(output1.dimensions).toEqual(output2.dimensions);
        });

        it('should not mutate input config', () => {
            const config: PatternConfig = { cellSize: 15, gap: 3 };
            const configCopy = { ...config };

            generateGridPattern(config);

            expect(config).toEqual(configCopy);
        });
    });

    describe('Element structure', () => {
        it('should generate rectangle elements', () => {
            const output = generateGridPattern({});

            output.elements.forEach((element) => {
                expect(element.shape).toBe('rectangle');
                expect(element.width).toBeDefined();
                expect(element.height).toBeDefined();
                expect(element.x).toBeDefined();
                expect(element.y).toBeDefined();
            });
        });

        it('should not set fill property (only stroke)', () => {
            const output = generateGridPattern({});

            output.elements.forEach((element) => {
                expect(element.fill).toBeUndefined();
                expect(element.stroke).toBeDefined();
            });
        });
    });

    describe('Boundary conditions', () => {
        it('should handle width and height that fit exact number of cells', () => {
            const output = generateGridPattern({
                cellSize: 20,
                gap: 0,
                width: 100,
                height: 100,
            });

            // 100/20 = 5 celdas por fila y columna
            expect(output.elements.length).toBe(25); // 5x5
        });

        it('should handle width and height with partial cells (should not include partial cells)', () => {
            const output = generateGridPattern({
                cellSize: 30,
                gap: 0,
                width: 100,
                height: 100,
            });

            // 100/30 = 3.33, solo caben 3 celdas completas
            expect(output.elements.length).toBe(9); // 3x3
        });

        it('should handle gap larger than cellSize', () => {
            const output = generateGridPattern({
                cellSize: 10,
                gap: 20,
                width: 100,
                height: 100,
            });

            // Cada celda ocupa 10 + 20 = 30px
            // En 100px caben 3 celdas (0, 30, 60)
            expect(output.elements.length).toBe(9); // 3x3

            const firstElement = output.elements[0];
            const secondElement = output.elements[1];

            expect(secondElement.x - firstElement.x).toBe(30);
        });

        it('should return empty elements array when cellSize is larger than dimensions', () => {
            const output = generateGridPattern({
                cellSize: 1000,
                width: 100,
                height: 100,
            });

            expect(output.elements.length).toBe(0);
            expect(output.metadata?.elementCount).toBe(0);
        });
    });
});
