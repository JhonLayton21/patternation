'use client';

/**
 * PHASE 4: PresetsPanel Component
 * 
 * UI para cargar, guardar y gestionar presets
 * Se integra en el ControlPanel
 */

import React, { useState } from 'react';
import { usePresetManager } from '@/hooks/usePresetManager';
import type { PatternState } from '@/domain/presets';
import { Button } from '@/components/ui/button';

export interface PresetsPanelProps {
  currentState: PatternState;
  onLoadPreset: (state: PatternState) => void;
}

export const PresetsPanel: React.FC<PresetsPanelProps> = ({
  currentState,
  onLoadPreset
}) => {
  const { allPresets, customPresets, loadPreset, savePreset, deletePreset, ready } = usePresetManager();
  const [saveInputValue, setSaveInputValue] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleLoadPreset = (presetId: string) => {
    const state = loadPreset(presetId);
    if (state) {
      onLoadPreset(state);
    }
  };

  const handleSavePreset = () => {
    const name = saveInputValue.trim();
    if (!name) return;

    savePreset(name, currentState);
    setSaveInputValue('');
    setShowSaveInput(false);
  };

  const handleDeletePreset = (presetId: string) => {
    if (confirm(`¿Eliminar preset?`)) {
      deletePreset(presetId);
    }
  };

  if (!ready) {
    return <div className="control-section">Cargando presets...</div>;
  }

  return (
    <section className="control-section">
      <h3 className="section-title">Presets</h3>

      {/* Load Preset Dropdown */}
      <div className="control-group">
        <label htmlFor="preset-select" className="control-label">
          Load Preset
        </label>
        <select
          id="preset-select"
          onChange={(e) => {
            if (e.target.value) {
              handleLoadPreset(e.target.value);
              e.target.value = '';
            }
          }}
          className="control-input select-input"
          defaultValue=""
        >
          <option value="">Selecciona un preset...</option>
          {allPresets.map(preset => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
              {!preset.predefined ? ' (custom)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Save Preset */}
      <div className="control-group">
        {!showSaveInput ? (
          <Button
            onClick={() => setShowSaveInput(true)}
            className="button button-secondary"
            style={{ width: '100%' }}
          >
            Guardar como Preset
          </Button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Nombre del preset..."
              value={saveInputValue}
              onChange={(e) => setSaveInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePreset();
                if (e.key === 'Escape') {
                  setSaveInputValue('');
                  setShowSaveInput(false);
                }
              }}
              className="control-input"
              autoFocus
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSavePreset}
              className="button button-primary"
              style={{ flex: '0 0 auto' }}
            >
              ✓
            </button>
            <button
              onClick={() => {
                setSaveInputValue('');
                setShowSaveInput(false);
              }}
              className="button button-secondary"
              style={{ flex: '0 0 auto' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Custom Presets List */}
      {customPresets.length > 0 && (
        <div className="control-group" style={{ marginTop: '1rem' }}>
          <label className="control-label">Mis Presets</label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {customPresets.map(preset => (
              <div
                key={preset.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}
              >
                <span>{preset.name}</span>
                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="button button-danger"
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem'
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
