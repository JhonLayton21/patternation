# PHASE 2 - Quick Reference Guide

**Status**: ✅ Complete  
**Released**: February 7, 2026  
**New Controls**: 5 (Stroke Width, Opacity, Line Cap, Line Style, Background)

---

## NEW CONTROLS IN STYLE SECTION

### 1. Stroke Width
**What it does**: Makes lines thicker or thinner  
**Range**: 0.5px to 10px  
**Default**: 1px  
**How to use**: Drag slider left (thinner) or right (thicker)  
**Export**: Included in SVG as `stroke-width` attribute  

**Examples**:
- 0.5px = hairline (delicate)
- 1px = normal (default)
- 3px = medium (visible)
- 10px = bold (striking)

---

### 2. Stroke Opacity
**What it does**: Controls how transparent the lines are  
**Range**: 0% (invisible) to 100% (solid)  
**Default**: 100%  
**How to use**: Drag slider left (faded) or right (solid)  
**Export**: Included in SVG as `stroke-opacity` attribute  

**Examples**:
- 25% = very faint (ghost grid)
- 50% = half transparent (subtle)
- 75% = mostly visible (balanced)
- 100% = fully solid (bold)

---

### 3. Line Cap
**What it does**: Changes the shape of line endpoints  
**Options**:
1. **Butt (Flat)** – Straight cuts (formal, angular)
2. **Round** – Curved endings (smooth, modern)
3. **Square** – Extended rectangular ends (technical, bold)

**Default**: Butt (Flat)  
**Export**: Included in SVG as `stroke-linecap` attribute  

**When to use**:
- Butt: Architectural, geometric, technical drawings
- Round: Organic, modern web designs, logos
- Square: Bold statements, retro designs

---

### 4. Line Style
**What it does**: Changes line pattern (solid, dashed, or dotted)  
**Options**:
1. **Solid** – Continuous line (standard)
2. **Dashed** – 5px dash, 5px gap (broken, rhythmic)
3. **Dotted** – Small dots (delicate, guide-like)

**Default**: Solid  
**Export**: Included in SVG as `stroke-dasharray` attribute  

**When to use**:
- Solid: Always the safest choice
- Dashed: Accent grids, borders, optional areas
- Dotted: Technical guides, subtle rules, guides

---

