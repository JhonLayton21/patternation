import type { PatternOutput, PatternElement } from '../pattern/PatternOutput';

/**
 * Opciones para el renderizado SVG
 */
export interface SVGRenderOptions {
    /**
     * Color de fondo del SVG
     */
    backgroundColor?: string;

    /**
     * ViewBox personalizado (por defecto usa las dimensiones del pattern)
     */
    viewBox?: string;
}

/**
 * Renderiza un PatternOutput a un string SVG válido
 * 
 * Función pura sin efectos secundarios:
 * - No muta el input
 * - Salida determinista
 * - Retorna string SVG completo y válido
 * 
 * @param output - PatternOutput con elementos abstractos
 * @param options - Opciones de renderizado (opcionales)
 * @returns String SVG válido
 */
export function renderToSVG(
    output: PatternOutput,
    options?: SVGRenderOptions
): string {
    const { width, height } = output.dimensions;
    const viewBox = options?.viewBox ?? `0 0 ${width} ${height}`;
    const backgroundColor = options?.backgroundColor;

    // Construir elementos SVG
    const elements: string[] = [];

    // Agregar rectángulo de fondo si se especifica
    if (backgroundColor) {
        elements.push(
            `  <rect x="0" y="0" width="${width}" height="${height}" fill="${backgroundColor}" />`
        );
    }

    // Convertir cada PatternElement a SVG
    for (const element of output.elements) {
        const svgElement = convertElementToSVG(element);
        if (svgElement) {
            elements.push(`  ${svgElement}`);
        }
    }

    // Construir SVG completo
    const svg = [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">`,
        ...elements,
        '</svg>',
    ].join('\n');

    return svg;
}

/**
 * Convierte un PatternElement a su representación SVG
 * @param element - Elemento abstracto del patrón
 * @returns String del elemento SVG o null si no se puede convertir
 */
function convertElementToSVG(element: PatternElement): string | null {
    switch (element.shape) {
        case 'rectangle':
            return convertRectangleToSVG(element);
        case 'circle':
            return convertCircleToSVG(element);
        case 'line':
            return convertLineToSVG(element);
        case 'path':
            return convertPathToSVG(element);
        default:
            return null;
    }
}

/**
 * Convierte un elemento rectangle a SVG <rect>
 */
function convertRectangleToSVG(element: PatternElement): string {
    const { x, y, width, height, fill, stroke, strokeWidth, data } = element;

    const attributes: string[] = [
        `x="${x}"`,
        `y="${y}"`,
        `width="${width}"`,
        `height="${height}"`,
    ];

    // Fill
    if (fill !== undefined) {
        attributes.push(`fill="${fill}"`);
    } else {
        attributes.push('fill="none"');
    }

    // Stroke
    if (stroke !== undefined) {
        attributes.push(`stroke="${stroke}"`);
    }

    // Stroke width
    if (strokeWidth !== undefined) {
        attributes.push(`stroke-width="${strokeWidth}"`);
    }

    // Stroke opacity
    if (data?.strokeOpacity !== undefined && data.strokeOpacity !== 1) {
        attributes.push(`stroke-opacity="${data.strokeOpacity}"`);
    }

    // Line cap
    if (data?.lineCap !== undefined && data.lineCap !== 'butt') {
        attributes.push(`stroke-linecap="${data.lineCap}"`);
    }

    // Stroke dasharray
    if (data?.strokeDasharray !== undefined) {
        attributes.push(`stroke-dasharray="${data.strokeDasharray.join(',')}"`);
    }

    return `<rect ${attributes.join(' ')} />`;
}

/**
 * Convierte un elemento circle a SVG <circle>
 */
function convertCircleToSVG(element: PatternElement): string {
    const { x, y, radius, fill, stroke, strokeWidth, data } = element;

    const attributes: string[] = [
        `cx="${x}"`,
        `cy="${y}"`,
        `r="${radius}"`,
    ];

    // Fill
    if (fill !== undefined) {
        attributes.push(`fill="${fill}"`);
    } else {
        attributes.push('fill="none"');
    }

    // Stroke
    if (stroke !== undefined) {
        attributes.push(`stroke="${stroke}"`);
    }

    // Stroke width
    if (strokeWidth !== undefined) {
        attributes.push(`stroke-width="${strokeWidth}"`);
    }

    // Stroke opacity
    if (data?.strokeOpacity !== undefined && data.strokeOpacity !== 1) {
        attributes.push(`stroke-opacity="${data.strokeOpacity}"`);
    }

    // Line cap
    if (data?.lineCap !== undefined && data.lineCap !== 'butt') {
        attributes.push(`stroke-linecap="${data.lineCap}"`);
    }

    // Stroke dasharray
    if (data?.strokeDasharray !== undefined) {
        attributes.push(`stroke-dasharray="${data.strokeDasharray.join(',')}"`);
    }

    return `<circle ${attributes.join(' ')} />`;
}

/**
 * Convierte un elemento line a SVG <line>
 */
function convertLineToSVG(element: PatternElement): string {
    const { x, y, stroke, strokeWidth, data } = element;

    const x2 = data?.x2 ?? 0;
    const y2 = data?.y2 ?? 0;

    const attributes: string[] = [
        `x1="${x}"`,
        `y1="${y}"`,
        `x2="${x2}"`,
        `y2="${y2}"`,
    ];

    // Stroke (requerido para líneas)
    if (stroke !== undefined) {
        attributes.push(`stroke="${stroke}"`);
    }

    // Stroke width
    if (strokeWidth !== undefined) {
        attributes.push(`stroke-width="${strokeWidth}"`);
    }

    // Stroke opacity
    if (data?.strokeOpacity !== undefined && data.strokeOpacity !== 1) {
        attributes.push(`stroke-opacity="${data.strokeOpacity}"`);
    }

    // Line cap
    if (data?.lineCap !== undefined && data.lineCap !== 'butt') {
        attributes.push(`stroke-linecap="${data.lineCap}"`);
    }

    // Stroke dasharray
    if (data?.strokeDasharray !== undefined) {
        attributes.push(`stroke-dasharray="${data.strokeDasharray.join(',')}"`);
    }

    return `<line ${attributes.join(' ')} />`;
}

/**
 * Convierte un elemento path a SVG <path>
 */
function convertPathToSVG(element: PatternElement): string {
    const { fill, stroke, strokeWidth, data } = element;

    const pathData = data?.d ?? '';

    const attributes: string[] = [`d="${pathData}"`];

    // Fill
    if (fill !== undefined) {
        attributes.push(`fill="${fill}"`);
    } else {
        attributes.push('fill="none"');
    }

    // Stroke
    if (stroke !== undefined) {
        attributes.push(`stroke="${stroke}"`);
    }

    // Stroke width
    if (strokeWidth !== undefined) {
        attributes.push(`stroke-width="${strokeWidth}"`);
    }

    // Stroke opacity
    if (data?.strokeOpacity !== undefined && data.strokeOpacity !== 1) {
        attributes.push(`stroke-opacity="${data.strokeOpacity}"`);
    }

    // Line cap
    if (data?.lineCap !== undefined && data.lineCap !== 'butt') {
        attributes.push(`stroke-linecap="${data.lineCap}"`);
    }

    // Stroke dasharray
    if (data?.strokeDasharray !== undefined) {
        attributes.push(`stroke-dasharray="${data.strokeDasharray.join(',')}"`);
    }

    return `<path ${attributes.join(' ')} />`;
}
