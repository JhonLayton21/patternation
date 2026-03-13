/**
 * ControlPanel Component
 *
 * Organiza todos los controles existentes en 4 secciones claras:
 * - Pattern Type
 * - Geometry (cellSize, gap)
 * - Style (strokeColor)
 * - Export (PNG size, buttons)
 *
 * Props son callbacks, este componente es "presentational" y scanneable
 */

import React from "react";
import type { PatternConfig } from "@/domain/pattern/PatternConfig";
import type { PatternType } from "@/domain/pattern/PatternType";
import type { PatternState } from "@/domain/presets";
import { PresetsPanel } from "./PresetsPanel";
import { RandomizePanel } from "./RandomizePanel";
import { ExportPanel } from "./ExportPanel";
import { HistoryPanel } from "./HistoryPanel";
import { SharePanel } from "./SharePanel";
import { CodePanel } from "./CodePanel";
import type { UsePatternHistoryResult } from "@/hooks/usePatternHistory";
import type { UseShareURLResult } from "@/hooks/useShareURL";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";

export interface ControlPanelProps {
  activeType: PatternType;
  config: PatternConfig;
  exportWidth: number;
  exportHeight: number;
  onTypeChange: (type: PatternType) => void;
  onCellSizeChange: (value: number) => void;
  onGapChange: (value: number) => void;
  onStrokeColorChange: (value: string) => void;
  onStrokeWidthChange: (value: number) => void;
  onStrokeOpacityChange: (value: number) => void;
  onLineCapChange: (value: "butt" | "round" | "square") => void;
  onDashPatternChange: (pattern: "solid" | "dashed" | "dotted") => void;
  onBackgroundColorChange: (value: string | undefined) => void;
  onExportWidthChange: (value: number) => void;
  onExportHeightChange: (value: number) => void;
  onDownloadSVG: () => void;
  onDownloadPNG: () => void;
  isExporting?: boolean;
  currentState?: PatternState;
  onLoadPreset?: (state: PatternState) => void;
  onRandomize?: (state: PatternState, seed: string) => void;
  // PHASE 7: Advanced features
  history?: UsePatternHistoryResult;
  share?: UseShareURLResult;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  activeType,
  config,
  exportWidth,
  exportHeight,
  onTypeChange,
  onCellSizeChange,
  onGapChange,
  onStrokeColorChange,
  onStrokeWidthChange,
  onStrokeOpacityChange,
  onLineCapChange,
  onDashPatternChange,
  onBackgroundColorChange,
  onExportWidthChange,
  onExportHeightChange,
  onDownloadSVG,
  onDownloadPNG,
  isExporting = false,
  currentState,
  onLoadPreset,
  onRandomize,
  history,
  share,
}) => {
  return (
    <div className="control-panel">
      {/* SECTION: Code Panel (top right toolbar) */}
      {currentState && (
        <div className="control-toolbar">
          <CodePanel
            patternType={activeType}
            config={config}
            width={exportWidth}
            height={exportHeight}
          />
        </div>
      )}

      {/* SECTION: Presets */}
      {currentState && onLoadPreset && (
        <>
          <PresetsPanel
            currentState={currentState}
            onLoadPreset={onLoadPreset}
          />
          <div className="section-divider"></div>
        </>
      )}

      {/* SECTION: Randomize */}
      {currentState && onRandomize && (
        <>
          <RandomizePanel
            currentState={currentState}
            onRandomize={onRandomize}
          />
          <div className="section-divider"></div>
        </>
      )}

      {/* SECTION: Pattern type */}
      <section className="control-section">
        <h3 className="section-title">Pattern</h3>

        <div className="control-group">
          <label
            htmlFor="pattern-select"
            className="control-label block mb-2 text-sm text-zinc-300"
          >
            Type
          </label>

          <Select
            value={activeType}
            onValueChange={(value) => onTypeChange(value as PatternType)}
          >
            <SelectTrigger
              id="pattern-select"
              className="
          w-full
          bg-zinc-900
          text-zinc-200
          border-zinc-700
          text-sm
          hover:border-zinc-600
          focus:ring-zinc-500
        "
            >
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>

            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-200">
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="dots">Dots</SelectItem>
              <SelectItem value="diagonalGrid">Diagonal Grid</SelectItem>
              <SelectItem value="isometric">Isometric</SelectItem>
              <SelectItem value="zigzag">Zig-zag</SelectItem>
              <SelectItem value="waves">Waves</SelectItem>
              <SelectItem value="cross">Cross</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: Geometry */}
      <section className="control-section">
        <h3 className="section-title">Geometry</h3>

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="size-slider" className="control-label">
              Cell Size
            </label>
            <span className="control-value">{config.cellSize ?? 20}px</span>
          </div>

          <Slider
            id="size-slider"
            min={5}
            max={100}
            step={1}
            value={[config.cellSize ?? 20]}
            onValueChange={(value) => onCellSizeChange(value[0])}
            className="control-input w-full"
          />
        </div>

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="gap-slider" className="control-label">
              Gap
            </label>
            <span className="control-value">{config.gap ?? 0}px</span>
          </div>

          <Slider
            id="gap-slider"
            min={0}
            max={50}
            step={1}
            value={[config.gap ?? 0]}
            onValueChange={(value) => onGapChange(value[0])}
            className="control-input w-full"
          />
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: Style */}
      <section className="control-section">
        <h3 className="section-title">Style</h3>

        <div className="control-group">
          <label htmlFor="color-picker" className="control-label">
            Stroke Color
          </label>
          <div className="color-picker-wrapper">
            <input
              id="color-picker"
              type="color"
              value={config.strokeColor ?? "#000000"}
              onChange={(e) => onStrokeColorChange(e.target.value)}
              className="control-input color-input"
            />
            <span className="color-value">
              {config.strokeColor ?? "#000000"}
            </span>
          </div>
        </div>

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="stroke-width-slider" className="control-label">
              Stroke Width
            </label>
            <span className="control-value">{config.strokeWidth ?? 1}px</span>
          </div>

          <Slider
            id="stroke-width-slider"
            min={0.5}
            max={10}
            step={0.5}
            value={[config.strokeWidth ?? 1]}
            onValueChange={(value) => onStrokeWidthChange(value[0])}
            className="control-input w-full"
          />
        </div>

        <div className="control-group">
          <div className="control-header">
            <label htmlFor="stroke-opacity-slider" className="control-label">
              Opacity
            </label>
            <span className="control-value">
              {Math.round((config.strokeOpacity ?? 1) * 100)}%
            </span>
          </div>

          <Slider
            id="stroke-opacity-slider"
            min={0}
            max={1}
            step={0.05}
            value={[config.strokeOpacity ?? 1]}
            onValueChange={(value) => onStrokeOpacityChange(value[0])}
            className="control-input w-full"
          />
        </div>

        <div className="control-group">
          <label
            htmlFor="line-cap-select"
            className="control-label block mb-2 text-sm text-zinc-300"
          >
            Line Cap
          </label>

          <Select
            value={config.lineCap ?? "butt"}
            onValueChange={(value) =>
              onLineCapChange(value as "butt" | "round" | "square")
            }
          >
            <SelectTrigger
              id="line-cap-select"
              className="w-full bg-zinc-900 text-zinc-200 border-zinc-700 text-sm hover:border-zinc-600 focus:ring-zinc-500"
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-200">
              <SelectItem value="butt">Butt (Flat)</SelectItem>
              <SelectItem value="round">Round</SelectItem>
              <SelectItem value="square">Square</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="control-group">
          <label
            htmlFor="dash-pattern-select"
            className="control-label block mb-2 text-sm text-zinc-300"
          >
            Line Style
          </label>

          <Select
            value={(() => {
              if (!config.strokeDasharray) return "solid";
              if (
                JSON.stringify(config.strokeDasharray) ===
                JSON.stringify([5, 5])
              )
                return "dashed";
              if (
                JSON.stringify(config.strokeDasharray) ===
                JSON.stringify([2, 3])
              )
                return "dotted";
              return "solid";
            })()}
            onValueChange={(value) => {
              const val = value as "solid" | "dashed" | "dotted";
              onDashPatternChange(val);
            }}
          >
            <SelectTrigger
              id="dash-pattern-select"
              className="w-full bg-zinc-900 text-zinc-200 border-zinc-700 text-sm hover:border-zinc-600 focus:ring-zinc-500"
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-200">
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="dashed">Dashed</SelectItem>
              <SelectItem value="dotted">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="control-group">
          <label htmlFor="bg-color-picker" className="control-label">
            Background
          </label>
          <div className="color-picker-wrapper">
            <input
              id="bg-color-picker"
              type="color"
              value={config.backgroundColor ?? "#ffffff"}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="control-input color-input"
            />
            <button
              onClick={() => onBackgroundColorChange(undefined)}
              className="btn btn-small btn-secondary"
              title="Make background transparent"
            >
              × Transparent
            </button>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: Export */}
      <ExportPanel
        patternType={activeType}
        config={config}
        exportWidth={exportWidth}
        exportHeight={exportHeight}
        isExporting={isExporting}
      />

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: History (Undo/Redo) */}
      {history && <HistoryPanel history={history} />}

      {/* DIVIDER */}
      <div className="section-divider"></div>

      {/* SECTION: Share */}
      {share && <SharePanel share={share} />}
    </div>
  );
};

export default ControlPanel;
