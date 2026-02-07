export interface Track {
  path: string;
  uri: string;
  name: string;
  icon: string;
  bg: string;
  fg: string;
}

export interface Tile {
  track: string | null;
  volume: number;
  loop: boolean;
}

export interface AppState {
  tracks: Record<string, Track>;
  tiles: Array<Tile>;
}

export interface PluginSettings {
  rootFolder: string;
};

export interface PluginData {
  tracks: Record<string, Track>;
  tiles: Array<Tile>;
}

export interface PluginConfiguration {
  settings: PluginSettings;
  data: PluginData;
}
