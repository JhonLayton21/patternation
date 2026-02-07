/**
 * USAGE EXAMPLES - Patternation v2 Architecture
 * 
 * Ejemplos prácticos de cómo usar el nuevo sistema
 * desde perspectivas diferentes (React, core, testing)
 */

---

## 1. USO EN COMPONENTES REACT (v1 - Compatible)

```typescript
import React, { useState } from 'react';
import PatternCanvas from '../components/PatternCanvas';
import type { PatternConfig } from '../domain/pattern';

export function MyPattern() {
  const [config, setConfig] = useState<PatternConfig>({
    cellSize: 30,
    gap: 5,
    strokeColor: '#000000',
    strokeWidth: 1,
    width: 400,
    height: 400,
  });

  return (
    <div>
      <PatternCanvas
        type="grid"
        config={config}
        renderOptions={{ backgroundColor: '#FFFFFF' }}
      />
      <button onClick={() => setConfig({ ...config, cellSize: 40 })}>
        Increase Size
      </button>
    </div>
  );
}
```

**Notas**:
- El componente sigue usando PatternConfig (API v1)
- Internamente, PatternCanvas llama a `generatePatternSVG()`
- El orquestador adapta a PatternState automáticamente
- **No hay cambios necesarios en código React existente**

---

## 2. USO CON NUEVA API v2 (Directo con PatternState)

```typescript
import { generatePatternSVGv2 } from '../domain/core/patternOrchestrator';
import type { PatternState } from '../domain/pattern';

// Crear estado del patrón
const gridState: PatternState = {
  type: 'grid',
  geometry: {
    cellSize: 30,
    gap: 5,
    width: 800,
    height: 600,
  },
  style: {
    strokeColor: '#FF5733',
    strokeWidth: 2,
    strokeOpacity: 1,
    backgroundColor: '#FFFFFF',
  },
};

// Generar SVG
const svg = generatePatternSVGv2({
  state: gridState,
  renderOptions: {
    backgroundColor: '#F0F0F0',
  },
});

// Usar el SVG
document.getElementById('pattern').innerHTML = svg;
```

**Ventajas de PatternState**:
- Serializable a JSON (para presets, share, localStorage)
- Reproducible: same state = same pattern (determinista)
- Explícito: geometry y style separados

---

## 3. GUARDAR Y RESTAURAR PRESETS (Usando PatternState)

```typescript
import type { PatternState } from '../domain/pattern';
import { createPatternState } from '../domain/pattern';

// Guardar preset a localStorage
function savePreset(name: string, state: PatternState) {
  const preset = {
    name,
    createdAt: Date.now(),
    state,
  };
  
  const presets = JSON.parse(localStorage.getItem('patternPresets') || '[]');
  presets.push(preset);
  localStorage.setItem('patternPresets', JSON.stringify(presets));
}

// Cargar preset desde localStorage
function loadPreset(name: string): PatternState | null {
  const presets = JSON.parse(localStorage.getItem('patternPresets') || '[]');
  const preset = presets.find((p: any) => p.name === name);
  return preset?.state ?? null;
}

// Uso
const myPattern: PatternState = {
  type: 'grid',
  geometry: { cellSize: 30, gap: 5, width: 800, height: 600 },
  style: { strokeColor: '#000', strokeWidth: 1 },
};

savePreset('My Notebook Grid', myPattern);

// Más tarde...
const loaded = loadPreset('My Notebook Grid');
if (loaded) {
  const svg = generatePatternSVGv2({ state: loaded });
}
```

**Clave**: PatternState es completamente serializable, sin funciones ni clases.

---

## 4. IMPLEMENTAR UN NUEVO PATRÓN (Dots)

```typescript
// src/domain/patterns/dots.ts

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput } from '../pattern/PatternOutput';
import type { GeometryConfig } from '../pattern/GeometryConfig';
import type { StyleConfig } from '../pattern/StyleConfig';

const DOTS_DEFAULTS = {
  geometry: {
    cellSize: 10,      // diámetro del punto
    gap: 5,            // espacio entre puntos
    width: 800,
    height: 600,
  } as Required<GeometryConfig>,
  style: {
    strokeColor: '#000000',
    strokeWidth: 0,
    strokeOpacity: 1,
    backgroundColor: undefined,
    backgroundOpacity: 1,
  } as Required<StyleConfig>,
};

function generateDotsPattern(config: PatternGeneratorConfig): PatternOutput {
  const geometry = {
    cellSize: config.geometry.cellSize ?? DOTS_DEFAULTS.geometry.cellSize,
    gap: config.geometry.gap ?? DOTS_DEFAULTS.geometry.gap,
    width: config.geometry.width ?? DOTS_DEFAULTS.geometry.width,
    height: config.geometry.height ?? DOTS_DEFAULTS.geometry.height,
  };

  const style = {
    strokeColor: config.style.strokeColor ?? DOTS_DEFAULTS.style.strokeColor,
    // ... merge de todos los estilos
  };

  const { cellSize, gap, width, height } = geometry;
  const dotStep = cellSize + gap;

  const elements = [];
  const cols = Math.floor(width / dotStep);
  const rows = Math.floor(height / dotStep);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      elements.push({
        shape: 'circle',
        x: col * dotStep + cellSize / 2,
        y: row * dotStep + cellSize / 2,
        radius: cellSize / 2,
        fill: style.strokeColor,
      });
    }
  }

  return {
    elements,
    dimensions: { width, height },
    metadata: {
      elementCount: elements.length,
      generatedAt: Date.now(),
    },
  };
}

export const dotsPatternGenerator: PatternGenerator = {
  type: 'dots',
  defaults: DOTS_DEFAULTS,
  generate: generateDotsPattern,
};
```

