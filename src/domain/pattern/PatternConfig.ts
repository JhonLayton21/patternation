/**
 * Configuración para generar un patrón
 * Propiedades opcionales - valores por defecto aplicados en el generador
 */
export interface PatternConfig {
    /**
     * Tamaño del elemento base del patrón (px)
     * Para grid: tamaño de cada celda
     */
    size?: number;

    /**
     * Espacio entre elementos (px)
     * Para grid: gap entre celdas
     */
    gap?: number;

    /**
     * Color del patrón
     * Formato: hex, rgb, rgba, hsl, etc.
     */
    color?: string;

    /**
     * Ancho del canvas/área de renderizado (px)
     */
    width?: number;

    /**
     * Alto del canvas/área de renderizado (px)
     */
    height?: number;
}
