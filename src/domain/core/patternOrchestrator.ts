import {
    initializePatternRegistry,
    getPatternGenerator,
    type PatternGeneratorRegistry,
} from '../patterns';
import type { PatternState } from '../pattern/PatternState';
import type { PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternType } from '../pattern/PatternType';
import type { PatternConfig } from '../pattern/PatternConfig';
import type { SVGRenderOptions } from '../renderer/svgRenderer';
import { renderToSVG } from '../renderer/svgRenderer';

/**
 * ===== NUEVA ARQUITECTURA (V2) - ESCALABLE Y MODULAR =====
 */

/**
 * Opciones para generar un patrón SVG - Versión 2
 * Basada en PatternState (serializable, reproducible)
 */
export interface GeneratePatternSVGV2Options {
    /**
     * Estado completo del patrón
     * Contiene type, geometry, style
     */
    state: PatternState;

    /**
     * Opciones de renderizado SVG (opcionales)
     */
    renderOptions?: SVGRenderOptions;
}

/**
 * Genera un SVG a partir de PatternState
 * 
 * NUEVA API - Escalable basada en registry:
 * 1. Inicializa un registry con todos los generadores
 * 2. Busca el generador para el tipo
 * 3. Ejecuta el generador con config completa
 * 4. Renderiza a SVG
 * 
 * Ventajas:
 * - Sin switch statements que crecen infinitamente
 * - Agregar patrón = registrar generador
 * - Type-safe: PatternGenerator garantiza interfaz común
 * - Estado serializable para presets / share
 * 
 * @example
 * ```typescript
 * const state: PatternState = {
 *   type: 'grid',
 *   geometry: { cellSize: 30, gap: 5, width: 800, height: 600 },
 *   style: { strokeColor: '#FF5733', strokeWidth: 1 },
 * };
 * 
 * const svg = generatePatternSVGv2({
 *   state,
 *   renderOptions: { backgroundColor: '#F0F0F0' },
 * });
 * ```
 */
export function generatePatternSVGv2(options: GeneratePatternSVGV2Options): string {
    const { state, renderOptions } = options;

    // Inicializar registry (singleton en producción)
    const registry = initializePatternRegistry();

    // Obtener generador para el tipo
    const generator = getPatternGenerator(registry, state.type);

    // Preparar configuración del generador
    const generatorConfig: PatternGeneratorConfig = {
        geometry: state.geometry,
        style: state.style,
    };

    // Ejecutar generador
    const patternOutput = generator.generate(generatorConfig);

    // Renderizar a SVG
    const svg = renderToSVG(patternOutput, renderOptions);

    return svg;
}

/**
 * ===== API ANTIGUA (V1) - MANTENIDA POR COMPATIBILIDAD =====
 */

/**
 * Opciones para generar un patrón SVG - Versión original
 * Se mantiene por compatibilidad con código existente
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
 * Genera un SVG a partir de PatternType y PatternConfig
 * 
 * COMPATIBILIDAD: API original, mantiene funcionamiento existente
 * Internamente usa el nuevo sistema basado en registry
 * 
 * Capa de adaptación:
 * - GeneratePatternOptions (tipo, config) → PatternState (type, geometry, style)
 * - Llama a generatePatternSVGv2
 * 
 * @deprecated Usar generatePatternSVGv2 para nuevo código
 * @example
 * ```typescript
 * const svg = generatePatternSVG({
 *   type: 'grid',
 *   config: {
 *     cellSize: 30,
 *     gap: 5,
 *     strokeColor: '#FF5733',
 *   },
 *   renderOptions: { backgroundColor: '#F0F0F0' },
 * });
 * ```
 */
export function generatePatternSVG(options: GeneratePatternOptions): string {
    const { type, config, renderOptions } = options;

    // Adaptar API antigua a nueva
    // Dividir PatternConfig en geometry y style
    const geometryConfig: PatternConfig = {
        cellSize: config.cellSize,
        gap: config.gap,
        width: config.width,
        height: config.height,
    };

    const styleConfig: PatternConfig = {
        strokeColor: config.strokeColor,
        strokeWidth: config.strokeWidth,
    };

    // Crear PatternState
    const state: PatternState = {
        type,
        geometry: geometryConfig,
        style: styleConfig,
    };

    // Usar nueva función internamente
    return generatePatternSVGv2({
        state,
        renderOptions,
    });
}

/**
 * === INYECCIÓN DE DEPENDENCIAS (Opcional, para testing) ===
 */

let injectedRegistry: PatternGeneratorRegistry | null = null;

export function setPatternRegistry(registry: PatternGeneratorRegistry): void {
    injectedRegistry = registry;
}

export function getPatternRegistry(): PatternGeneratorRegistry {
    return injectedRegistry ?? initializePatternRegistry();
}
