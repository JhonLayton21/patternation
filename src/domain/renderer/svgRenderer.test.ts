import { describe, it, expect } from 'vitest';
import { renderToSVG } from './svgRenderer';
import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';

describe('renderToSVG', () => {
    describe('SVG structure', () => {
        it('should generate valid SVG with namespace and viewBox', () => {
            const output: PatternOutput = {
                elements: [],
                dimensions: { width: 800, height: 600 },
            };

            const svg = renderToSVG(output);

            // Debe contener namespace SVG
            expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');

            // Debe tener viewBox correcto
            expect(svg).toContain('viewBox="0 0 800 600"');

            // Debe tener width y height
            expect(svg).toContain('width="800"');
            expect(svg).toContain('height="600"');

            // Debe ser un SVG bien formado
            expect(svg).toMatch(/^<svg[^>]*>.*<\/svg>$/s);
        });

        it('should handle empty elements array', () => {
            const output: PatternOutput = {
                elements: [],
                dimensions: { width: 400, height: 300 },
            };

            const svg = renderToSVG(output);

            // Debe ser SVG válido aunque vacío
            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
            expect(svg).toContain('viewBox="0 0 400 300"');
        });

        it('should apply custom backgroundColor when provided', () => {
            const output: PatternOutput = {
                elements: [],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output, { backgroundColor: '#FFFFFF' });

            // Debe contener un rect de fondo
            expect(svg).toContain('fill="#FFFFFF"');
        });
    });

    describe('Rectangle elements', () => {
        it('should convert rectangle PatternElement to SVG rect', () => {
            const element: PatternElement = {
                shape: 'rectangle',
                x: 10,
                y: 20,
                width: 30,
                height: 40,
                stroke: '#000000',
                strokeWidth: 1,
            };

            const output: PatternOutput = {
                elements: [element],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            // Debe contener un elemento rect con atributos correctos
            expect(svg).toContain('<rect');
            expect(svg).toContain('x="10"');
            expect(svg).toContain('y="20"');
            expect(svg).toContain('width="30"');
            expect(svg).toContain('height="40"');
            expect(svg).toContain('stroke="#000000"');
            expect(svg).toContain('stroke-width="1"');
        });

        it('should apply fill when provided', () => {
            const element: PatternElement = {
                shape: 'rectangle',
                x: 0,
                y: 0,
                width: 50,
                height: 50,
                fill: '#FF0000',
                stroke: '#000000',
                strokeWidth: 2,
            };

            const output: PatternOutput = {
                elements: [element],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            expect(svg).toContain('fill="#FF0000"');
        });

        it('should set fill to "none" when fill is undefined', () => {
            const element: PatternElement = {
                shape: 'rectangle',
                x: 0,
                y: 0,
                width: 50,
                height: 50,
                stroke: '#000000',
                strokeWidth: 1,
            };

            const output: PatternOutput = {
                elements: [element],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            expect(svg).toContain('fill="none"');
        });

        it('should render multiple rectangles', () => {
            const elements: PatternElement[] = [
                {
                    shape: 'rectangle',
                    x: 0,
                    y: 0,
                    width: 20,
                    height: 20,
                    stroke: '#000000',
                    strokeWidth: 1,
                },
                {
                    shape: 'rectangle',
                    x: 30,
                    y: 0,
                    width: 20,
                    height: 20,
                    stroke: '#FF0000',
                    strokeWidth: 2,
                },
            ];

            const output: PatternOutput = {
                elements,
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            // Debe contener ambos rectángulos
            const rectMatches = svg.match(/<rect/g);
            expect(rectMatches?.length).toBeGreaterThanOrEqual(2);

            // Debe contener ambos colores
            expect(svg).toContain('stroke="#000000"');
            expect(svg).toContain('stroke="#FF0000"');
        });
    });

    describe('Circle elements', () => {
        it('should convert circle PatternElement to SVG circle', () => {
            const element: PatternElement = {
                shape: 'circle',
                x: 50,
                y: 50,
                radius: 25,
                stroke: '#0000FF',
                strokeWidth: 2,
            };

            const output: PatternOutput = {
                elements: [element],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            expect(svg).toContain('<circle');
            expect(svg).toContain('cx="50"');
            expect(svg).toContain('cy="50"');
            expect(svg).toContain('r="25"');
            expect(svg).toContain('stroke="#0000FF"');
            expect(svg).toContain('stroke-width="2"');
        });
    });

    describe('Line elements', () => {
        it('should convert line PatternElement to SVG line', () => {
            const element: PatternElement = {
                shape: 'line',
                x: 0,
                y: 0,
                stroke: '#00FF00',
                strokeWidth: 3,
                data: {
                    x2: 100,
                    y2: 100,
                },
            };

            const output: PatternOutput = {
                elements: [element],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            expect(svg).toContain('<line');
            expect(svg).toContain('x1="0"');
            expect(svg).toContain('y1="0"');
            expect(svg).toContain('x2="100"');
            expect(svg).toContain('y2="100"');
            expect(svg).toContain('stroke="#00FF00"');
            expect(svg).toContain('stroke-width="3"');
        });
    });

    describe('Pure function behavior', () => {
        it('should be deterministic - same input produces same output', () => {
            const output: PatternOutput = {
                elements: [
                    {
                        shape: 'rectangle',
                        x: 10,
                        y: 10,
                        width: 20,
                        height: 20,
                        stroke: '#000000',
                        strokeWidth: 1,
                    },
                ],
                dimensions: { width: 100, height: 100 },
            };

            const svg1 = renderToSVG(output);
            const svg2 = renderToSVG(output);

            expect(svg1).toBe(svg2);
        });

        it('should not mutate input PatternOutput', () => {
            const output: PatternOutput = {
                elements: [
                    {
                        shape: 'rectangle',
                        x: 0,
                        y: 0,
                        width: 50,
                        height: 50,
                        stroke: '#000000',
                        strokeWidth: 1,
                    },
                ],
                dimensions: { width: 100, height: 100 },
            };

            const outputCopy = JSON.parse(JSON.stringify(output));

            renderToSVG(output);

            expect(output).toEqual(outputCopy);
        });
    });

    describe('Edge cases', () => {
        it('should handle elements with zero dimensions', () => {
            const element: PatternElement = {
                shape: 'rectangle',
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                stroke: '#000000',
                strokeWidth: 1,
            };

            const output: PatternOutput = {
                elements: [element],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            // No debe lanzar error
            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
        });

        it('should handle very large dimensions', () => {
            const output: PatternOutput = {
                elements: [],
                dimensions: { width: 10000, height: 10000 },
            };

            const svg = renderToSVG(output);

            expect(svg).toContain('viewBox="0 0 10000 10000"');
            expect(svg).toContain('width="10000"');
            expect(svg).toContain('height="10000"');
        });

        it('should escape special characters in colors', () => {
            const element: PatternElement = {
                shape: 'rectangle',
                x: 0,
                y: 0,
                width: 50,
                height: 50,
                stroke: 'rgb(255, 0, 0)',
                strokeWidth: 1,
            };

            const output: PatternOutput = {
                elements: [element],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            // No debe romper el SVG
            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
        });
    });

    describe('Options', () => {
        it('should use custom viewBox when provided', () => {
            const output: PatternOutput = {
                elements: [],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output, { viewBox: '0 0 200 200' });

            expect(svg).toContain('viewBox="0 0 200 200"');
        });

        it('should work without options', () => {
            const output: PatternOutput = {
                elements: [],
                dimensions: { width: 100, height: 100 },
            };

            const svg = renderToSVG(output);

            expect(svg).toContain('<svg');
            expect(svg).toContain('</svg>');
        });
    });
});
