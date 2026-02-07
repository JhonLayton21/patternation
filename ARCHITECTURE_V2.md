/**
 * ARCHITECTURE v2 - Patternation Base Layer
 * 
 * Documento completo que define la arquitectura escalable de Patternation v2
 * Explica decisiones, flujos y cómo extender el sistema
 */

## 1. PRINCIPIOS ARQUITECTÓNICOS

### 1.1 Separación de Concernos
- **Generadores**: Lógica pura de creación de patrones, agnóstica del medio
- **Renderer**: Convierte datos abstractos a formatos específicos (SVG, PNG, etc.)
- **Orquestador**: Coordina generadores y renderers sin lógica específica de patrón
- **Estado**: Datos serializables que representan un patrón

### 1.2 Type Safety
- Interfaces bien definidas en cada capa
- TypeScript garantiza compatibilidad entre componentes
- Errores en compile-time, no en runtime

### 1.3 Escalabilidad sin Refactor
- Agregar un patrón NO requiere cambios al orquestador
- Nuevos formatos de export NO requieren cambios a generadores
- Registry centralizado permite inyección dinámica

### 1.4 Pureza Funcional
- Generadores: funciones puras (no mutan, son determinísticas)
- Renderer: función pura (SVG = f(PatternOutput))
- Orquestador: coordina puras funciones

---

## 2. ESTRUCTURA DE CARPETAS

```
src/domain/
├── pattern/
│   ├── StyleConfig.ts          ← Interfaz: estilos visuales
│   ├── GeometryConfig.ts       ← Interfaz: geometría
│   ├── ExportConfig.ts         ← Interfaz: configuración de export
│   ├── PatternGeneratorTypes.ts ← Interfaz: PatternGenerator registry
│   ├── PatternState.ts         ← Interfaz: estado serializable
│   ├── PatternConfig.ts        ← Compatibilidad (combina geometry + style)
│   ├── Pattern.ts              ← Entidad (id, name, type, config)
│   ├── PatternOutput.ts        ← Salida agnóstica del generador
│   ├── PatternType.ts          ← Union de tipos disponibles
│   ├── index.ts                ← Exporta interfaces principales
│   └── generators/
│       ├── gridPattern.ts      ← DEPRECATED: wrapper del nuevo sistema
│       ├── gridPattern.test.ts ← Tests de compatibilidad
│       └── index.ts            ← DEPRECATED: exports antiguos
│
├── patterns/                    ← NUEVA CARPETA: generadores v2
│   ├── grid.ts                 ← Implementación: PatternGenerator para grid
│   ├── dots.ts                 ← [PLACEHOLDER] Para future FASE 3
│   ├── waves.ts                ← [PLACEHOLDER] Para future FASE 3
│   ├── index.ts                ← Registry + helpers para inyectar generadores
│   └── __tests__/
│       └── grid.test.ts        ← Tests de nuevo sistema
│
├── renderer/
│   ├── svgRenderer.ts          ← Función pura: PatternOutput → SVG
│   ├── svgRenderer.test.ts
│   └── index.ts
│
└── core/
    ├── patternOrchestrator.ts  ← API v2 (generatePatternSVGv2) + v1 (compatibilidad)
    ├── patternOrchestrator.test.ts
    └── index.ts
```

---

## 3. FLUJO DE DATOS

### 3.1 Generación de un Patrón (Vista de Capas)

