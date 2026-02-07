# PATTERNATION V2 - PHASE 1 UI STRUCTURE

Visual guide del nuevo layout y componentes

---

## Layout Visual

```
┌──────────────────────────────────────────────────────────────────┐
│  H E A D E R                                                     │
│  Patternation  |  Generador de patrones creativos              │
└──────────────────────────────────────────────────────────────────┘

┌────────────────────┬───────────────────────────────────────────┐
│                    │  [50%] [100%] [200%]  | [Checkerboard] │
│                    ├───────────────────────────────────────────┤
│  CONTROLS          │                                           │
│  (LEFT SIDEBAR)    │                                           │
│                    │                                           │
│  ┌──────────────┐  │          PREVIEW                        │
│  │  PATTERN     │  │          (MAIN FOCUS)                   │
│  ├──────────────┤  │                                           │
│  │  GEOMETRY    │  │          70% viewport                   │
│  ├──────────────┤  │          Centered                        │
│  │  STYLE       │  │          Drop shadow                     │
│  ├──────────────┤  │          Zoom-enabled                    │
│  │  EXPORT      │  │                                           │
│  └──────────────┘  │                                           │
│  (~320px)          │  (flex, grows to fill)                   │
│                    │                                           │
└────────────────────┴───────────────────────────────────────────┘
```

---

## SECTION: Pattern

