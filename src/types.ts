export type Mode = 'animal' | 'insect';

export interface CapturedImage {
  /** Local URI, used for on-screen preview. */
  uri: string;
  /** Base64-encoded image data, used to send the image to a recognition API. */
  base64: string | null;
  /** MIME type of the image, e.g. "image/jpeg". */
  mimeType: string;
}

export interface SpeciesFact {
  label: string;
  value: string;
}

export interface SpeciesInfo {
  id: string;
  category: Mode;
  emoji: string;
  commonName: string;
  scientificName: string;
  summary: string;
  facts: SpeciesFact[];
  funFact: string;
  conservationStatus: string;
}

export interface SpeciesMatch {
  species: SpeciesInfo;
  /** Confidence from 0 to 1. */
  confidence: number;
}

export interface Identification {
  /** The most likely match. */
  best: SpeciesMatch;
  /** Other plausible matches, ranked by confidence (highest first). */
  alternatives: SpeciesMatch[];
  /** True while results come from the local mock instead of a real recognition API. */
  isMock: boolean;
}
