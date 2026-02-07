# 🎯 PHASE 3 ROADMAP - What's Next

**Status**: Ready to Begin  
**Previous Phase**: PHASE 2 ✅ Complete  
**Estimated Complexity**: Medium  
**Timeline**: Depends on new pattern implementations  

---

## PHASE 3 OBJECTIVE

Implement **multiple pattern types** to increase creative flexibility and value.

Replace single "Grid" pattern dropdown with variety of patterns:
- Each with unique visual characteristics
- All using same geometry/style system
- All exportable as clean SVG

---

## PATTERNS TO IMPLEMENT (Priority Order)

### 1. Dots Pattern ⭐⭐⭐ (HIGH PRIORITY)
**Concept**: Grid of circles instead of squares

**Parameters**:
- Cell Size: Diameter of circles
- Gap: Space between circle centers
- Same style controls as grid (width, opacity, cap, etc.)

**Technical**:
- Create `src/domain/patterns/dots.ts`
- Implement `PatternGenerator` interface
- Generate `circle` elements instead of `rect`
- Register in pattern registry

**Complexity**: Low (copy grid.ts, change shapes)

**Example**:
```
○ ○ ○ ○ ○
○ ○ ○ ○ ○
○ ○ ○ ○ ○
```

---

### 2. Diagonal Grid ⭐⭐ (MEDIUM PRIORITY)
**Concept**: Grid lines at 45° angle

**Parameters**:
- Cell Size: Distance between lines
- Gap: Spacing
- Same style controls

**Technical**:
- Create `src/domain/patterns/diagonalGrid.ts`
- Generate diagonal lines using `line` elements
- Calculate diagonal coordinates

**Complexity**: Medium (coordinate calculations)

**Example**:
```
╱ ╱ ╱ ╱ ╱
╱ ╱ ╱ ╱ ╱
╱ ╱ ╱ ╱ ╱
```

---

### 3. Isometric Grid ⭐⭐ (MEDIUM-HIGH PRIORITY)
**Concept**: 3D perspective (isometric) grid

**Parameters**:
- Cell Size: Width of cells
- Gap: Spacing
- Same style controls

**Technical**:
- Create `src/domain/patterns/isometric.ts`
- Use path elements for perspective
- Calculate isometric coordinates (math-heavy)

**Complexity**: High (isometric math)

**Example**:
```
 ┌─┬─┬─┐
 ├─┼─┼─┤
 └─┴─┴─┘
```

---

### 4-6. Additional Patterns (FUTURE)
- **Zig-zag**: Triangular wave pattern
- **Waves**: Smooth curves
- **Cross/Graph**: Enhanced grid with cross marks

Can be added later without PHASE 3 changes.

---

## IMPLEMENTATION STRATEGY

### Step 1: Set Up Pattern File
```typescript
// src/domain/patterns/dots.ts
import type { PatternGenerator, PatternGeneratorConfig } from '../pattern/PatternGeneratorTypes';
import type { PatternOutput } from '../pattern/PatternOutput';

const DOTS_DEFAULTS = {
  geometry: { cellSize: 20, gap: 0, width: 800, height: 600 },
  style: { strokeColor: '#000000', strokeWidth: 1, ... }
};

function generateDotsPattern(config: PatternGeneratorConfig): PatternOutput {
  // Generation logic here
}

export const dotsPatternGenerator: PatternGenerator = {
  type: 'dots',
  defaults: DOTS_DEFAULTS,
  generate: generateDotsPattern
};
```

### Step 2: Register Pattern
```typescript
// In src/domain/patterns/index.ts
registry.register('dots', dotsPatternGenerator);
```

### Step 3: Update UI (Minimal)
```tsx
// In ControlPanel.tsx - dropdown already has options ready
<option value="dots">Dots</option>
// Just uncomment or ensure it exists
```

### Step 4: Test
- Verify generation works
- Check SVG output
- Test export
- Try with different style controls

---

## CODE EXAMPLE: Dots Pattern

