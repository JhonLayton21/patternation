# PATTERNATION V2 - BASE ARCHITECTURE - SUMMARY

**Fecha**: 7 de Febrero, 2026  
**Objetivo**: Preparar la base técnica escalable de Patternation v2 sin agregar UI nueva  
**Status**: ✅ COMPLETADO

---

## QCHÉ SE IMPLEMENTÓ

### 1. **Interfaces de Configuración (Separación de Concernos)**

Creadas 4 nuevas interfaces TypeScript para reemplazar el monolítico `PatternConfig`:

- **`GeometryConfig`** (`src/domain/pattern/GeometryConfig.ts`)
  - `cellSize`, `gap`, `width`, `height`
  - Agnóstico del medio: cada patrón interpreta estos valores según su lógica
  
- **`StyleConfig`** (`src/domain/pattern/StyleConfig.ts`)
  - `strokeColor`, `strokeWidth`, `strokeOpacity`
  - `lineCap`, `strokeDasharray` (preparado para FASE 2)
  - `backgroundColor`, `backgroundOpacity`
  - Extensible para FASE 2 sin refactors
  
- **`ExportConfig`** (`src/domain/pattern/ExportConfig.ts`)
  - `format`, `filename`, `pixelRatio`, `svgMode`
  - Preparado para FASE 6 (export avanzado)
  - Sin implementación de funcionalidad aún (solo estructura)
  
- **`PatternConfig`** (actualizado)
  - Ahora combina `GeometryConfig` + `StyleConfig`
  - Mantiene compatibilidad con código existente
  - Deprecado a favor de las nuevas interfaces

---

### 2. **Sistema de Generadores Escalable**

Creada nueva carpeta `/src/domain/patterns/` con arquitectura basada en registry:

#### **PatternGeneratorTypes.ts**
Define interfaz `PatternGenerator` que TODOS los generadores deben implementar:
```typescript
interface PatternGenerator {
  type: string;  // Identificador único
  defaults: { geometry, style };  // Defaults específicos del patrón
  generate(config): PatternOutput;  // Función pura
}
```

**Ventajas**:
- Type-safe: compilador valida que cada generador cumple contrato
- Extensible: nuevo patrón = nuevo generador + registro en index
- Agnóstico: generador no conoce orquestador ni renderer

#### **patterns/grid.ts** (Implementación referencia)
- Adaptado a nueva arquitectura `PatternGenerator`
- Mantiene lógica pura (inputs determinísticos → outputs determinísticos)
- Los defaults específicos de grid viven aquí (no en orquestador)
- Sin cambios comportamentales vs. versión anterior

#### **patterns/index.ts** (Registry centralizado)
```typescript
initializePatternRegistry(): Map<type, PatternGenerator>
registerGenerator(registry, generator): void
getPatternGenerator(registry, type): PatternGenerator
```

**Clave**: Agregar nuevo patrón (FASE 3) requiere:
1. Crear `patterns/dots.ts` con `dotsPatternGenerator`
2. Registrar en `patterns/index.ts`
3. Actualizar `PatternType.ts`
4. **¡El orquestador NO cambia!**

---

### 3. **Estado Serializable Centralizado**

Archivo `src/domain/pattern/PatternState.ts`:

```typescript
interface PatternState {
  type: string;
  geometry: GeometryConfig;
  style: StyleConfig;
}
```

**Propiedades clave**:
- ✅ JSON serializable (sin funciones, métodos, referencias cíclicas)
- ✅ Reproducible (same state = same pattern, determinístico)
- ✅ Completo (contiene TODOS los datos para generar patrón)

**Preparado para**:
- 💾 Presets (guardar en localStorage como JSON)
- 🔗 Share (URL parameters con estado codificado)
- 🎲 Seed (patrones reproducibles con entrada fija)
- ↩️ Undo/Redo (historias de estados)

Plus: Helper `mergePatternConfig()` para combinar defaults + overrides.

---

### 4. **Orquestador Refactorizado (Con Compatibilidad)**

Archivo `src/domain/core/patternOrchestrator.ts`:

#### **API v2 (Nueva, recomendada)**
```typescript
generatePatternSVGv2(options: {
  state: PatternState,
  renderOptions?: SVGRenderOptions
}): string
```
- Usa PatternGeneratorRegistry
- Busca generador para el tipo
- Ejecuta generador puro
- Renderiza a SVG

#### **API v1 (Vieja, compatible)**
```typescript
generatePatternSVG(options: {
  type: PatternType,
  config: PatternConfig,
  renderOptions?: SVGRenderOptions
}): string
```
- Sigue funcionando exactamente como antes
- Internamente adapta a PatternState
- Capa de compatibilidad en orquestador
- **NINGÚN cambio en PatternCanvas.tsx o código React existente**

**Decisión arquitectónica**: Mantener ambas APIs durante transición gradual (sin breaking changes).

---

