/**
 * PHASE 5: Random Module
 * Public API for seeded randomization
 */

export { createSeededRandom, seededRandom } from './SeededRandom';
export {
  generateRandomPatternState,
  generateSoftRandomPatternState,
  generateRandomSeed,
  isValidSeed
} from './randomPatternGenerator';