```
┌─────────────────────────────────────────┐
│  PATTERN                    (uppercase)  │
├─────────────────────────────────────────┤
│  Type          (label)                  │
│  ┌─────────────────────────────────────┐│
│  │ Grid         ▼      (dropdown)      ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## SECTION: Geometry

```
┌─────────────────────────────────────────┐
│  GEOMETRY                   (uppercase)  │
├─────────────────────────────────────────┤
│  Cell Size              20px  (label + value)
│  ├─5─────[●]───────────100─┤ (slider with thumb)
│                            │
│  Gap                      0px
│  ├─0────────────[●]────────50─┤
│                            │
└─────────────────────────────────────────┘
```

### Slider Details
```
Thumb (16px circle):
- Color: #0070f3 (primary blue)
- Hover: scale(1.1) + shadow
- Transition: 0.2s ease
- Track: gray (#e0e0e0)
```

---

## SECTION: Style

```
┌─────────────────────────────────────────┐
│  STYLE                      (uppercase)  │
├─────────────────────────────────────────┤
│  Stroke Color                           │
│  ┌──────┐  #000000      (color picker + hex)
│  │ ■■■■ │
│  └──────┘
│
└─────────────────────────────────────────┘
```

### Color Picker
```
Input[type=color]:
- Size: 50px × 40px
- Border: #e0e0e0
- Radius: 6px
- Hex display: Monaco font, 0.8rem
```

---

## SECTION: Export

```
┌─────────────────────────────────────────┐
│  EXPORT                     (uppercase)  │
├─────────────────────────────────────────┤
│  PNG Size (px)                          │
│  ┌────┐ × ┌────┐   (width × height)
│  │2000│   │2000│
│  └────┘   └────┘
│
│  ┌─────────────────────────────────┐
│  │  ↓ Export SVG   ← Primary (blue)│
│  └─────────────────────────────────┘
│  ┌─────────────────────────────────┐
│  │  ↓ Export PNG   ← Secondary     │
│  └─────────────────────────────────┘
│
└─────────────────────────────────────────┘
```

### Button States
```
Normal:
  Background: #0070f3 (SVG) | #333 (PNG)
  Color: white
  Padding: 12px 16px
  Radius: 6px
  Font: 600, 0.9rem

Hover:
  Transform: translateY(-1px)
  Shadow: 0 4px 12px rgba(0,0,0,0.15)

Active/Click:
  Transform: translateY(0)

Disabled:
  Opacity: 0.5
  Cursor: not-allowed
  Text: "⏳ Exporting..."
```

---

## Preview Toolbar

```
┌─────────────────────────────────────────────────────┐
│  [50%] [100%] [200%]      |      [● Checkerboard]  │
└─────────────────────────────────────────────────────┘
```

### Zoom Buttons
```
Normal:
  Background: transparent
  Color: #666 (secondary)
  Border: 1px #e0e0e0
  Padding: 8px 12px
  Radius: 4px

Hover:
  Background: rgba(0,112,243, 0.1)
  Color: #0070f3

Active:
  Background: #0070f3
  Color: white
  Font-weight: 600
  Border-color: #0070f3
```

### Checkerboard Toggle
```
Normal:
  Background: white
  Border: 1px #e0e0e0
  Color: #171717
  Display: "Checkerboard" or "Solid"

Hover:
  Border: #0070f3
  Color: #0070f3
  Background: rgba(0,112,243, 0.05)

Active:
  Background: #0070f3
  Color: white
  Border-color: #0070f3
```

---

## Preview Viewport

```
┌────────────────────────────────────────────┐
│                                            │
│                                            │
│         [SVG Pattern @ current zoom]       │
│                                            │
│         (Drop shadow, centered)            │
│         (Checkerboard optional bg)         │
│                                            │
│                                            │
└────────────────────────────────────────────┘
```

### Checkerboard Pattern
```
CSS:
background-image: 
  linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
  linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
  linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
background-size: 10px 10px;
background-position: 0 0, 0 5px, 5px -5px, -5px 0px;

Result:
  ▮ ▯ ▮ ▯ ▮ ▯
  ▯ ▮ ▯ ▮ ▯ ▮
  ▮ ▯ ▮ ▯ ▮ ▯
  (10px × 10px squares, gray & white)
```

---

## Responsive Behavior

### Desktop (> 1024px)
```
┌────────────────────────────────────────────┐
│ HEADER                                     │
└────────────────────────────────────────────┘
┌──────────┬─────────────────────────────────┐
│ LEFT     │      PREVIEW + TOOLBAR          │
│ (320px)  │      (~70% viewport)            │
│          │                                 │
│ CONTROLS │      (Flex, grows)              │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌────────────────────────────────────────────┐
│ HEADER                                     │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│  CONTROLS (horizontal wrap, compact)       │
│  [Pattern▼] [Size ├──●──┤] [Color ■]     │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│      PREVIEW (full width)                  │
│                                            │
│      (Min height: 400px)                   │
│                                            │
└────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌────────────────────────────────────────────┐
│ HEADER (centered)                          │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│  Pattern                                   │
│  ┌──────────────────────────────────────┐ │
│  │ Grid                         ▼       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Geometry                                  │
│  ┌──────────────────────────────────────┐ │
│  │ Cell Size: 20px                      │ │
│  │ ├──●─────────────────┤              │ │
│  │ Gap: 0px                             │ │
│  │ ├────────────●───────┤              │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ... (continue stacked)                    │
└────────────────────────────────────────────┘
```

---

## Color Palette

```
PRIMARY
  – #0070f3          (Actions, active states)
  – #0051cc          (Hover states)

SECONDARY
  – #333333          (Text, secondary actions)
  – #1a1a1a          (Hover state)

NEUTRAL
  – #ffffff / #0a0a0a    (Background light/dark)
  – #f8f9fa / #1a1a1a    (Subtle background)
  – #e0e0e0 / #333     (Borders)
  – #171717 / #ededed    (Text)
  – #666666 / #999     (Secondary text)
```

---

## Typography Scale

```
HEADINGS
  – App Title: 1.5rem, weight 700, letter-spacing -0.5px
  – Section Title: 0.75rem, weight 700, uppercase, letter-spacing 0.5px

BODY
  – Labels: 0.85rem, weight 500
  – Values: 0.8rem, weight 500, secondary color
  – Description: 0.9rem, weight 400

MONOSPACE
  – Hex colors: Monaco, 0.8rem, weight 500
  – Code/debug: Courier New, 0.85rem
```

---

## Spacing System

```
xs   = 4px     (tight)
sm   = 8px     (compact)
md   = 12px    (default)
lg   = 16px    (comfortable)
xl   = 24px    (spacious)
2xl  = 32px    (generous)

Application:
  – Section gaps: lg (16px)
  – Control gaps: md (12px)
  – Component padding: md-lg
  – Section divider margin: xl top/bottom
```

---

## Microinteractions

### Slider Thumb on Hover
```
Transform: scale(1.1)
Shadow: 0 2px 6px rgba(0,112,243,0.3)
Duration: 0.2s ease
```

### Button on Hover
```
Transform: translateY(-1px)
Shadow: 0 4px 12px rgba(0,0,0,0.15)
Duration: 0.2s ease
```

### Input on Focus
```
Border: #0070f3
Box-shadow: 0 0 0 2px rgba(0,112,243,0.1)
Transition: all 0.2s ease
```

### Zoom on Change
```
Transform: scale(zoom-value)
Transform-origin: top center
Transition: transform 0.2s ease-out
```

---

## Component Hierarchy

```
Home (page.tsx)
  ├─ Header
  │   ├─ Title
  │   └─ Subtitle
  │
  ├─ ControlPanel (src/components/ControlPanel.tsx)
  │   ├─ Section: Pattern
  │   ├─ Section: Geometry
  │   ├─ Section: Style
  │   └─ Section: Export
  │
  └─ PreviewSection
      ├─ PreviewControls (src/components/PreviewControls.tsx)
      │   ├─ ZoomButtons
      │   └─ CheckerboardToggle
      │
      └─ PatternCanvas (src/components/PatternCanvas.tsx)
          └─ SVG (generated)
```

---

## Design Tokens (CSS Variables)

```css
:root {
  --color-primary: #0070f3;
  --color-primary-dark: #0051cc;
  --color-secondary: #333333;
  --color-bg: #ffffff;
  --color-bg-subtle: #f8f9fa;
  --color-border: #e0e0e0;
  --color-text: #171717;
  --color-text-secondary: #666666;
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}
```

---

**Documento**: PHASE 1 - UI Structure & Visual Guide  
**Versión**: v2.0.0-phase1  
**Status**: Ready for Implementation