Luego registrar en `patterns/index.ts`:

```typescript
import { dotsPatternGenerator } from './dots';

export function initializePatternRegistry() {
  const registry = new Map();
  registerGenerator(registry, gridPatternGenerator);
  registerGenerator(registry, dotsPatternGenerator);  // ← Agregar
  return registry;
}
```

Y actualizar `PatternType.ts`:

```typescript
export type PatternType = 'grid' | 'dots' | 'waves' | 'noise';
```

**¡Eso es todo!** Ahora funciona:

```typescript
const dotsPattern: PatternState = {
  type: 'dots',
  geometry: { cellSize: 15, gap: 5, width: 400, height: 400 },
  style: { strokeColor: '#FF0000' },
};

const svg = generatePatternSVGv2({ state: dotsPattern });
```

---

## 5. TESTING - Generador aislado

```typescript
// __tests__/patterns/grid.test.ts

import { describe, it, expect } from 'vitest';
import { gridPatternGenerator } from '../src/domain/patterns/grid';
import type { PatternGeneratorConfig } from '../src/domain/pattern';

describe('gridPatternGenerator', () => {
  it('should generate grid pattern from config', () => {
    const config: PatternGeneratorConfig = {
      geometry: {
        cellSize: 30,
        gap: 5,
        width: 300,
        height: 300,
      },
      style: {
        strokeColor: '#000000',
        strokeWidth: 1,
      },
    };

    const output = gridPatternGenerator.generate(config);

    expect(output.elements.length).toBeGreaterThan(0);
    expect(output.dimensions).toEqual({ width: 300, height: 300 });
    expect(output.metadata?.elementCount).toBe(output.elements.length);
  });

  it('should use default values when config is empty', () => {
    const output = gridPatternGenerator.generate({
      geometry: {},
      style: {},
    });

    expect(output.dimensions.width).toBe(800);
    expect(output.dimensions.height).toBe(600);
    expect(output.elements[0].strokeWidth).toBe(1);
  });

  it('should handle custom style correctly', () => {
    const output = gridPatternGenerator.generate({
      geometry: { width: 100, height: 100 },
      style: { strokeColor: '#FF0000', strokeWidth: 2 },
    });

    output.elements.forEach((el) => {
      expect(el.stroke).toBe('#FF0000');
      expect(el.strokeWidth).toBe(2);
    });
  });
});
```

**Ventajas**:
- Generador testeado aisladamente
- No necesita orquestador ni renderer
- Pruebas rápidas y enfocadas

---

## 6. TESTING - Integración completa

```typescript
// __tests__/integration/complete-flow.test.ts

import { describe, it, expect } from 'vitest';
import { generatePatternSVGv2 } from '../src/domain/core';
import type { PatternState } from '../src/domain/pattern';

describe('Complete flow: State → Generador → Renderer → SVG', () => {
  it('should produce valid SVG from PatternState', () => {
    const state: PatternState = {
      type: 'grid',
      geometry: {
        cellSize: 20,
        gap: 5,
        width: 200,
        height: 200,
      },
      style: {
        strokeColor: '#000000',
        strokeWidth: 1,
      },
    };

    const svg = generatePatternSVGv2({ state });

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('xmlns=');
    expect(svg).toContain('<rect');  // grid usa rectangles
    expect(svg).toContain('stroke="#000000"');
  });

  it('should handle render options', () => {
    const state: PatternState = {
      type: 'grid',
      geometry: { width: 100, height: 100 },
      style: { strokeColor: '#000' },
    };

    const svg = generatePatternSVGv2({
      state,
      renderOptions: { backgroundColor: '#FFFFFF' },
    });

    expect(svg).toContain('fill="#FFFFFF"');
  });
});
```

---

## 7. CÓDIGO LEGADO vs NUEVO

### Código Legado (sigue funcionando)

```typescript
// Esto sigue siendo válido en Patternation v2
import usePattern {patternOrchestrator}

generatePatternSVG({
  type: 'grid',
  config: {
    cellSize: 30,
    gap: 5,
    strokeColor: '#000',
    width: 800,
    height: 600,
  },
});
```

### Código Nuevo (recomendado para nueva logica)

```typescript
import { generatePatternSVGv2 } from '@/domain/core';
import type { PatternState } from '@/domain/pattern';

const state: PatternState = {
  type: 'grid',
  geometry: {
    cellSize: 30,
    gap: 5,
    width: 800,
    height: 600,
  },
  style: {
    strokeColor: '#000',
    strokeWidth: 1,
  },
};

generatePatternSVGv2({ state });
```

---

## 8. MIGRACIÓN GRADUAL

No es necesario migrar todo de once. El plan:

1. **Inmediato**: PatternCanvas sigue usando v1 (sin cambios)
2. **FASE 2**: Cuando implementamos más estilos, usar StyleConfig en nuevos features
3. **FASE 3**: Al agregar nuevos patrones, usar PatternGenerator directamente
4. **FASE 4**: Presets usan PatternState (completamente serializable)
5. **Futuro**: Deprecar PatternConfig cuando todo esté migrado

---

Fin del documento.
