# MVP – Patternation

## Objetivo
Crear un generador web de patrones visuales (backgrounds) reutilizables,
customizables y exportables, enfocado en diseñadores y developers.

---

## Stack
- Vite
- React
- TypeScript
- Vitest
- Canvas / SVG
- Tailwind CSS (UI)
- Exportación PNG / SVG

---

## Filosofía
- Test-first cuando tenga sentido
- Lógica separada de UI
- Componentes pequeños
- MVP antes que perfección

---

## FASE 1 – Dominio (Core Logic)

### 1. Definir el concepto de Pattern
Un Pattern debe tener:
- id
- nombre
- tipo (grid, dots, waves, noise, etc)
- parámetros configurables
- función generadora pura

### 2. Crear estructura base
src/
 ├─ domain/
 │   ├─ pattern/
 │   │   ├─ Pattern.ts
 │   │   ├─ PatternConfig.ts
 │   │   └─ generators/
 │   │       └─ gridPattern.ts
 │   └─ index.ts

### 3. Implementar primer patrón
- Grid pattern simple
- Parametrizable (size, gap, color)

### 4. Tests
- Verificar que el generador devuelve una estructura válida
- No testear UI todavía

---

## FASE 2 – Renderizado

### 1. Render con Canvas o SVG
- Crear renderer independiente
- La lógica no debe conocer React

### 2. Componente React
- PatternCanvas.tsx
- Props claras
- Renderizar un patrón activo

---

## FASE 3 – UI básica

### 1. Layout
- Sidebar (controles)
- Área de preview
- Header simple

### 2. Controles
- Sliders
- Color picker
- Select de patrón

---

## FASE 4 – Exportación

### 1. Export PNG
- Desde canvas
- Resolución configurable

### 2. Export SVG (si aplica)

---

## FASE 5 – MVP listo

- README actualizado
- Demo funcional
- Patrones mínimos (2–3)
- Código limpio y entendible

---

## NO HACER AÚN
- Auth
- Pagos
- Marketplace
- Guardado en nube

MVP primero.
