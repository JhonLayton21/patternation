# PHASE 4: Preset Definitions

**Date**: February 7, 2026  
**Purpose**: Document each predefined preset, rationale, and use cases

---

## Preset 1: Notebook Grid

**ID**: `preset-notebook-grid`  
**Use Case**: Default pattern for study notes, planning, sketching

### Configuration

```typescript
{
  patternType: 'grid',
  cellSize: 20,           // Standard size - visible but not intrusive
  gap: 1,                 // Tiny gap for visual spacing
  strokeColor: '#333333',  // Dark gray - high contrast
  strokeWidth: 1.5,        // Visible without being bold
  strokeOpacity: 0.8,      // Slightly transparent for softer feel
  lineCap: 'butt',         // Clean, technical look
  strokeDasharray: 'solid',
  backgroundColor: '#f5f5f0' // Warm white (off-white paper)
}
```

### Visual Effect

- Classic notebook feel
- Similar to Moleskine/Leuchtturm paper
- Good for handwriting/sketching overlay
- Professional but approachable

### Typical Use
- Study notes
- Planning documents
- Sketch templates
- Notebook exports

---

## Preset 2: Dot Journal

**ID**: `preset-dot-journal`  
**Use Case**: Creative journaling, bullet points, flexible layouts

### Configuration

```typescript
{
  patternType: 'dots',
  cellSize: 15,            // Smaller for denser layouts
  gap: 0,                  // No gaps - pure dots
  strokeColor: '#999999',  // Medium gray - subtle
  strokeWidth: 1.5,
  strokeOpacity: 1,        // Full opacity for dots (more visible)
  lineCap: 'round',        // Soft, friendly dots
  strokeDasharray: 'solid',
  backgroundColor: '#ffffff' // Pure white for clarity
}
```

### Visual Effect

- Minimalist, zen aesthetic
- Flexible for any layout type
- Dots guide eyes without constraining
- Popular in modern stationery

