/**
 * Elemento individual del patrón
 * Representación abstracta, agnóstica del medio de renderizado
 */
export interface PatternElement {
    /**
     * Tipo de forma geométrica
     */
    shape: 'rectangle' | 'circle' | 'line' | 'path';

    /**
     * Posición X del elemento
     */
    x: number;

    /**
     * Posición Y del elemento
     */
    y: number;

    /**
     * Ancho del elemento (si aplica)
     */
    width?: number;

    /**
     * Alto del elemento (si aplica)
     */
    height?: number;

    /**
     * Radio del elemento (si aplica para círculos)
     */
    radius?: number;

    /**
     * Color de relleno
     */
    fill?: string;

    /**
     * Color de borde
     */
    stroke?: string;

    /**
     * Grosor del borde
     */
    strokeWidth?: number;

    /**
     * Datos adicionales específicos del tipo de forma
     * Para paths, líneas, etc.
     */
    data?: Record<string, unknown>;
}

/**
 * Salida del generador de patrones
 * Estructura de datos pura, completamente agnóstica del medio de renderizado
 */
export interface PatternOutput {
    /**
     * Lista de elementos que componen el patrón
     */
    elements: PatternElement[];

    /**
     * Dimensiones del patrón generado
     */
    dimensions: {
        width: number;
        height: number;
    };

    /**
     * Metadata opcional del patrón generado
     */
    metadata?: {
        /**
         * Número total de elementos generados
         */
        elementCount: number;

        /**
         * Timestamp de generación
         */
        generatedAt?: number;

        /**
         * Información adicional
         */
        [key: string]: unknown;
    };
}
