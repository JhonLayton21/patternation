'use client';

/**
 * PHASE 4: Preset Manager Hook
 * 
 * Gestiona:
 * - Carga de presets predefinidos
 * - Persistencia en localStorage
 * - CRUD básico (create, read, delete)
 */

import { useEffect, useState, useCallback } from 'react';
import { DEFAULT_PRESETS, type PresetConfig, type PatternState, type PresetStore } from '@/domain/presets';

const STORAGE_KEY = 'patternation_presets';
const STORAGE_VERSION = 2;

/**
 * Hook para gestionar presets
 * 
 * Retorna:
 * - allPresets: Lista de todos (predefinidos + guardados)
 * - customPresets: Solo los guardados por usuario
 * - loadPreset: Cargar un preset y retornar su config
 * - savePreset: Guardar nuevo preset personalizado
 * - deletePreset: Eliminar un preset personalizado
 */
export function usePresetManager() {
  const [customPresets, setCustomPresets] = useState<PresetConfig[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar presets guardados del localStorage la primera vez
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: PresetStore = JSON.parse(stored);
          if (data.version === STORAGE_VERSION) {
            setCustomPresets(data.presets.filter(p => !p.predefined));
          }
        }
      } catch (error) {
        console.warn('Failed to load presets from localStorage:', error);
      }
      setIsLoaded(true);
    };

    loadFromStorage();
  }, []);

  // Guardar a localStorage cuando cambie customPresets
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const store: PresetStore = {
        version: STORAGE_VERSION,
        presets: [...DEFAULT_PRESETS, ...customPresets]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.warn('Failed to save presets to localStorage:', error);
    }
  }, [customPresets, isLoaded]);

  // Todos los presets: predefinidos + guardados
  const allPresets = [...DEFAULT_PRESETS, ...customPresets];

  /**
   * Cargar un preset: retorna su configuración
   */
  const loadPreset = useCallback((presetId: string): PatternState | null => {
    const preset = allPresets.find(p => p.id === presetId);
    return preset ? preset.config : null;
  }, [allPresets]);

  /**
   * Guardar nuevo preset personalizado
   */
  const savePreset = useCallback((name: string, config: PatternState): PresetConfig => {
    const newPreset: PresetConfig = {
      id: `preset-custom-${Date.now()}`,
      name,
      version: STORAGE_VERSION,
      predefined: false,
      config,
      createdAt: Date.now()
    };

    setCustomPresets(prev => [...prev, newPreset]);
    return newPreset;
  }, []);

  /**
   * Eliminar un preset personalizado
   */
  const deletePreset = useCallback((presetId: string): boolean => {
    // No se pueden borrar presets predefinidos
    if (DEFAULT_PRESETS.some(p => p.id === presetId)) {
      return false;
    }

    setCustomPresets(prev => prev.filter(p => p.id !== presetId));
    return true;
  }, []);

  /**
   * Está listo para usar? (localStorage loaded)
   */
  const ready = isLoaded;

  return {
    allPresets,
    customPresets,
    loadPreset,
    savePreset,
    deletePreset,
    ready
  };
}
