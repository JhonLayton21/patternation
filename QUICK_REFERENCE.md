# PATTERNATION V2 - QUICK REFERENCE GUIDE

> **Documentación rápida y guía de navegación para la arquitectura v2**

---

## 📋 ARCHIVOS NUEVOS CREADOS

### Interfaces Base (Carpeta: `src/domain/pattern/`)
| Archivo | Propósito | Tamaño | Líneas |
|---------|-----------|--------|-------|
| **GeometryConfig.ts** | Dimensiones y espaciado (cellSize, gap, width, height) | Pequeño | ~30 |
| **StyleConfig.ts** | Estilos visuales (strokeColor, strokeWidth, lineCap, dasharray, background) | Pequeño | ~50 |
| **ExportConfig.ts** | Configuración de exportación (format, resolution, svgMode) | Pequeño | ~30 |
| **PatternGeneratorTypes.ts** | Interfaz PatternGenerator + Registry | Pequeño | ~90 |
| **PatternState.ts** | Estado serializable centralizado + helpers | Pequeño | ~60 |

### Nuevos Generadores (Carpeta: `src/domain/patterns/`)
| Archivo | Propósito | Tamaño | Líneas |
|---------|-----------|--------|-------|
| **patterns/grid.ts** | Implementación de gridPatternGenerator (nueva arquitectura) | Pequeño | ~120 |
| **patterns/index.ts** | Registry centralizado + helpers | Pequeño | ~70 |

### Archivos Actualizados
| Archivo | Cambios |
|---------|---------|
| **patternOrchestrator.ts** | Agregadas API v2 + capa compatibilidad v1 |
| **PatternConfig.ts** | Ahora combina GeometryConfig + StyleConfig |
| **pattern/index.ts** | Exporta nuevas interfaces |
| **generators/gridPattern.ts** | Ahora es wrapper del nuevo sistema |

### Documentación
| Archivo | Contenido | Lectura |
|---------|-----------|---------|
| **ARCHITECTURE_V2.md** | 10 secciones, decisiones arquitectónicas | 15-20 min |
| **USAGE_EXAMPLES.md** | 8 escenarios con código de ejemplo | 10-15 min |
| **IMPLEMENTATION_SUMMARY.md** | Resumen ejecutivo de qué se hizo | 5-10 min |

---

## 🎯 LECTURA RECOMENDADA POR PERFIL

### **Para entender la decisión arquitectónica**
1. Lee: **IMPLEMENTATION_SUMMARY.md** (resumen rápido)
2. Lee: **ARCHITECTURE_V2.md** sección 1-4 (principios + flujo)
3. Referencia: **ARCHITECTURE_V2.md** sección 8 (decisiones clave)

### **Para implementar un nuevo patrón (FASE 3)**
1. Lee: **ARCHITECTURE_V2.md** sección 4 ("Cómo agregar patrón")
2. Referencia: **USAGE_EXAMPLES.md** sección 4 (ejemplo Dots pattern)
3. Copia: `patterns/grid.ts` como template

### **Para usar presets (FASE 4)**
1. Lee: **USAGE_EXAMPLES.md** sección 3 (guardar/restaurar presets)
2. Referencia: **ARCHITECTURE_V2.md** sección 7 (extensiones futuras)
3. Entiende: PatternState es JSON-serializable

### **Para testing**
1. Lee: **ARCHITECTURE_V2.md** sección 6 (testing strategy)
2. Referencia: **USAGE_EXAMPLES.md** secciones 5-6 (ejemplos de tests)
3. Copia: estructura de tests de `patterns/grid.test.ts`

### **Para migrar código legado**
1. Lee: **USAGE_EXAMPLES.md** sección 7 (comparativa v1 vs v2)
2. Lee: **USAGE_EXAMPLES.md** sección 8 (plan de migración)
3. No hagas nada hoy: migración es gradual

---

## 🔍 CHEAT SHEET

### Usar la API nueva v2 (Recomendado para código nuevo)
```typescript
import { generatePatternSVGv2 } from '@/domain/core/patternOrchestrator';
import type { PatternState } from '@/domain/pattern';

const state: PatternState = {
  type: 'grid',
  geometry: { cellSize: 30, gap: 5, width: 800, height: 600 },
  style: { strokeColor: '#000', strokeWidth: 1 },
};

const svg = generatePatternSVGv2({ state });
```

### Guardar preset
```typescript
const preset = JSON.stringify(state);
localStorage.setItem('myPattern', preset);
```

### Cargar preset
```typescript
const preset = JSON.parse(localStorage.getItem('myPattern'));
const svg = generatePatternSVGv2({ state: preset });
```

### Implementar nuevo patrón
```typescript
// 1. Crear patterns/dots.ts con dotsPatternGenerator
// 2. Registrar: import { dotsPatternGenerator } en patterns/index.ts
// 3. Registrar: registerGenerator(registry, dotsPatternGenerator);
// ¡Automáticamente funciona con generatePatternSVGv2!
```

