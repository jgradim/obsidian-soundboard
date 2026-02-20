import type {
  AppState,
  PluginSettings,
  Section,
  Tile,
  Track,
} from "src/types";
import { DEFAULT_SETTINGS } from "src/settings";

export const appState: AppState = $state({
  settings: DEFAULT_SETTINGS,
  tracks: {},
  tiles: [],
  sections: [],
})

// Settings
export const updateSettings = (settings: Partial<PluginSettings>): void => {
  appState.settings = { ...appState.settings, ...settings };
}

// Tiles settings.useSections = false
export const addTile = (tile: Tile): void => {
  appState.tiles.push(tile);
}

export const updateTile = (idx: number, tile: Partial<Tile>): void => {
  if (appState.tiles[idx] === undefined) return;

  appState.tiles[idx] = { ...appState.tiles[idx], ...tile };
}

export const removeTile = (idx: number): void => {
  appState.tiles = [
    ...appState.tiles.slice(0, idx),
    ...appState.tiles.slice(idx + 1),
  ];
}

// Tiles settings.useSections = true
export const addSectionTile = (sectionIdx: number, tile: Tile): void => {
  if (appState.sections[sectionIdx]?.tiles === undefined) return;

  appState.sections[sectionIdx].tiles.push(tile);
}

export const updateSectionTile = (sectionIdx: number, idx: number, tile: Partial<Tile>): void => {
  if (appState.sections[sectionIdx]?.tiles[idx] === undefined) return;

  appState.sections[sectionIdx].tiles[idx] = {
    ...appState.sections[sectionIdx].tiles[idx],
    ...tile,
  }
}

export const removeSectionTile = (sectionIdx: number, idx: number): void => {
  if (appState.sections[sectionIdx]?.tiles === undefined) return;

  appState.sections[sectionIdx].tiles = [
    ...appState.sections[sectionIdx].tiles.slice(0, idx),
    ...appState.sections[sectionIdx].tiles.slice(idx + 1),
  ];
}

// Sections
export const addSection = (section: Section): void => {
  appState.sections.push(section);
}

export const updateSection = (idx: number, section: Partial<Section>): void => {
  appState.sections[idx] = { ...appState.sections[idx], ...section } as Section;
}

export const removeSection = (idx: number): void => {
  appState.sections = [
    ...appState.sections.slice(0, idx),
    ...appState.sections.slice(idx + 1),
  ];
}

export const swapSections = (from: number, to: number): void => {
  const swapped = appState.sections.map((section, idx) => {
    if (idx === from) return appState.sections[to] as Section;
    if (idx === to) return appState.sections[from] as Section;

    return section;
  });

  appState.sections = swapped;
}

// Tracks
export const setTracks = (tracks: Record<string, Track>): void => {
  appState.tracks = { ...tracks };
}

export const updateTrack = (path: string, track: Partial<Track>): void => {
  if (appState.tracks[path] === undefined) return;

  appState.tracks[path] = { ...appState.tracks[path], ...track };
}
