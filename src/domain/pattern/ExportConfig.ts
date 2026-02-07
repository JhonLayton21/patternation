/**
 * Configuración para exportación del patrón
 * Define opciones para diferentes formatos de salida
 * 
 * Preparado para soportar SVG, PNG en diferentes resoluciones,
 * y futuros formatos sin cambios arquitectónicos
 */
export interface ExportConfig {
    /**
     * Formato de exportación
     */
    format: 'svg' | 'png';

    /**
     * Nombre del archivo exportado (sin extensión)
     * @example 'my-pattern'
     */
    filename?: string;

    /**
     * Para PNG: multiplicador de resoluci‰ón
     * - 1x: tamaño original
     * - 2x: doble resolución
     * - 3x: triple resolución
     * @default 1
     */
    pixelRatio?: number;

    /**
     * Incluir metadatos en la salida (preparado para futura use)
     * @default false
     */
    includeMetadata?: boolean;

    /**
     * Para SVG: exportar como patrón reutilizable (<pattern> SVG element)
     * o como canvas completo
     * @default 'canvas'
     */
    svgMode?: 'canvas' | 'pattern';
}