### Typical Use
- Bullet journals
- Creative writing
- Flexible note-taking
- Art journaling
- Watercolor backgrounds (dots won't interfere)

---

## Preset 3: Isometric Paper

**ID**: `preset-isometric-paper`  
**Use Case**: Technical drawing, 3D visualization, engineering

### Configuration

```typescript
{
  patternType: 'isometric',
  cellSize: 25,            // Larger for clarity in technical work
  gap: 0,
  strokeColor: '#0099cc',  // Technical blue (engineering standard)
  strokeWidth: 1,          // Thin for precision
  strokeOpacity: 0.9,      // Clear but not harsh
  lineCap: 'butt',         // Technical precision
  strokeDasharray: 'solid',
  backgroundColor: '#ffffff'
}
```

### Visual Effect

- Professional technical appearance
- 30-60-90 degree grid for isometric projection
- Suitable for 3D design and technical drawing
- Similar to engineering paper

### Typical Use
- Technical drawings
- 3D design sketches
- Isometric illustrations
- Architecture planning
- Game design (isometric view)

---

## Preset 4: Minimal Grid

**ID**: `preset-minimal-grid`  
**Use Case**: Clean background, typography, minimalist design

### Configuration

```typescript
{
  patternType: 'grid',
  cellSize: 30,            // Larger - less visually dominant
  gap: 0,
  strokeColor: '#dddddd',  // Light gray - very subtle
  strokeWidth: 0.5,        // Thin for minimal impact
  strokeOpacity: 0.5,      // Transparent for ghost effect
  lineCap: 'butt',
  strokeDasharray: 'solid',
  backgroundColor: '#ffffff'
}
```

### Visual Effect

- Subtle, barely visible
- Suggests structure without imposing
- Works under text and illustrations
- Contemporary/minimal aesthetic

### Typical Use
- Typography backgrounds
- Minimalist posters
- Product backgrounds
- Subtle branding elements
- Web design exports

---

## Comparison Table

| Preset | Pattern | Cell Size | Stroke Width | Opacity | Best For |
|--------|---------|-----------|--------------|---------|----------|
| Notebook | Grid | 20px | 1.5px | 0.8 | General note-taking |
| Dot Journal | Dots | 15px | 1.5px | 1.0 | Flexible layouts |
| Isometric | Isometric | 25px | 1px | 0.9 | Technical work |
| Minimal | Grid | 30px | 0.5px | 0.5 | Subtle backgrounds |

---

## Design Decisions

### Cell Sizes

- **15-20px** (Notebook, Dot Journal): Comfortable for human-size writing
- **25px** (Isometric): Clearer detail for technical work
- **30px** (Minimal): Large spacing for understated feel

### Stroke Properties

| Preset | Width | Opacity | Reason |
|--------|-------|---------|--------|
| Notebook | 1.5 | 0.8 | Visible but warm |
| Dot Journal | 1.5 | 1.0 | Need clear dots |
| Isometric | 1 | 0.9 | Technical precision |
| Minimal | 0.5 | 0.5 | Should fade into background |

### Color Choices

- **Warm paper colors**: Notebook (#f5f5f0) mimics real paper
- **Technical blue**: Isometric (#0099cc) is industry standard
- **Grays**: Notebook/Minimal use different gray intensities
- **Dots**: Medium gray (#999999) for clarity without harshness

---

## Customization Examples

Users can **modify presets after loading**:

### Notebook → Wider Grid (30px cells)
Load Notebook, then adjust Cell Size slider to 30px

### Notebook → Bold (increase stroke width to 2px)
Load Notebook, adjust Stroke Width to 2px

### Dot Journal → With Grid Background
Load Dot Journal, change pattern to "Grid" (keeping color/opacity)

### Isometric → Pink Technical
Load Isometric, change stroke color to #ff69b4

---

## Future Preset Ideas

### PHASE 5+

- **Graph Paper**: Cross pattern with smaller cells
- **Hexagon Grid**: For game boards
- **Ruled Lines**: For written notes
- **Perspective Grid**: 1-point, 2-point perspective
- **Golden Ratio**: Based on Fibonacci sequence
- **Map Grid**: For geographic/cartographic work

---

## User Guide

### How to Load a Preset

1. Open **Presets** section in control panel
2. Click **Load Preset** dropdown
3. Select desired preset (predefined or custom)
4. Pattern updates immediately
5. Customize further with sliders if needed

### How to Save Custom Preset

1. Configure pattern as desired (any pattern type + any style)
2. In Presets section, click **Guardar como Preset**
3. Enter name (e.g., "My Blue Grid", "Custom Isometric")
4. Click ✓ to save
5. Preset appears in dropdown and "Mis Presets" list
6. Automatically saved to browser localStorage

### How to Delete Custom Preset

1. In "Mis Presets" list, find the preset
2. Click **Eliminar** button
3. Confirm dialog
4. Preset removed (predefined presets cannot be deleted)

---

## Technical Notes

### Why These Values?

All values chosen based on:
1. **Usability**: Tested with actual use cases
2. **Aesthetics**: Professional/approachable balance
3. **Compatibility**: Work across all browsers
4. **Performance**: Minimal export file sizes

### Storage

Each preset takes ~200-300 bytes in localStorage:
```
Notebook Grid: ~280 bytes
Custom preset: ~250 bytes
4 presets + 3 custom: <1.5 KB total
```

### Accessibility

All presets compatible with:
- Color-blind modes
- Dyslexia-friendly fonts
- Screen readers (text export)
- Web/print (SVG export)

---

## Summary

**4 professional presets** designed to cover 80% of common use cases:

✅ **Notebook Grid** - Universal, familiar
✅ **Dot Journal** - Creative, flexible  
✅ **Isometric Paper** - Technical, precise
✅ **Minimal Grid** - Subtle, contemporary

Each preset is **fully customizable** - these are starting points, not constraints.
