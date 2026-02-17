import { TFile, type TAbstractFile } from "obsidian";
import { TILE_DEFAULT_VOLUME } from "src/constants/tile";
import type { Section, Tile, Track } from "src/types";

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

export const isSoundboardFile = (
  file: TAbstractFile,
  rootFolder: string
): boolean => {
  return (
    file instanceof TFile
    && file.path.startsWith(rootFolder)
    && allowedAudioExtensions.includes(file.extension)
  );
}

export const sortTracksByPath = (a: Track, b: Track): number => {
  return a.path.localeCompare(b.path);
}

export const groupTracksBySubfolder = (
  tracks: Record<string, Track>,
  rootFolder: string,
): Record<string, Array<Track>> => {
  const trackArray = Object.values(tracks);
  trackArray.sort(sortTracksByPath)

  return trackArray.reduce((all: Record<string, Array<Track>>, track: Track) => {
    let subfolder = track.path
      .replace(rootFolder, '')
      .split('/')
      .filter((s) => s.length > 0)
      .slice(0, -1)
      .join('/')

    // some tracks may not be organized in subfolders, avoid empty label
    if (subfolder.length === 0) subfolder = '/';

    all[subfolder] = [ ...(all[subfolder] ?? []), track ];

    return all;
  }, {});
}
