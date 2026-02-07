import type { AppState, Tile, Track } from "src/types";

export const appState: AppState = $state({
  tracks: {},
  tiles: []
})

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

export const setTracks = (tracks: Record<string, Track>): void => {
  appState.tracks = { ...tracks };
}

export const updateTrack = (path: string, track: Partial<Track>): void => {
  if (appState.tracks[path] === undefined) return;

  appState.tracks[path] = { ...appState.tracks[path], ...track };
}
