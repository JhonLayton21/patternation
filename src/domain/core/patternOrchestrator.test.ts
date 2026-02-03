import { describe, it, expect } from 'vitest';
import { generatePatternSVG } from './patternOrchestrator';
import type { PatternType } from '../pattern/PatternType';

describe('generatePatternSVG - Integration Tests', () => {
    describe('Grid pattern end-to-end', () => {
        it('should generate valid SVG from grid pattern config', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 20,
                    gap: 5,
                    strokeColor: '#000000',
                    strokeWidth: 1,
                    width: 100,
                    height: 100,
                },
            });

            // Debe ser un SVG válido
            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
            expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

            // Debe tener las dimensiones correctas
            expect(svg).toContain('width="100"');
            expect(svg).toContain('height="100"');
            expect(svg).toContain('viewBox="0 0 100 100"');

            // Debe contener elementos rect (grid cells)
            expect(svg).toContain('<rect');
        });

        it('should generate SVG with default config values', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {},
            });

            // Debe usar dimensiones por defecto
            expect(svg).toContain('width="800"');
            expect(svg).toContain('height="600"');

            // Debe contener elementos
            expect(svg).toContain('<rect');
        });

        it('should apply custom pattern config correctly', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 30,
                    gap: 10,
                    strokeColor: '#FF5733',
                    strokeWidth: 2,
                    width: 200,
                    height: 200,
                },
            });

            // Debe aplicar el color personalizado
            expect(svg).toContain('stroke="#FF5733"');

            // Debe aplicar el strokeWidth
            expect(svg).toContain('stroke-width="2"');

            // Debe tener las dimensiones correctas
            expect(svg).toContain('width="200"');
            expect(svg).toContain('height="200"');
        });
    });

    describe('Render options', () => {
        it('should apply backgroundColor when provided', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: { width: 100, height: 100 },
                renderOptions: {
                    backgroundColor: '#FFFFFF',
                },
            });

            // Debe contener el background
            expect(svg).toContain('fill="#FFFFFF"');
        });

        it('should apply custom viewBox when provided', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: { width: 100, height: 100 },
                renderOptions: {
                    viewBox: '0 0 200 200',
                },
            });

            expect(svg).toContain('viewBox="0 0 200 200"');
        });

        it('should work without render options', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {},
            });

            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
        });
    });

    describe('Pure function behavior', () => {
        it('should be deterministic - same input produces same output', () => {
            const options = {
                type: 'grid' as PatternType,
                config: {
                    cellSize: 25,
                    gap: 5,
                    strokeColor: '#123456',
                    width: 150,
                    height: 150,
                },
            };

            const svg1 = generatePatternSVG(options);
            const svg2 = generatePatternSVG(options);

            expect(svg1).toBe(svg2);
        });

        it('should not mutate input options', () => {
            const options = {
                type: 'grid' as PatternType,
                config: {
                    cellSize: 20,
                    gap: 0,
                },
            };

            const optionsCopy = JSON.parse(JSON.stringify(options));

            generatePatternSVG(options);

            expect(options).toEqual(optionsCopy);
        });
    });

    describe('Pattern elements integration', () => {
        it('should include pattern elements in SVG output', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 50,
                    gap: 0,
                    width: 100,
                    height: 100,
                    strokeColor: '#000000',
                },
            });

            // Con cellSize=50 y gap=0 en 100x100, deberían haber 4 celdas (2x2)
            const rectMatches = svg.match(/<rect/g);
            expect(rectMatches).toBeTruthy();
            expect(rectMatches!.length).toBeGreaterThanOrEqual(4);
        });

        it('should correctly position elements from generator', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 20,
                    gap: 10,
                    width: 100,
                    height: 100,
                },
            });

            // Primera celda debe estar en (0, 0)
            expect(svg).toContain('x="0"');
            expect(svg).toContain('y="0"');

            // Segunda celda debe estar en (30, 0) - cellSize + gap
            expect(svg).toContain('x="30"');
        });
    });

    describe('Error handling', () => {
        it('should throw error for unimplemented pattern type', () => {
            expect(() => {
                generatePatternSVG({
                    type: 'dots' as PatternType,
                    config: {},
                });
            }).toThrow('Pattern type "dots" is not implemented');
        });

        it('should throw error for waves pattern type', () => {
            expect(() => {
                generatePatternSVG({
                    type: 'waves' as PatternType,
                    config: {},
                });
            }).toThrow('Pattern type "waves" is not implemented');
        });

        it('should throw error for noise pattern type', () => {
            expect(() => {
                generatePatternSVG({
                    type: 'noise' as PatternType,
                    config: {},
                });
            }).toThrow('Pattern type "noise" is not implemented');
        });

        it('should provide helpful error message', () => {
            expect(() => {
                generatePatternSVG({
                    type: 'invalid' as PatternType,
                    config: {},
                });
            }).toThrow(/Pattern type "invalid" is not implemented/);
        });
    });

    describe('Edge cases', () => {
        it('should handle empty config object', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {},
            });

            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
        });

        it('should handle very small dimensions', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 10,
                    width: 20,
                    height: 20,
                },
            });

            expect(svg).toContain('width="20"');
            expect(svg).toContain('height="20"');
        });

        it('should handle very large dimensions', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 100,
                    width: 5000,
                    height: 5000,
                },
            });

            expect(svg).toContain('width="5000"');
            expect(svg).toContain('height="5000"');
        });

        it('should handle cellSize larger than dimensions', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 1000,
                    width: 100,
                    height: 100,
                },
            });

            // Debe generar SVG válido aunque vacío
            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
        });
    });

    describe('Complete workflow validation', () => {
        it('should produce valid SVG that could be saved to file', () => {
            const svg = generatePatternSVG({
                type: 'grid',
                config: {
                    cellSize: 25,
                    gap: 5,
                    strokeColor: '#333333',
                    strokeWidth: 1,
                    width: 400,
                    height: 300,
                },
                renderOptions: {
                    backgroundColor: '#F5F5F5',
                },
            });

            // Validaciones básicas de SVG válido
            expect(svg.startsWith('<svg')).toBe(true);
            expect(svg.endsWith('</svg>')).toBe(true);
            expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

            // Debe tener estructura correcta
            expect(svg.split('<svg').length).toBe(2); // Solo un tag de apertura
            expect(svg.split('</svg>').length).toBe(2); // Solo un tag de cierre
        });
    });
});
