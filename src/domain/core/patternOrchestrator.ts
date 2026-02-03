import type { PatternType } from '../pattern/PatternType';
import type { PatternConfig } from '../pattern/PatternConfig';
import type { SVGRenderOptions } from '../renderer/svgRenderer';
import { generateGridPattern } from '../pattern/generators/gridPattern';
import { renderToSVG } from '../renderer/svgRenderer';

/**
 * Opciones para generar un patrón SVG completo
 */
export interface GeneratePatternOptions {
    /**
     * Tipo de patrón a generar
     */
    type: PatternType;

    /**
     * Configuración del patrón
     */
    config: PatternConfig;

    /**
     * Opciones de renderizado SVG (opcionales)
     */
    renderOptions?: SVGRenderOptions;
}

/**
 * Orquestador principal que coordina la generación de patrones y renderizado SVG
 * 
 * Función pura que:
 * 1. Selecciona el generador apropiado según el tipo
 * 2. Ejecuta el generador con la configuración
 * 3. Renderiza el resultado a SVG
 * 4. Retorna el string SVG final
 * 
 * @param options - Opciones de generación (tipo, config, renderOptions)
 * @returns String SVG válido listo para usar
 * @throws Error si el tipo de patrón no está implementado
 * 
 * @example
 * ```typescript
 * const svg = generatePatternSVG({
 *   type: 'grid',
 *   config: {
 *     cellSize: 30,
 *     gap: 5,
 *     strokeColor: '#FF5733',
 *   },
 *   renderOptions: {
 *     backgroundColor: '#F0F0F0',
 *   },
 * });
 * ```
 */
export function generatePatternSVG(options: GeneratePatternOptions): string {
    const { type, config, renderOptions } = options;

    // Seleccionar y ejecutar el generador apropiado
    const patternOutput = selectAndExecuteGenerator(type, config);

    // Renderizar a SVG
    const svg = renderToSVG(patternOutput, renderOptions);

    return svg;
}

/**
 * Selecciona y ejecuta el generador apropiado según el tipo de patrón
 * 
 * @param type - Tipo de patrón
 * @param config - Configuración del patrón
 * @returns PatternOutput generado
 * @throws Error si el tipo no está implementado
 */
function selectAndExecuteGenerator(
    type: PatternType,
    config: PatternConfig
) {
    switch (type) {
        case 'grid':
            return generateGridPattern(config);

        case 'dots':
            throw new Error(`Pattern type "dots" is not implemented`);

        case 'waves':
            throw new Error(`Pattern type "waves" is not implemented`);

        case 'noise':
            throw new Error(`Pattern type "noise" is not implemented`);

        default:
            // TypeScript exhaustiveness check
            const exhaustiveCheck: never = type;
            throw new Error(`Pattern type "${exhaustiveCheck}" is not implemented`);
    }
}
