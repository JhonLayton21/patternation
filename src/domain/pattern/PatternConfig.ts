/**
 * Configuración para generar un patrón
 * Propiedades opcionales - valores por defecto aplicados en el generador
 */
export interface PatternConfig {
    /**
     * Tamaño de cada celda del patrón (px)
     * Para grid: tamaño de cada celda
     */
    cellSize?: number;

    /**
     * Espacio entre elementos (px)
     * Para grid: gap entre celdas
     */
    gap?: number;

    /**
     * Color del borde/trazo del patrón
     * Formato: hex, rgb, rgba, hsl, etc.
     */
    strokeColor?: string;

    /**
     * Grosor del borde/trazo (px)
     */
    strokeWidth?: number;

    /**
     * Ancho del canvas/área de renderizado (px)
     */
    width?: number;

    /**
     * Alto del canvas/área de renderizado (px)
     */
    height?: number;
}
