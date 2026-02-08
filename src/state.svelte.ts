import type { AppState, Section, Tile, Track } from "src/types";

export const appState: AppState = $state({
  tracks: {},
  tiles: [],
  sections: [],
})

// Tiles settings.useSections = false
export const addTile = (tile: Tile): void => {
  console.log('addTile', { tile });

  appState.tiles.push(tile);
}

export const updateTile = (idx: number, tile: Partial<Tile>): void => {
  console.log('updateTile', { idx, tile });

  if (appState.tiles[idx] === undefined) return;

  appState.tiles[idx] = { ...appState.tiles[idx], ...tile };
}

export const removeTile = (idx: number): void => {
  console.log('removeTile', { idx });

  appState.tiles = [
    ...appState.tiles.slice(0, idx),
    ...appState.tiles.slice(idx + 1),
  ];
}

// Tiles settings.useSections = true
export const addSectionTile = (sectionIdx: number, tile: Tile): void => {
  console.log('addSectionTile', { sectionIdx, tile });

  if (appState.sections[sectionIdx]?.tiles === undefined) return;

  appState.sections[sectionIdx].tiles.push(tile);
}

export const updateSectionTile = (sectionIdx: number, idx: number, tile: Partial<Tile>): void => {
  console.log('updateSectionTile', { sectionIdx, idx, tile });

  if (appState.sections[sectionIdx]?.tiles[idx] === undefined) return;

  appState.sections[sectionIdx].tiles[idx] = {
    ...appState.sections[sectionIdx].tiles[idx],
    ...tile,
  }
}

export const removeSectionTile = (sectionIdx: number, idx: number): void => {
  console.log('removeSectionTile', { sectionIdx, idx, });

  if (appState.sections[sectionIdx]?.tiles === undefined) return;

  appState.sections[sectionIdx].tiles = [
    ...appState.sections[sectionIdx].tiles.slice(0, idx),
    ...appState.sections[sectionIdx].tiles.slice(idx + 1),
  ];
}

// Sections
export const addSection = (section: Section): void => {
  console.log('addTile', { section });
  appState.sections.push(section);
}

export const updateSection = (idx: number, section: Partial<Section>): void => {
  console.log('updateSection', { idx, section });
  appState.sections[idx] = { ...appState.sections[idx], ...section } as Section;
}

export const removeSection = (idx: number): void => {
  console.log('removeSection', { idx });
  appState.sections = [
    ...appState.sections.slice(0, idx),
    ...appState.sections.slice(idx + 1),
  ];
}

// Tracks
export const setTracks = (tracks: Record<string, Track>): void => {
  appState.tracks = { ...tracks };
}

export const updateTrack = (path: string, track: Partial<Track>): void => {
  if (appState.tracks[path] === undefined) return;

  appState.tracks[path] = { ...appState.tracks[path], ...track };
}