---

## 📚 MAPEO DE INTERFACES

```
PatternState                          (Estado serializable)
├── type: string
├── geometry: GeometryConfig         (cellSize, gap, width, height)
└── style: StyleConfig               (stroke*, background*)

    ↓ (generador usa)

PatternGeneratorConfig               (Entrada a generador)
├── geometry: GeometryConfig
└── style: StyleConfig

    ↓ (generador retorna)

PatternOutput                         (Agnóstico del medio)
├── elements: PatternElement[]       (shapes abstractas)
└── dimensions: { width, height }

    ↓ (renderer convierte a)

SVG String                           (Output final)
```

---

## 🚀 ROADMAP RAPIDO

| Fase | Feature | Usa | Estado |
|------|---------|-----|--------|
| 1 | UX/UI Polish | Esta base | ✅ Done |
| 2 | Style Controls (strokeOpacity, lineCap, etc) | StyleConfig extendida | 🔜 Next |
| 3 | Nuevos patrones (dots, waves) | PatternGenerator | 🔜 Next |
| 4 | Presets | PatternState serializable | 🔜 Next |
| 5 | Random & Seed | State reproducible | 🔜 Next |
| 6 | Export SVG/PNG | Agnóstico | 🔜 Next |
| 7 | Share / URL params / History | PatternState + URL | 🔜 Next |

---

## ⚠️ CUIDADO CON

### ✗ No hagas esto
```typescript
// No mutar state
state.geometry.cellSize = 50;  // ❌ MALO

// No usar v1 API si es posible
generatePatternSVG({ type: 'grid', config: { ... } });  // ❌ VIEJO
```

### ✓ Haz esto
```typescript
// Creart nuevo state
const newState = { ...state, geometry: { ...state.geometry, cellSize: 50 } };

// Usar v2 API
generatePatternSVGv2({ state: newState });  // ✅ NUEVO
```

---

## 📍 ESTRUCTURA DE LA CARPETA `patterns/`

```
patterns/                    ← Todos los generadores v2
├── grid.ts                 ← Referencia implementación completa
├── dots.ts                 ← [PLACEHOLDER] Para FASE 3
├── waves.ts                ← [PLACEHOLDER] Para FASE 3
├── isometric.ts            ← [PLACEHOLDER] Para FASE 3
└── index.ts                ← Registry centralizado
    ├── initializePatternRegistry()
    ├── registerGenerator()
    └── getPatternGenerator()
```

**Agregar nuevo patrón**: Copiar `grid.ts`, cambiar `type` y lógica, registrar en `index.ts`.

---

## 🧪 TESTING RÁPIDO

### Unit Test (Generador aislado)
```typescript
import { gridPatternGenerator } from '@/domain/patterns/grid';

it('generates grid', () => {
  const output = gridPatternGenerator.generate({
    geometry: { cellSize: 30, gap: 5 },
    style: { strokeColor: '#000' },
  });
  expect(output.elements.length).toBeGreaterThan(0);
});
```

### Integration Test (Completo)
```typescript
import { generatePatternSVGv2 } from '@/domain/core';

it('produces valid SVG', () => {
  const svg = generatePatternSVGv2({
    state: {
      type: 'grid',
      geometry: { cellSize: 30 },
      style: { strokeColor: '#000' },
    },
  });
  expect(svg).toContain('<svg');
});
```

---

## 📞 QUICK QUESTIONS

**P: ¿Debo cambiar PatternCanvas.tsx?**  
R: No. Sigue funcionando con la API v1. Migración es gradual.

**P: ¿Cómo agrego un nuevo patrón?**  
R: Ver ARCHITECTURE_V2.md sección 4 o USAGE_EXAMPLES.md sección 4.

**P: ¿PatternState es compatible con localStorage?**  
R: Sí, es 100% JSON serializable.

**P: ¿Qué pasa si no uso GeometryConfig?**  
R: Los generadores tienen defaults, así que funciona sin nada.

**P: ¿Es obligatorio migrar a v2 ya?**  
R: No. v1 sigue funcionando. Migra gradualmente o cuando agregues features nuevas.

---

## 🎓 CONCEPTOS CLAVE

- **PatternState**: "Fotografía" de un patrón, JSON-serializable
- **PatternGenerator**: "Receta" que convierte estado a PatternOutput
- **PatternOutput**: Datos agnósticos del generador
- **Renderer**: Convierte PatternOutput a SVG/PNG/etc
- **Registry**: Mapeo de type → PatternGenerator
- **API v1/v2**: Compatibilidad + nuevos contratos

---

**Última actualización**: 7 de Febrero, 2026  
**Versión**: Architecture v2.0.0-base  
**Status**: Ready for Phase 2