```
┌─────────────────────────────────────────────────────────┐
│  React Component (PatternCanvas.tsx)                   │
│  Props: type, config, renderOptions                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ generatePatternSVG(...)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Orquestador (patternOrchestrator.ts)                  │
│  - Adapta API v1 a v2 (PatternConfig → PatternState)   │
│  - Obtiene registry                                    │
│  - Busca generador para el tipo                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ getPatternGenerator(registry, type)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Registry (patterns/index.ts)                          │
│  Map<type, PatternGenerator>                           │
│  'grid' → gridPatternGenerator                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ generator.generate(config)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Generador (patterns/grid.ts)                          │
│  Entrada: PatternGeneratorConfig                       │
│  - geometry: { cellSize, gap, width, height }         │
│  - style: { strokeColor, strokeWidth, ... }           │
│  Salida: PatternOutput[]                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ PatternOutput (elementos abstractos)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Renderer (renderer/svgRenderer.ts)                    │
│  renderToSVG(patternOutput, renderOptions)            │
│  Salida: string SVG válido                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ <svg>...</svg>
                     ▼
┌─────────────────────────────────────────────────────────┐
│  DOM                                                   │
│  innerHTML = svgString                                │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Estructura de Datos Clave

**PatternState** (Estado serializable):
```typescript
{
  type: 'grid',
  geometry: {
    cellSize: 30,
    gap: 5,
    width: 800,
    height: 600,
  },
  style: {
    strokeColor: '#000000',
    strokeWidth: 1,
    strokeOpacity: 1,
    backgroundColor: undefined,
  }
}
```

**PatternGeneratorConfig** (Entrada al generador):
```typescript
{
  geometry: { /* GeometryConfig */ },
  style: { /* StyleConfig */ }
}
```

**PatternElement** (Elemento abstracto):
```typescript
{
  shape: 'rectangle',
  x: 0,
  y: 0,
  width: 20,
  height: 20,
  stroke: '#000000',
  strokeWidth: 1,
  data: { /* atributos específicos */ }
}
```

**PatternOutput** (Salida del generador):
```typescript
{
  elements: PatternElement[],
  dimensions: { width: 800, height: 600 },
  metadata: {
    elementCount: 1440,
    generatedAt: 1707264000000,
  }
}
```

---

## 4. CÓMO AGREGAR UN NUEVO PATRÓN (FASE 3)

### Paso 1: Crear el archivo del generador
```typescript
// src/domain/patterns/dots.ts

import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput } from '../pattern/PatternOutput';

const DOTS_DEFAULTS = {
  geometry: {
    cellSize: 10,
    gap: 5,
    width: 800,
    height: 600,
  },
  style: {
    strokeColor: '#000000',
    strokeWidth: 1,
    // ... resto de defaults
  }
};

function generateDotsPattern(config: PatternGeneratorConfig): PatternOutput {
  // Lógica de generación de puntos
  // Retorna PatternOutput
}

export const dotsPatternGenerator: PatternGenerator = {
  type: 'dots',
  defaults: DOTS_DEFAULTS,
  generate: generateDotsPattern,
};
```

### Paso 2: Registrar en el registry
```typescript
// src/domain/patterns/index.ts

import { dotsPatternGenerator } from './dots';  // ← Nuevo import

export function initializePatternRegistry(): PatternGeneratorRegistry {
  const registry = new Map();
  registerGenerator(registry, gridPatternGenerator);
  registerGenerator(registry, dotsPatternGenerator);  // ← Registrar
  return registry;
}
```

### Paso 3: Actualizar PatternType
```typescript
// src/domain/pattern/PatternType.ts

export type PatternType = 'grid' | 'dots' | 'waves' | 'noise';
// 'dots' ahora está registrado
```

**¡Eso es todo!** El orquestador automáticamente sabrá cómo manejar el nuevo patrón.

---

## 5. COMPATIBILIDAD V1

La API antigua sigue funcionando para máxima compatibilidad:

```typescript
// Código antiguo sigue funcionando:
generatePatternSVG({
  type: 'grid',
  config: {
    cellSize: 30,
    gap: 5,
    strokeColor: '#000',
  },
});

// Código nuevo es más explícito:
generatePatternSVGv2({
  state: {
    type: 'grid',
    geometry: { cellSize: 30, gap: 5, width: 800, height: 600 },
    style: { strokeColor: '#000', strokeWidth: 1 },
  },
});
```

El orquestador adapta v1 → v2 internamente.

---

## 6. TESTING STRATEGY

### Nivel 1: Unit Tests de Generadores
```typescript
// tests/patterns/grid.test.ts
import { gridPatternGenerator } from '../src/domain/patterns/grid';

