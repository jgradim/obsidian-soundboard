export interface Section {
  name: string | null;
  tiles: Array<Tile>;
}

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
  sections: Array<Section>
}

export interface PluginSettings {
  rootFolder: string;
  useSections: boolean;
};

export interface PluginData {
  tracks: Record<string, Track>;
  tiles: Array<Tile>;
  sections: Array<Section>
}

export interface PluginConfiguration {
  settings: PluginSettings;
  data: PluginData;
}