```typescript
function generateDotsPattern(config: PatternGeneratorConfig): PatternOutput {
  const geometry = {
    cellSize: config.geometry.cellSize ?? DOTS_DEFAULTS.geometry.cellSize,
    gap: config.geometry.gap ?? DOTS_DEFAULTS.geometry.gap,
    width: config.geometry.width ?? DOTS_DEFAULTS.geometry.width,
    height: config.geometry.height ?? DOTS_DEFAULTS.geometry.height,
  };

  const style = {
    strokeColor: config.style.strokeColor ?? DOTS_DEFAULTS.style.strokeColor,
    strokeWidth: config.style.strokeWidth ?? DOTS_DEFAULTS.style.strokeWidth,
    // ... other style fields
  };

  const { cellSize, gap, width, height } = geometry;
  const cellStep = cellSize + gap;
  const radius = cellSize / 2;  // Circle diameter = cellSize

  const cols = Math.floor(width / cellStep);
  const rows = Math.floor(height / cellStep);

  const elements: PatternElement[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * cellStep + radius;      // Center X
      const cy = row * cellStep + radius;      // Center Y

      elements.push({
        shape: 'circle',
        x: cx,
        y: cy,
        radius: radius * 0.9,                  // Slightly smaller for visibility
        stroke: style.strokeColor,
        strokeWidth: style.strokeWidth,
        data: {
          strokeOpacity: style.strokeOpacity,
          lineCap: style.lineCap,
          strokeDasharray: style.strokeDasharray,
        },
      });
    }
  }

  return {
    elements,
    dimensions: { width, height },
    metadata: { type: 'dots', ... }
  };
}
```

---

## UI CHANGES NEEDED

### Minimal
- ✅ Dropdown options already exist (Grid, Dots, Waves, Noise)
- Just implement the generators

### Optional Enhancements (PHASE 4+)
- Pattern preview thumbnails
- Description text per pattern
- Recommended style presets per pattern

### No Changes Required
- ✅ Control panel (works with any pattern)
- ✅ SvgRenderer (works with any element type)
- ✅ Export (SVG/PNG unchanged)

---

## DELIVERABLES (PHASE 3)

### Code
- [ ] dotsPatternGenerator (dots.ts)
- [ ] diagonalGridPatternGenerator (diagonalGrid.ts)
- [ ] isometricGridPatternGenerator (isometric.ts)
- [ ] Register all in patterns/index.ts
- [ ] Update PatternType to include new types

### Testing
- [ ] Each pattern generates without errors
- [ ] SVG output is valid
- [ ] Export (SVG/PNG) works correctly
- [ ] All style controls work with new patterns
- [ ] Responsive at different cell sizes

### Documentation
- [ ] PHASE_3_IMPLEMENTATION_SUMMARY.md
- [ ] Visual examples of new patterns
- [ ] Code explanation for each pattern
- [ ] Extension guide for future patterns

---

## TECHNICAL NOTES

### Reuse from PHASE 2
```typescript
// All new patterns automatically get these controls:
✅ Stroke color
✅ Stroke width (NEW from PHASE 2)
✅ Stroke opacity (NEW from PHASE 2)
✅ Line cap (NEW from PHASE 2)
✅ Line style (NEW from PHASE 2)
✅ Background color (NEW from PHASE 2)

// No additional code needed!
```

### Generator Interface
```typescript
interface PatternGenerator {
  type: PatternType;
  defaults: { geometry: GeometryConfig, style: StyleConfig };
  generate(config: PatternGeneratorConfig): PatternOutput;
}
```

All new patterns MUST implement this interface.

### Data Storage
```typescript
// Style data goes in element.data
element.data = {
  strokeOpacity: config.style.strokeOpacity,
  lineCap: config.style.lineCap,
  strokeDasharray: config.style.strokeDasharray,
};
// svgRenderer will read and apply automatically
```

---

## PATTERN-SPECIFIC CHALLENGES

### Dots Pattern
**Challenge**: Calculating circle positions in grid  
**Solution**: Center = (col * cellStep + cellSize/2, row * cellStep + cellSize/2)

### Diagonal Grid  
**Challenge**: Drawing diagonal lines across grid  
**Solution**: Use line elements with calculated endpoints