it('should generate grid with defaults', () => {
  const output = gridPatternGenerator.generate({
    geometry: {},
    style: {},
  });
  expect(output.elements.length).toBeGreaterThan(0);
});
```

**Ventaja**: Cada generador se testea aisladamente.

### Nivel 2: Integration Tests
```typescript
// tests/patternOrchestrator.test.ts
import { generatePatternSVGv2 } from '../src/domain/core';

it('should generate complete SVG', () => {
  const svg = generatePatternSVGv2({
    state: { type: 'grid', geometry: {}, style: {} },
  });
  expect(svg).toContain('<svg');
});
```

### Nivel 3: Backward Compatibility Tests
```typescript
// tests/compatibility/gridPattern.test.ts
import { generateGridPattern } from '../src/domain/pattern/generators';

it('should work with deprecated API', () => {
  const output = generateGridPattern({ cellSize: 30 });
  // Verifica que funcione como antes
});
```

---

## 7. EXTENSIONES FUTURAS (SIN REFACTOR)

### Agregar soporte para PNG
1. Crear `renderers/pngRenderer.ts`
2. Agregar función `renderToSVG` → `renderToPNG`
3. El generador no cambia (Agnóstico del medio)

### Agregar Presets
1. Crear `presets/index.ts` que exporte PatternState predefinidos
2. Guardar en localStorage como JSON (PatternState es serializable)
3. El generador no cambia

### Agregar Share / Seed
1. PatternState → JSON → URL parameters
2. URL parameters → JSON → PatternState
3. El generador no cambia (es puro y determinístico)

### Agregar Undo/Redo
1. Mantener historias de PatternState en array
2. Cambiar índice para undo/redo
3. El generador no cambia

---

## 8. DECISIONES CLAVE

### 8.1 ¿Por qué separar geometry y style?
- **Razon**: Diferentes patrones usan geometry de formas distintas
  - Grid: cellSize es tamaño de celda, gap es espacio entre celdas
  - Dots: cellSize es diámetro, gap es espacio entre puntos
  - Waves: cellSize es amplitud, gap es distancia entre ondas
- **Beneficio**: interfaz común pero semántica clara por patrón

### 8.2 ¿Por qué PatternGenerator es interfaz + not abstract class?
- **Razon**: TypeScript no requiere herencia para cumplir interfaz
- **Beneficio**: Menos boilerplate, más composición, sin coupling

### 8.3 ¿Por qué mantener API v1?
- **Razon**: Code existente (PatternCanvas, tests) usa v1
- **Beneficio**: Migración gradual, sin breaking changes
- **Costo**: Pequeña capa de adaptación en orquestador

### 8.4 ¿Por qué PatternOutput es agnóstico?
- **Razon**: Permite diferentes renderers (SVG, Canvas, WebGL, PDF)
- **Beneficio**: Generador no conoce detalles de renderizado
- **Costo**: Renderer debe interpretar PatternElement

---

## 9. ROADMAP DE IMPLEMENTACIÓN

| Fase | Objetivo | Estado |
|------|----------|--------|
| FASE 1 ✅ | UX/UI Polish | Preparativo (arquitectura base) |
| FASE 2 | Style Controls (strokeOpacity, lineCap, etc.) | **Arquitectura lista** |
| FASE 3 | Nuevos patrones (dots, waves, isometric) | Registry permite agregar |
| FASE 4 | Presets | PatternState serializable |
| FASE 5 | Random & Seed | State + generador determinístico |
| FASE 6 | Export avanzado | Agnóstico del generador |
| FASE 7 | Dev features (SVG code, history, share) | Capas separadas |

---

## 10. NOTAS PARA DESARROLLADORES

### DO ✓
- Implementar nuevos patrones como PatternGenerator
- Usar PatternState para estado serializable
- Testear generadores aisladamente
- Mantener generadores sin efectos secundarios

### DON'T ✗
- No mutables PatternState o PatternConfig en generadores
- No acoplar generador a implementación de renderizado
- No agregar lógica UI en generadores
- No crear nuevas funciones en orquestador para cada patrón

---

Fin del documento.
