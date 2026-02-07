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

    /**
     * Zoom level for preview (1 = 100%, 0.5 = 50%, 2 = 200%)
     * @default 1
     */
    zoom?: number;

    /**
     * Show checkerboard background for transparency
     * @default false
     */
    showCheckerboard?: boolean;
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
    zoom = 1,
    showCheckerboard = false,
}) => {
    // Generate the SVG string using the pure domain orchestrator
    let svgString = '';
    try {
        svgString = generatePatternSVG({
            type,
            config,
            renderOptions
        });
    } catch (error) {
        console.error('Failed to generate pattern:', error);
        return null;
    }

    // Combine base classes with custom className
    const containerClass = `pattern-canvas ${className || ''}`.trim();

    // Generate background style based on checkerboard toggle
    const getBackgroundStyle = () => {
        if (showCheckerboard) {
            return {
                backgroundImage: `
                    linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
                    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
                    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
                `,
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                backgroundColor: '#ffffff',
            } as React.CSSProperties;
        }
        return {};
    };

    // Render SVG with zoom and background applied
    return (
        <div
            className={containerClass}
            style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-out',
                ...getBackgroundStyle(),
            }}
            dangerouslySetInnerHTML={{ __html: svgString }}
        />
    );
};

export default PatternCanvas;
