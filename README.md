# PATTERNATION (MVP)

A **pure TypeScript** vector pattern generator for designers and developers.

## Features (MVP)
- **Grid Generator**: Logic-based, deterministic pattern generation.
- **SVG Renderer**: Pure function renderer (React-independent).
- **Interactive UI**: Real-time controls for size, gap, and color.
- **Export System**: 
  - **SVG**: Direct pure vector output.
  - **PNG**: Client-side high-resolution rendering (up to 4k+).

## Tech Stack
- **Core**: TypeScript (Strict Domain Logic)
- **UI**: Next.js (App Router), React
- **Testing**: Vitest (TDD)
- **Styling**: Inline Styles (Semantic HTML)

## Project Structure
```
src/
├── domain/            # Pure Business Logic (No React)
│   ├── pattern/       # Generators & Types
│   ├── renderer/      # SVG Rendering Logic
│   └── core/          # Orchestrator
├── components/        # Presentational Components
│   └── PatternCanvas  # React Wrapper
└── app/               # Next.js Pages & State
```

## Running Locally

```bash
npm install
npm run dev
```

## Running Tests
*(Note: requires fixing vitest config issue first, see vitest-issue.md)*
```bash
npm test
```

## Exporting
Select your desired dimensions (e.g., 2000x2000) and click "Export PNG" to generate high-quality textures ready for production use.
