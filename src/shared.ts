import type { Section, Tile } from "src/types";

export const allowedAudioExtensions = [
  'mp3',
  'wav',
  'ogg',
];

export const buildDefaultSection = (): Section => ({
  name: null,
  tiles: [],
});

export const buildDefaultTile = (): Tile => ({
  track: null,
  volume: 1,
  loop: false,
});
