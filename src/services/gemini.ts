import { modeThemes } from '../theme';
import type {
  CapturedImage,
  Identification,
  Mode,
  SpeciesFact,
  SpeciesInfo,
  SpeciesMatch,
} from '../types';
import type { SpeciesRecognizer } from './identify';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL ?? 'gemini-flash-latest';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export function hasGeminiApiKey(): boolean {
  return typeof API_KEY === 'string' && API_KEY.length > 0;
}

/** Shape Gemini is asked to return (before mapping to our domain types). */
interface GeminiSpecies {
  commonName?: string;
  scientificName?: string;
  emoji?: string;
  summary?: string;
  conservationStatus?: string;
  funFact?: string;
  confidence?: number;
  facts?: { label?: string; value?: string }[];
}

interface GeminiPayload {
  best?: GeminiSpecies;
  alternatives?: GeminiSpecies[];
}

const speciesSchema = (full: boolean) => ({
  type: 'OBJECT',
  properties: {
    commonName: { type: 'STRING' },
    scientificName: { type: 'STRING' },
    emoji: { type: 'STRING' },
    confidence: { type: 'NUMBER' },
    ...(full
      ? {
          summary: { type: 'STRING' },
          conservationStatus: { type: 'STRING' },
          funFact: { type: 'STRING' },
          facts: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                label: { type: 'STRING' },
                value: { type: 'STRING' },
              },
              required: ['label', 'value'],
            },
          },
        }
      : {}),
  },
  required: full
    ? ['commonName', 'scientificName', 'emoji', 'confidence', 'summary', 'facts']
    : ['commonName', 'scientificName', 'emoji', 'confidence'],
});

const responseSchema = {
  type: 'OBJECT',
  properties: {
    best: speciesSchema(true),
    alternatives: { type: 'ARRAY', items: speciesSchema(false) },
  },
  required: ['best', 'alternatives'],
};

function buildPrompt(mode: Mode): string {
  const label = modeThemes[mode].label.toLowerCase();
  return [
    `You are an expert wildlife biologist. Identify the ${label} shown in the image.`,
    `Provide your single best identification plus up to 2 alternative possibilities.`,
    `For the best match include: common name, scientific name (binomial), one representative emoji,`,
    `a 2–3 sentence summary, conservation status (IUCN category or "Not Evaluated"), one surprising`,
    `fun fact, a confidence between 0 and 1, and 4–6 key facts as label/value pairs`,
    `(e.g. Class or Order, Family, Diet, Lifespan, Size, Habitat).`,
    `If the image does not clearly show a ${label}, still give your best guess and lower the confidence.`,
    `Respond only with JSON matching the provided schema.`,
  ].join(' ');
}

function normalizeConfidence(value: number | undefined): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0.5;
  }
  const scaled = value > 1 ? value / 100 : value;
  return Math.min(1, Math.max(0, scaled));
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'species';
}

function toSpeciesInfo(raw: GeminiSpecies, mode: Mode): SpeciesInfo {
  const commonName = raw.commonName?.trim() || 'Unknown species';
  const facts: SpeciesFact[] = (raw.facts ?? [])
    .filter((f) => f.label && f.value)
    .map((f) => ({ label: f.label as string, value: f.value as string }));

  return {
    id: slugify(commonName),
    category: mode,
    emoji: raw.emoji?.trim() || modeThemes[mode].emoji,
    commonName,
    scientificName: raw.scientificName?.trim() || '—',
    summary: raw.summary?.trim() || 'No description available.',
    facts,
    funFact: raw.funFact?.trim() || '',
    conservationStatus: raw.conservationStatus?.trim() || 'Not Evaluated',
  };
}

function toMatch(raw: GeminiSpecies, mode: Mode): SpeciesMatch {
  return { species: toSpeciesInfo(raw, mode), confidence: normalizeConfidence(raw.confidence) };
}

/**
 * Real recognizer backed by Google Gemini. Sends the captured image (base64)
 * plus a mode-specific prompt and asks for a structured JSON response, which is
 * then mapped onto the app's {@link Identification} shape.
 */
export const googleGeminiRecognizer: SpeciesRecognizer = async (image, mode) => {
  if (!hasGeminiApiKey()) {
    throw new Error('Gemini API key is not configured. Set EXPO_PUBLIC_GEMINI_API_KEY.');
  }
  if (!image.base64) {
    throw new Error('This image has no data to analyze. Please pick another image.');
  }

  const body = {
    contents: [
      {
        parts: [
          { text: buildPrompt(mode) },
          { inline_data: { mime_type: image.mimeType, data: image.base64 } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
    },
  };

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY as string,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Network error contacting Gemini. Check your internet connection.');
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message = json?.error?.message ?? `Gemini request failed (${response.status}).`;
    throw new Error(message);
  }

  const blockReason = json?.promptFeedback?.blockReason;
  if (blockReason) {
    throw new Error(`Gemini could not process this image (${blockReason}).`);
  }

  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  let payload: GeminiPayload;
  try {
    payload = JSON.parse(text) as GeminiPayload;
  } catch {
    throw new Error('Could not read Gemini response. Please try again.');
  }

  if (!payload.best) {
    throw new Error('Gemini did not return an identification. Please try another image.');
  }

  const alternatives = (payload.alternatives ?? []).slice(0, 2).map((alt) => toMatch(alt, mode));

  return {
    best: toMatch(payload.best, mode),
    alternatives,
    isMock: false,
  };
};