### 5. **Wrapper de Compatibilidad**

Archivo `src/domain/pattern/generators/gridPattern.ts` (actualizado):

- Ya no contiene lógica de generación
- Ahora es wrapper que:
  1. Adapta `PatternConfig` antigua → `PatternGeneratorConfig` nueva
  2. Llama `gridPatternGenerator.generate()`
  3. Retorna resultado

**Resultado**: Tests antiguos siguen pasando sin cambios.

---

### 6. **Documentación Completa**

#### **ARCHITECTURE_V2.md** (10 secciones)
- Principios arquitectónicos
- Estructura de carpetas actualizada
- Flujo de datos visual (con ASCII diagrams)
- Cómo agregar nuevo patrón (paso a paso)
- Compatibilidad v1
- Testing strategy (3 niveles)
- Extensiones futuras sin refactor
- Decisiones clave y justificaciones
- Roadmap de fases
- Guía de buenas prácticas (DO/DON'T)

#### **USAGE_EXAMPLES.md** (8 escenarios)
1. Uso en React components (v1, compatible hoy)
2. Uso directo de nueva API v2
3. Guardar/restaurar presets con localStorage
4. Implementar nuevo patrón (dots example completo)
5. Testing generador aislado
6. Testing integración completa
7. Código legado vs nuevo (comparativa)
8. Plan de migración gradual (sin forzar cambios)

---

## IMPACTO EN CÓDIGO EXISTENTE

### ✅ CERO cambios requeridos
- `PatternCanvas.tsx`: Sigue usando `generatePatternSVG()` v1
- Tests antiguos: Siguen funcionando (wrapper mantiene compatibilidad)
- Lógica de negocio: Intacta

### ✅ Preparado para FASE 2,3,4,5,6
- Nuevos estilos (FASE 2): Agregar a `StyleConfig`, generador usa automáticamente
- Nuevos patrones (FASE 3): `PatternGenerator` interface permite agregar sin tocar orquestador
- Presets (FASE 4): `PatternState` es serializable, lista para localStorage
- Random/Seed (FASE 5): Generadores son puros, estado reproducible
- Export (FASE 6): Agnóstico, nuevos renderers no afectan generadores

---

## DECISIONES CLAVE Y JUSTIFICACIÓN

### 1. Separar GeometryConfig y StyleConfig
**Por qué**: Diferentes patrones usan dimensiones de forma distinta:
- Grid: cellSize = tamaño celda, gap = espacio
- Dots: cellSize = diámetro, gap = espacio entre puntos
- Waves: cellSize = amplitud, gap = distancia

**Beneficio**: Interfaz común pero con semántica clara.

### 2. PatternGenerator es interfaz, no clase abstracta
**Por qué**: TypeScript permite implementación sin herencia.

**Beneficio**: Menos boilerplate, más composición, sin coupling innecesario.

### 3. Mantener API v1
**Por qué**: Código React existente usa v1, no hay urgencia de breaking changes.

**Beneficio**: Migración gradual, evita refactor masivo de UI.

**Costo**: Pequeña capa de adaptación en orquestador (minimalist, 20 líneas).

### 4. PatternOutput agnóstico
**Por qué**: Prepara para futuros renderers (SVG, Canvas, WebGL, PDF).

**Beneficio**: Generador no conoce detalles de renderizado.

**Implementación**: PatternElement abstracto, renderer lo interpreta.

### 5. PatternState completamente serializable
**Por qué**: Necesario para presets, share, undo/redo, localStorage.

**Cómo**: Solo datos (JSON-compatible), sin métodos ni funciones.

**Resultado**: `JSON.stringify(state)` y `JSON.parse()` funciona perfectamente.

---

## ESTRUCTURA DE CARPETAS FINAL

```
src/domain/
├── pattern/                    ← Core interfaces
│   ├── GeometryConfig.ts        ✨ [NUEVO]
│   ├── StyleConfig.ts           ✨ [NUEVO]
│   ├── ExportConfig.ts          ✨ [NUEVO]
│   ├── PatternGeneratorTypes.ts ✨ [NUEVO]
│   ├── PatternState.ts          ✨ [NUEVO]
│   ├── PatternConfig.ts         [ACTUALIZADO - ahora deprecado]
│   ├── Pattern.ts
│   ├── PatternType.ts
│   ├── PatternOutput.ts
│   ├── index.ts                 [ACTUALIZADO - exporta nuevas interfaces]
│   └── generators/
│       ├── gridPattern.ts       [ACTUALIZADO - ahora wrapper]
│       ├── gridPattern.test.ts
│       └── index.ts
│
├── patterns/                   ← ✨ [NUEVA CARPETA] Generadores v2
│   ├── grid.ts                 ✨ Implementación gridPatternGenerator
│   ├── index.ts                ✨ Registry + helpers
│   └── (placeholders para FASE 3)
│       ├── dots.ts
│       ├── waves.ts
│       ├── isometric.ts
│
├── renderer/
│   ├── svgRenderer.ts
│   ├── svgRenderer.test.ts
│   └── index.ts
│
└── core/
    ├── patternOrchestrator.ts  [ACTUALIZADO - v2 API + v1 compatibility]
    ├── patternOrchestrator.test.ts
    └── index.ts
```

---

## ROADMAP DE FASES (CÓMO USAR ESTA BASE)

| Fase | Qué | Requiere | Impacto |
|------|-----|----------|--------|
| **1** (Hoy) | UX/UI Polish | ✅ Esta base | 0 cambios código |
| **2** | Style controls avanzados | Extender `StyleConfig` | Generador usa automáticamente |
| **3** | Nuevos patrones | `PatternGenerator` interface | Registrar en `patterns/index.ts` |
| **4** | Presets | `PatternState` serializable | Guardar/cargar desde localStorage |
| **5** | Random/Seed | State reproducible + generador puro | Sin cambios arquitectónicos |
| **6** | Export SVG/PNG | Agnóstico de generador | Nuevo renderer, generador intacto |
| **7** | Dev features | PatternState completo | URL params, undo/redo, history |

---

## CHECKLIST DE VALIDACIÓN

- ✅ **Interfaces bien definidas**: GeometryConfig, StyleConfig, ExportConfig, PatternGenerator
- ✅ **Registro de generadores**: Sin switch() infinito, escalable
- ✅ **Estado serializable**: PatternState listo para presets/share
- ✅ **Compatibilidad total**: v1 API sigue funcionando, cero breaking changes
- ✅ **Documentación**: ARCHITECTURE_V2.md (decisiones) + USAGE_EXAMPLES.md (code samples)
- ✅ **Separation of concerns**: Generador no conoce renderer, oracle no conoce patrón específico
- ✅ **Type safety**: TypeScript valida contratos entre capas
- ✅ **Preparado para FASE 2+**: Sin refactors adicionales necesarios
- ✅ **No UI nueva**: Arquitectura pura, sin componentes React
- ✅ **No cambios comportamiento**: Mismos outputs para mismos inputs

---

## PRÓXIMOS PASOS (PARA FASES 2+)

### FASE 2: Style Controls
1. Extender StyleConfig con nuevos atributos
2. Actualizar gridPatternGenerator para usar nuevos estilos
3. Extender PatternElement.data con nuevos atributos
4. Actualizar svgRenderer para renderizar nuevos estilos

### FASE 3: Nuevos Patrones
1. Crear `patterns/dots.ts` con `dotsPatternGenerator`
2. Registrar en `patterns/index.ts`
3. Agregar 'dots' a `PatternType`
4. Crear tests en `__tests__/patterns/dots.test.ts`
5. (Orquestador NO cambia)

### FASE 4: Presets
1. Componente "Save Preset" que guarda `PatternState` a localStorage
2. Componente "Load Preset" que carga y restaura
3. Usar `JSON.stringify/parse` en PatternState

### FASE 5: Random & Seed
1. Funciones de randomización que mutarían PropertyState
2. Mantener seed para reproducibilidad
3. Verificar que generador produce mismo output con mismo seed

### FASE 6: Export Avanzado
1. Crear `renderers/pngRenderer.ts`
2. Usar ExportConfig para seleccionar formato
3. Orquestador elige renderer según ExportConfig.format

---

## NOTAS TÉCNICAS

### Capa de Adaptación (Pequeña pero poderosa)
```typescript
// El orquestador adapta v1 → v2:
const state: PatternState = {
  type,
  geometry: { cellSize, gap, width, height },
  style: { strokeColor, strokeWidth },
};
// Luego usa generatePatternSVGv2(state, options)
```

### Por qué no hacer esto desde día 1?
- ⛔ Breaking change para PatternCanvas
- ⛔ Requería actualizar React component
- ✅ Manteniendo compatible, se migra gradualmente

### Principio de Mínimo Impacto
- ✅ Código viejo sigue funcionando
- ✅ Código nuevo puede usar v2 API cuando quiera
- ✅ Sin presión de migrar todo de una vez

---

## CONCLUSIÓN

**Patternation v2 tiene ahora una base arquitectónica sólida que:**

1. ✅ Soporta múltiples tipos de patrón sin refactors
2. ✅ Permite controles de estilo extensibles
3. ✅ Prepara estado serializable para presets/share
4. ✅ Descacopla generación de renderizado
5. ✅ Type-safe gracias a TypeScript
6. ✅ Cero cambios en código existente
7. ✅ Documentada completamente

**Sin implementar UI nueva ni cambiar comportamiento.<br>Solo arquitectura profesional, escalable y lista para las siguientes fases.**

---

**Documento creado**: 7 de Febrero, 2026  
**Autor**: GitHub Copilot (Claude Haiku 4.5)  
**Status**: Base arquitectónica completada, lista para FASE 2
