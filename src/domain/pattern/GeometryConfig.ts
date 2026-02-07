/**
 * Configuración geométrica del patrón
 * Controla dimensiones, espaciado y disposición
 * 
 * Permitir que cada tipo de patrón interprete estos valores
 * de forma específica mientras mantiene interfaz común
 */
export interface GeometryConfig {
    /**
     * Tamaño principal del patrón (varía según tipo)
     * - Grid: tamaño de cada celda (px)
     * - Dots: diámetro del punto (px)
     * - Waves: amplitud de la onda (px)
     * @default 20
     */
    cellSize?: number;

    /**
     * Espacio entre elementos (varía según tipo)
     * - Grid: gap entre celdas (px)
     * - Dots: espacios entre puntos (px)
     * - Waves: distancia entre ondas (px)
     * @default 0
     */
    gap?: number;

    /**
     * Ancho del canvas/área de renderizado (px)
     * @default 800
     */
    width?: number;

    /**
     * Alto del canvas/área de renderizado (px)
     * @default 600
     */
    height?: number;
}
