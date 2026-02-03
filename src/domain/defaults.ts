import type { PatternConfig } from '../pattern/PatternConfig';
import type { GeneratePatternOptions } from '../core/patternOrchestrator';

/**
 * Configuración base inicial para el MVP
 * - Representa un grid pattern simple y limpio
 * - Valores fijos y deterministas (no random)
 * - Cumple estrictamente con PatternConfig
 */
export const defaultPatternConfig: PatternConfig = {
    // Tamaño balanceado para visibilidad
    cellSize: 40,

    // Grid perfecto (sin separación inicial)
    gap: 0,

    // Color neutro (negro)
    strokeColor: '#000000',

    // Trazo fino
    strokeWidth: 1,

    // Dimensiones estándar
    width: 800,
    height: 600,
};

/**
 * Estado inicial completo para la generación
 * Útil para inicializar estados en React
 */
export const initialPatternState: GeneratePatternOptions = {
    type: 'grid',
    config: defaultPatternConfig,
    renderOptions: {
        // Fondo blanco por defecto para asegurar contraste
        backgroundColor: '#FFFFFF',
    },
};
