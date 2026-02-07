# Patternation – MVP v2 Roadmap

Este documento define la **versión 2 de Patternation** y funciona como **guía operativa para la IA** durante el desarrollo.

Objetivo de v2: convertir Patternation de un MVP funcional a una **herramienta creativa sólida, usable y diferenciada**, manteniendo simplicidad.

---

## PRINCIPIOS DEL PROYECTO

* Todo debe sentirse **rápido, directo y visual**
* Preferir **controles simples** sobre configuraciones complejas
* Cada nueva feature debe:

  * Aportar valor creativo
  * Ser exportable
  * No romper patrones existentes
* El preview es el producto

---

## ESTADO ACTUAL (MVP v1 – COMPLETADO)

### Funcionalidades

* Pattern type: Grid
* Cell size configurable
* Gap configurable
* Stroke color
* Render SVG en tiempo real
* Export SVG
* Export PNG con tamaño configurable

### Stack

* Core pattern logic
* SVG renderer
* React UI

---

## VERSION 2 – ALCANCE GENERAL

Patternation v2 introduce:

* Mejor UX y jerarquía visual
* Nuevos tipos de patrones
* Controles gráficos avanzados
* Presets
* Export más potente

---

## FASE 1 – UX / UI POLISH

### Objetivo

Mejorar claridad, usabilidad y sensación de herramienta profesional.

### Tareas

* Agrupar controles por secciones:

  * Pattern
  * Geometry
  * Style
  * Export
* Mejorar jerarquía visual (labels, spacing, separators)
* Preview más grande y dominante
* Añadir zoom al preview (50%, 100%, 200%)
* Toggle de fondo checkerboard para transparencia
* Microinteracciones:

  * Sliders con transición
  * Feedback visual al exportar

### Resultado esperado

Interfaz más clara, menos fricción, sensación "design tool".

---

## FASE 2 – STYLE CONTROLS

### Objetivo

Dar mayor control visual sin complejidad excesiva.

### Nuevos controles

* Stroke width
* Stroke opacity
* Line cap (butt, round, square)
* Dash / dotted lines
* Background color
* Background transparente

### Resultado esperado

Patrones más expresivos y listos para uso real.

---

## FASE 3 – NUEVOS TIPOS DE PATRÓN

### Objetivo

Aumentar valor creativo del generador.

### Patrones a implementar (prioridad)

1. Dots
2. Diagonal grid
3. Isometric grid
4. Zig-zag
5. Waves
6. Cross / graph paper

### Reglas

* Cada patrón debe:

  * Usar el mismo sistema base de celdas
  * Responder a cell size y gap
  * Ser exportable como SVG limpio

---

## FASE 4 – PRESETS

### Objetivo

Acelerar flujo creativo y aumentar usabilidad.

### Funcionalidades

* Presets predefinidos:

  * Notebook grid
  * Dot journal
  * Isometric paper
  * Minimal grid
* Botón Load preset
* Guardar presets personalizados (localStorage)

### Resultado esperado

Uso inmediato sin configuración manual.

---

## FASE 5 – RANDOM & SEED

### Objetivo

Exploración creativa y variación orgánica.

### Funcionalidades

* Botón Randomize
* Campo seed reproducible
* Random aplicado a:

  * Tamaño
  * Gap
  * Stroke
  * Pattern type (opcional)

---

## FASE 6 – EXPORT AVANZADO

### Objetivo

Mejorar calidad y control de salida.

### Mejoras

* Export SVG:

  * Como pattern
  * Como canvas completo
* Export PNG:

  * @1x, @2x, @3x
* Mostrar tamaño del archivo
* Copy SVG to clipboard

---

## FASE 7 – DEV / POWER FEATURES (OPCIONAL)

### Live SVG Code

* Panel con código SVG generado
* Botón copy

### History

* Undo / Redo
* Snapshots básicos

### Share

* URL con parámetros del patrón
* Patrón reproducible por link

---

## CRITERIOS DE CALIDAD

* SVG limpio y legible
* Sin dependencias pesadas
* Render fluido en tiempo real
* UI consistente

---

## DEFINICIÓN DE ÉXITO v2

Patternation v2 es exitoso si:

* Permite crear patrones útiles en < 30 segundos
* Los exportes se usan directamente en diseño real
* La herramienta se siente estable y profesional

---

## NOTAS PARA LA IA

* No introducir complejidad innecesaria
* Mantener arquitectura modular de patrones
* Priorizar claridad sobre cantidad de opciones
* Cada feature debe ser justificable desde UX

---

Fin del documento.
