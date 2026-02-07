import type { Tile } from "src/types";

export const allowedAudioExtensions = [
  'mp3',
  'wav',
  'ogg',
];

export const createDefaultTile = (): Tile => ({
  track: null,
  volume: 1,
  loop: false,
});
