/**
 * PHASE 5: Random Pattern State Generator
 * 
 * Produces valid, interesting PatternState values
 * Deterministic based on seed
 */

import { createSeededRandom } from './SeededRandom';
import type { PatternState } from '@/domain/presets';
import type { PatternType } from '@/domain/pattern/PatternType';

/**
 * Available pattern types to randomize
 * All 7 patterns from PHASE 3
 */
const AVAILABLE_PATTERNS: PatternType[] = [
  'grid',
  'dots',
  'diagonalGrid',
  'isometric',
  'zigzag',
  'waves',
  'cross'
];

/**
 * Line cap styles
 */
type LineCap = 'butt' | 'round' | 'square';
const LINE_CAPS: LineCap[] = ['butt', 'round', 'square'];

/**
 * Dash patterns
 */
type DashPattern = 'solid' | 'dashed' | 'dotted';
const DASH_PATTERNS: DashPattern[] = ['solid', 'dashed', 'dotted'];

/**
 * Generate interesting random HSL colors
 * Constrained to avoid ugly/unreadable combinations
 */
function generateRandomColor(rng: ReturnType<typeof createSeededRandom>): string {
  // Hue: full range (0-360)
  const hue = rng.nextInt(0, 360);

  // Saturation: 30-100 (avoid too-gray colors)
  const saturation = rng.nextInt(30, 100);

  // Lightness: 20-70 (avoid too-dark or too-light)
  const lightness = rng.nextInt(20, 70);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generate a fully random, valid PatternState
 * 
 * Constraints:
 * - Cell size: 10-50px (reasonable drawing range)
 * - Gap: 0-10px (practical range)
 * - Stroke width: 0.5-5px (visible range)
 * - Opacity: 0.3-1 (keep visible)
 * - Background: random color or transparent
 * - Pattern: any of the 7 types
 * - Line cap: butt, round, square
 * - Dash: solid, dashed, dotted
 */
export function generateRandomPatternState(
  seed: string | number
): PatternState {
  const rng = createSeededRandom(seed);

  // Pattern type
  const patternType = rng.choice(AVAILABLE_PATTERNS);

  // Geometry
  const cellSize = rng.nextInt(12, 45);
  const gap = rng.nextInt(0, 8);

  // Colors
  const strokeColor = generateRandomColor(rng);
  const backgroundColor = rng.next() > 0.3 ? generateRandomColor(rng) : '#ffffff';

  // Style properties
  const strokeWidth = rng.nextFloat(0.5, 4.5);
  const strokeOpacity = rng.nextFloat(0.4, 1.0);
  const lineCap = rng.choice(LINE_CAPS);
  const strokeDasharray = rng.choice(DASH_PATTERNS);

  return {
    patternType,
    cellSize,
    gap,
    strokeColor,
    strokeWidth,
    strokeOpacity,
    lineCap,
    strokeDasharray,
    backgroundColor
  };
}

/**
 * Generate a "soft random" - less extreme variations
 * Good for "next idea" exploration
 * 
 * Keeps pattern type same, varies style
 */
export function generateSoftRandomPatternState(
  currentState: PatternState,
  seed: string | number
): PatternState {
  const rng = createSeededRandom(seed);

  return {
    // Keep same pattern
    patternType: currentState.patternType,

    // Slight geometry variation (±5px)
    cellSize: Math.max(10, currentState.cellSize + rng.nextInt(-5, 5)),
    gap: Math.max(0, currentState.gap + rng.nextInt(-2, 2)),

    // Random colors
    strokeColor: generateRandomColor(rng),
    backgroundColor: rng.next() > 0.3 ? generateRandomColor(rng) : currentState.backgroundColor,

    // Slight style variation
    strokeWidth: Math.max(0.5, currentState.strokeWidth + rng.nextFloat(-1, 1.5)),
    strokeOpacity: Math.max(0.3, Math.min(1, currentState.strokeOpacity + rng.nextFloat(-0.2, 0.3))),
    lineCap: rng.choice(LINE_CAPS),
    strokeDasharray: rng.choice(DASH_PATTERNS)
  };
}

/**
 * Generate numeric seed from current timestamp
 * Useful for "random feel" without manual seed entry
 */
export function generateRandomSeed(): string {
  return Date.now().toString();
}

/**
 * Validate that a seed string is valid
 */
export function isValidSeed(seed: string | number | undefined): boolean {
  if (seed === undefined || seed === null) return false;
  if (typeof seed === 'number') return true;
  if (typeof seed === 'string' && seed.trim().length > 0) return true;
  return false;
}
