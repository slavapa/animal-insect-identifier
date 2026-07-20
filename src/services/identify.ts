import type { Identification, Mode, SpeciesMatch } from '../types';
import { getSpeciesForMode } from '../data/species';

/**
 * A recognizer takes a local image URI plus the selected mode and resolves to
 * an {@link Identification}. This single interface is the seam where a real
 * recognition backend (e.g. Google Cloud Vision) will plug in later — the UI
 * only ever depends on `identifySpecies`, never on how the result is produced.
 */
export type SpeciesRecognizer = (imageUri: string, mode: Mode) => Promise<Identification>;

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
 * species catalog. It simulates model latency and produces a confidence score
 * plus a couple of ranked alternatives, so the UI can be built and tested
 * end-to-end before any real API is connected.
 */
export const mockRecognizer: SpeciesRecognizer = async (imageUri, mode) => {
  await delay(1400);

  const pool = getSpeciesForMode(mode);
  if (pool.length === 0) {
    throw new Error(`No species available for mode "${mode}".`);
  }

  const seed = hashString(imageUri);
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
 * Placeholder for the real backend. To enable Google Cloud Vision:
 *  1. Send the image (base64 or via upload) to the Vision API `labelDetection`
 *     / `webDetection` endpoint using an API key or backend proxy.
 *  2. Map the returned labels to entries in `src/data/species.ts` (or fetch
 *     richer info from a species database keyed by the label).
 *  3. Return an `Identification` in the same shape as `mockRecognizer`.
 *
 * Keeping the same return type means only this constant needs to change to
 * switch the whole app over to real recognition.
 */
// export const googleVisionRecognizer: SpeciesRecognizer = async (imageUri, mode) => { ... };

/**
 * The recognizer the app uses. Swap `mockRecognizer` for `googleVisionRecognizer`
 * (or any other implementation) to go live — nothing else in the UI changes.
 */
export const identifySpecies: SpeciesRecognizer = mockRecognizer;
