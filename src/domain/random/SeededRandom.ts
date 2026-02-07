/**
 * PHASE 5: Seeded Random Utility
 * 
 * Generador pseudoaleatorio con seed para reproducibilidad
 * Mismo seed siempre produce el mismo resultado
 */

/**
 * Simple seeded random number generator
 * Based on David Bau's seedrandom algorithm
 * https://github.com/davidbau/seedrandom
 */
class SeededRandom {
  private seed: number;

  constructor(seedValue: string | number) {
    // Convert string seed to number via hash
    let numSeed: number;
    if (typeof seedValue === 'string') {
      numSeed = this.hashString(seedValue);
    } else {
      numSeed = Math.abs(Math.floor(seedValue));
    }

    // Ensure valid seed (not 0)
    this.seed = numSeed || 1;
  }

  /**
   * Simple string hash function
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate next random number between 0 and 1
   * Uses linear congruential generator (LCG)
   */
  next(): number {
    // LCG parameters (from Numerical Recipes)
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    this.seed = (a * this.seed + c) % m;
    return this.seed / m;
  }

  /**
   * Random integer between min and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    const range = max - min + 1;
    return Math.floor(this.next() * range) + min;
  }

  /**
   * Random float between min and max
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Choose random element from array
   */
  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

/**
 * Create a SeededRandom instance from a seed value
 */
export function createSeededRandom(seed: string | number): SeededRandom {
  return new SeededRandom(seed);
}

/**
 * Deterministic random with string seed (main export)
 */
export function seededRandom(seed: string | number) {
  return new SeededRandom(seed);
}
