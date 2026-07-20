import type { CapturedImage, Identification, Mode, SpeciesMatch } from '../types';
import { getSpeciesForMode } from '../data/species';
import { googleGeminiRecognizer, hasGeminiApiKey } from './gemini';

/**
 * A recognizer takes the captured image plus the selected mode and resolves to
 * an {@link Identification}. This single interface is the seam where a real
 * recognition backend plugs in — the UI only ever depends on `identifySpecies`,
 * never on how the result is produced.
 */
export type SpeciesRecognizer = (image: CapturedImage, mode: Mode) => Promise<Identification>;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Small deterministic string hash so the same image yields the same mock result. */
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Mock recognizer: returns a plausible, deterministic result from the local
 * species catalog. Used as a fallback when no Gemini API key is configured, so
 * the app still works end-to-end offline.
 */
export const mockRecognizer: SpeciesRecognizer = async (image, mode) => {
  await delay(1400);

  const pool = getSpeciesForMode(mode);
  if (pool.length === 0) {
    throw new Error(`No species available for mode "${mode}".`);
  }

  const seed = hashString(image.uri);
  const bestIndex = seed % pool.length;

  const best: SpeciesMatch = {
    species: pool[bestIndex],
    confidence: 0.72 + (seed % 23) / 100, // ~0.72–0.94
  };

  const alternatives: SpeciesMatch[] = pool
    .filter((_, i) => i !== bestIndex)
    .slice(0, 2)
    .map((species, i) => ({
      species,
      confidence: Math.max(0.08, best.confidence - 0.25 - i * 0.12),
    }));

  return { best, alternatives, isMock: true };
};

/**
 * The recognizer the app uses. When a Gemini API key is configured
 * (EXPO_PUBLIC_GEMINI_API_KEY), real recognition is used; otherwise the app
 * falls back to the offline mock so it still runs.
 */
export const identifySpecies: SpeciesRecognizer = hasGeminiApiKey()
  ? googleGeminiRecognizer
  : mockRecognizer;
