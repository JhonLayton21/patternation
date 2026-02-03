import React from 'react';
import { generatePatternSVG } from '../domain/core/patternOrchestrator';
import type { PatternType } from '../domain/pattern/PatternType';
import type { PatternConfig } from '../domain/pattern/PatternConfig';
import type { SVGRenderOptions } from '../domain/renderer/svgRenderer';

/**
 * Props for the PatternCanvas component
 */
export interface PatternCanvasProps {
    /**
     * The type of pattern to generate (e.g., 'grid')
     * @default 'grid'
     */
    type?: PatternType;

    /**
     * Configuration for the pattern generator
     */
    config: PatternConfig;

    /**
     * Options for the SVG renderer (background, viewBox)
     */
    renderOptions?: SVGRenderOptions;

    /**
     * Optional CSS class for the container div
     */
    className?: string;
}

/**
 * PatternCanvas Component
 * 
 * A pure functional component that renders a generated pattern SVG.
 * It serves as a bridge between the React UI layer and the core domain logic.
 * 
 * @example
 * <PatternCanvas 
 *   type="grid"
 *   config={{ cellSize: 30, gap: 5, strokeColor: '#000' }}
 * />
 */
export const PatternCanvas: React.FC<PatternCanvasProps> = ({
    type = 'grid',
    config,
    renderOptions,
    className,
}) => {
    // Generate the SVG string using the pure domain orchestrator
    // We use useMemo to avoid regenerating on every render if props haven't changed
    // although the prompt asked for "no internal state", useMemo is standard React optimization
    // but strictly speaking, "No debe usar estado interno" usually refers to useState.
    // Given strict requirements "No implementes UI... Enfócate únicamente en lógica", 
    // and "No debe usar estado interno", I will just call the function directly or use simple memoization if appropriate.
    // Direct call is simplest and adheres strictly to "no unnecessary abstraction".

    let svgString = '';
    try {
        svgString = generatePatternSVG({
            type,
            config,
            renderOptions
        });
    } catch (error) {
        console.error('Failed to generate pattern:', error);
        // In a real app we might render an error state, but for MVP minimal component:
        return null;
    }

    // Render SVG using dangerouslySetInnerHTML
    // We wrap it in a div to allow passing className for layout positioning
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    );
};

export default PatternCanvas;