### 5. Background
**What it does**: Sets the pattern background color  
**Options**:
- **Color**: Any color you pick (default #FFFFFF white)
- **Transparent**: Remove background (checkerboard shows in preview)

**Default**: #FFFFFF (white)  
**How to use**:
1. Click color square to pick a new color
2. Click "× Transparent" button to remove background
3. Background is included in export (SVG and PNG)

**Note**: In preview, transparent background shows as checkerboard. In export SVG, background is truly transparent (no fill).

---

## EXAMPLE PATTERNS

### Pattern 1: Classic Grid
```javascript
Stroke Color:    #000000 (Black)
Stroke Width:    1px
Opacity:         100%
Line Cap:        Butt (Flat)
Line Style:      Solid
Background:      #FFFFFF (White)

Result: Professional, formal, technical (PHASE 1 legacy)
```

### Pattern 2: Soft Guide Grid
```javascript
Stroke Color:    #cccccc (Light gray)
Stroke Width:    0.5px
Opacity:         30%
Line Cap:        Butt (Flat)
Line Style:      Solid
Background:      #FFFFFF (White)

Result: Minimal, elegant, text-friendly
```

### Pattern 3: Dotted Web Grid
```javascript
Stroke Color:    #3366cc (Blue)
Stroke Width:    1px
Opacity:         60%
Line Cap:        Round
Line Style:      Dotted
Background:      #f5f5f5 (Light gray)

Result: Modern, web-friendly, subtle
```

### Pattern 4: Bold Industrial
```javascript
Stroke Color:    #ff6600 (Orange)
Stroke Width:    4px
Opacity:         100%
Line Cap:        Round
Line Style:      Dashed
Background:      #1a1a1a (Dark)

Result: Bold, striking, high contrast
```

### Pattern 5: Architect's Grid
```javascript
Stroke Color:    #0066ff (Blue)
Stroke Width:    1.5px
Opacity:         100%
Line Cap:        Square
Line Style:      Solid
Background:      #ffffff (White)

Result: Professional, precise, architectural
```

---

## TIPS & TRICKS

### Combining Controls for Effects

**Subtle Motion**
- Use dotted or dashed lines
- Lower opacity (50-70%)
- Round caps for organic feel

**Professional & Minimal**
- Thin stroke (0.5-1px)
- Low opacity (30-50%)
- Solid lines, butt caps
- Light background (#f0f0f0)

**Bold & Memorable**
- Thick stroke (3-5px)
- 100% opacity
- Round or square caps
- Contrasting background

**Web Design Friendly**
- Remove background (transparent)
- Round caps
- Dashed for accents
- Medium opacity (60-80%)

### Exporting with Custom Styles

**All styles export correctly:**
- SVG export = 100% accurate (all attributes included)
- PNG export = looks exactly like preview

**No limitations:**
- Combine any stroke width + opacity + cap + style
- Use any background color
- Works at any export resolution (1000×1000 to 4000×4000)

---

## DIFFERENCES FROM PHASE 1

| Feature | PHASE 1 | PHASE 2 |
|---------|---------|---------|
| Stroke color | ✓ | ✓ (unchanged) |
| **Stroke width** | Fixed 1px | ✅ **Adjustable** |
| **Stroke opacity** | Fixed 100% | ✅ **Adjustable** |
| **Line cap** | Fixed butt | ✅ **3 options** |
| **Line style** | Fixed solid | ✅ **3 presets** |
| **Background** | In renderOptions | ✅ **Color picker** |
| Export quality | Good | Excellent |
| Pattern expressiveness | Limited | Unlimited |

---

## TECHNICAL DETAILS (FOR DEVELOPERS)

### Implementation
- All new controls store in `PatternConfig` (extends `StyleConfig`)
- Styles passed to pattern generators via config
- Generators store style data in `PatternElement.data`
- SVG renderer reads and applies attributes

### API Example
```typescript
const config: PatternConfig = {
  cellSize: 40,
  gap: 0,
  strokeColor: '#000000',
  strokeWidth: 2,           // NEW
  strokeOpacity: 0.75,      // NEW (0-1)
  lineCap: 'round',         // NEW
  strokeDasharray: [5, 5],  // NEW (undefined or array)
  backgroundColor: '#3366cc', // NEW
  width: 800,
  height: 600,
};

const svg = generatePatternSVG({
  type: 'grid',
  config,
  renderOptions: {
    // backgroundColor comes from config now
  }
});
```

### SVG Output
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <!-- Background (if backgroundColor set) -->
  <rect x="0" y="0" width="800" height="600" fill="#3366cc" />
  
  <!-- Pattern elements with new attributes -->
  <rect 
    x="0" y="0" width="40" height="40"
    stroke="#000000"
    stroke-width="2"
    stroke-opacity="0.75"          <!-- NEW -->
    stroke-linecap="round"         <!-- NEW -->
    stroke-dasharray="5,5"         <!-- NEW -->
  />
  <!-- More rects... -->
</svg>
```

---

## BROWSER COMPATIBILITY

**Fully supported in:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

**All SVG attributes used are standard:**
- `stroke-width` – Universal support
- `stroke-opacity` – Universal support
- `stroke-linecap` – Universal support
- `stroke-dasharray` – Universal support

---

## NEXT STEPS: PHASE 3

After PHASE 2, you're ready for:

**PHASE 3: Multiple Pattern Types**
- Dots pattern (circles instead of squares)
- Waves pattern (curves and organic shapes)
- Isometric pattern (3D perspective boxes)

All new patterns will inherit PHASE 2 style controls automatically!

---

## FAQ

**Q: Can I undo changes?**  
A: Browser back button (if you refresh). Future PHASE 5 will add full undo/redo.

**Q: What if I want custom dash patterns?**  
A: PHASE 4 or later might add advanced mode. For now, 3 presets cover most needs.

**Q: Does changing opacity affect the export file size?**  
A: No, opacity is just an attribute in SVG. File size unchanged.

**Q: Can I save my favorite combinations?**  
A: PHASE 4 (Presets) will add save/load. For now, screenshot or manually recreate.

**Q: Why does transparent background show checkerboard?**  
A: Checkerboard is in the preview only (helps you see transparency). Export is truly transparent.

**Q: Can I use these in production?**  
A: Yes! Export SVG can be used directly in any design tool, web page, or print file.

---

## SUPPORT

**Issues or questions?**
1. Check PHASE_2_IMPLEMENTATION_CHECKLIST.md for detailed specs
2. Review PHASE_2_VISUAL_EFFECTS.md for effect examples
3. See PHASE_2_STYLE_CONTROLS_SUMMARY.md for architecture

---

**Status**: ✅ PHASE 2 Complete & Ready to Use

---

Documento: PHASE 2 - Quick Reference Guide  
Versión: v2.1.0-phase2  
Status: ✅ Published