/**
 * Configuración de estilo visual del patrón
 * Separado de la geometría para claridad y escalabilidad
 * 
 * Esto permite que diferentes tipos de patrones usen
 * la misma configuración de estilo sin duplicación
 */
export interface StyleConfig {
    /**
     * Color del borde/trazo del patrón
     * Formato: hex, rgb, rgba, hsl, etc.
     * @default '#000000'
     */
    strokeColor?: string;

    /**
     * Grosor del borde/trazo (px)
     * @default 1
     */
    strokeWidth?: number;

    /**
     * Opacidad del trazo (0-1)
     * @default 1
     */
    strokeOpacity?: number;

    /**
     * Estilo del extremo de las líneas
     * @default 'butt'
     */
    lineCap?: 'butt' | 'round' | 'square';

    /**
     * Patrón de línea discontinua
     * Array de números: [longitud trazo, longitud espacio]
     * @example [5, 5] crea línea punteada
     * @default undefined (línea sólida)
     */
    strokeDasharray?: number[];

    /**
     * Color de relleno del patrón
     * Si no se especifica, el patrón es transparente
     * @default undefined
     */
    backgroundColor?: string;

    /**
     * Opacidad del fondo (0-1)
     * @default 1
     */
    backgroundOpacity?: number;
}
