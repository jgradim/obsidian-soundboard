import { TILE_DEFAULT_VOLUME } from "src/constants/tile";
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
  volume: TILE_DEFAULT_VOLUME,
  loop: false,
});