### Isometric Grid
**Challenge**: Calculating isometric projection  
**Solution**: Use specific transformation formulas:
```
screenX = (x - z) * cos(30°)
screenY = (x + z) * sin(30°) - y
```

---

## QUALITY CHECKLIST

For each new pattern:
- [ ] Cleaner code at all cell sizes
- [ ] No rendering errors
- [ ] SVG is valid and minifiable
- [ ] Works with 0.5px stroke width (minimum)
- [ ] Works with 10px stroke width (maximum)
- [ ] Works with 0% opacity (invisible)
- [ ] Works with 100% opacity (visible)
- [ ] Works in all 3 line cap styles
- [ ] Works with all 3 line styles (solid/dashed/dotted)
- [ ] Background color applies correctly
- [ ] Export SVG matches preview
- [ ] Export PNG matches preview

---

## TESTING STRATEGY

### Unit Tests
- Each generator produces valid PatternOutput
- Dimensions match input width/height
- Element count matches expected grid

### Integration Tests
- Pattern works in PatternCanvas
- Preview updates when controls change
- Export matches preview

### Visual Tests
- Manual inspection of outputs
- Comparison with reference images
- Edge cases (small cells, large strokes)

---

## ARCHITECTURE READINESS

✅ **PatternGenerator interface** - Ready  
✅ **Registry system** - Ready  
✅ **SVG renderer** - Handles all shapes  
✅ **Style system** - Complete (PHASE 2)  
✅ **UI components** - Support multiple patterns  
✅ **Export** - Works with any elements  

**No architectural changes needed!**

---

## ESTIMATED EFFORT

| Pattern | Est. Hours | Complexity | Priority |
|---------|------------|-----------|----------|
| Dots | 2-3 | Low | ⭐⭐⭐ |
| Diagonal | 3-4 | Medium | ⭐⭐ |
| Isometric | 4-5 | High | ⭐⭐ |
| **Total PHASE 3** | **10-12** | **Medium** | **All** |

---

## SUCCESS CRITERIA

PHASE 3 is successful if:
- ✅ 3+ new pattern types available in dropdown
- ✅ Each pattern works with all style controls
- ✅ Export (SVG/PNG) matches preview exactly
- ✅ No bugs or regressions from PHASE 2
- ✅ Code follows established patterns
- ✅ Fully documented

---

## NEXT AFTER PHASE 3

### PHASE 4: Presets
- Save/load combinations of settings
- Built-in presets (notebook grid, dot journal, etc.)
- All patterns + styles = endless presets

### PHASE 5: Random & Seed
- Generate variations randomly
- Reproducible with seed
- Quick exploration

### PHASE 6: Export Advanced
- Multiple resolutions (@1x, @2x, @3x)
- Copy to clipboard
- File size preview

---

## DEVELOPER GUIDE FOR PHASE 3

### Get Started
1. Read PHASE_2_STYLE_CONTROLS_SUMMARY.md
2. Review src/domain/patterns/grid.ts (reference implementation)
3. Create src/domain/patterns/dots.ts
4. Follow the Generator interface
5. Register in patterns/index.ts

### Reference Files
- `src/domain/pattern/PatternGeneratorTypes.ts` - Interface definition
- `src/domain/patterns/grid.ts` - Working example
- `src/domain/patterns/index.ts` - Registry pattern
- `src/domain/renderer/svgRenderer.ts` - SVG generation

### Common Tasks
- **How to add a new shape type?**
  → Update PatternElement.shape union type
  → Add converter function in svgRenderer

- **How to handle complex coordinates?**
  → Use PatternElement.data for extra data
  → Calculate offscreen, store in x/y

- **How to debug generation?**
  → Add console.log in generatePattern
  → Test in browser dev tools
  → Inspect generated SVG

---

## READY TO START?

✅ All prerequisites met  
✅ Architecture proven (PHASE 2 validation)  
✅ Documentation clear  
✅ No blockers  

**PHASE 3 is ready to begin!**

---

Documento: PHASE 3 Roadmap - Planning  
Versión: v3.0.0-planning  
Status: 📋 Ready to Start  
Expected completion: 2-3 sessions (based on PHASE 2 pattern)