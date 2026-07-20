import type { Mode } from './types';

export const colors = {
  background: '#0f1419',
  surface: '#1b232c',
  surfaceMuted: '#232e39',
  border: '#31404d',
  text: '#f2f6f9',
  textMuted: '#9fb0bd',
  textFaint: '#6d7f8c',
  white: '#ffffff',
  danger: '#ff6b6b',
  animal: '#f2a541',
  animalSoft: '#3a2f1c',
  insect: '#5bd6a6',
  insectSoft: '#1d3a30',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export interface ModeTheme {
  key: Mode;
  label: string;
  emoji: string;
  accent: string;
  accentSoft: string;
  tagline: string;
}

export const modeThemes: Record<Mode, ModeTheme> = {
  animal: {
    key: 'animal',
    label: 'Animal',
    emoji: '🐾',
    accent: colors.animal,
    accentSoft: colors.animalSoft,
    tagline: 'Identify mammals, birds, reptiles & more',
  },
  insect: {
    key: 'insect',
    label: 'Insect',
    emoji: '🐞',
    accent: colors.insect,
    accentSoft: colors.insectSoft,
    tagline: 'Identify bugs, butterflies, bees & more',
  },
};
