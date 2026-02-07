import { Notice, Plugin, TAbstractFile, TFile, WorkspaceLeaf } from 'obsidian';

import { DEFAULT_DATA, DEFAULT_SETTINGS, SoundboardSettingsTab } from 'src/settings';
import { type PluginSettings, type PluginData, type PluginConfiguration, type Track } from 'src/types';
import { SoundboardView, VIEW_TYPE_SOUNDBOARD } from 'src/views/view.soundboard';
import { appState } from 'src/state.svelte';
import { allowedAudioExtensions } from './shared';
import { ICON_COLORS } from './constants/colors';

export default class Soundboard extends Plugin {
  settings: PluginSettings;
  data: PluginData;

  buildTrack(file: TFile): Track {
    const { bg, fg } = ICON_COLORS.at(Math.floor(Math.random() * ICON_COLORS.length))!

    return {
      path: file.path,
      uri: this.app.vault.adapter.getResourcePath(file.path),
      name: file.name,
      icon: 'music',
      bg,
      fg,
    }
  }

  buildVaultTracks(): Record<string, Track> {
    const { vault } = this.app;

    const audioTracks = this.app.vault.getAllLoadedFiles()
      .filter((file: TAbstractFile) => (
        file instanceof TFile
        && file.path.startsWith(this.settings.rootFolder)
        && allowedAudioExtensions.includes(file.extension)
      ))
      .reduce((tracks, file: TFile) => {
        const track = this.data.tracks[file.path] !== undefined
          ? { ...this.data.tracks[file.path], uri: vault.adapter.getResourcePath(file.path) }
          : this.buildTrack(file);

        return {
          ...tracks,
          [file.path]: track,
        }
      }, {});

    // console.log('buildVaultTracks', audioTracks);

    return audioTracks;
  }

  async loadConfig() {
    const config: PluginConfiguration = await this.loadData() as PluginConfiguration;

    // console.log('loadConfig', config);

    const settings = Object.assign({}, DEFAULT_SETTINGS, config.settings);
    const data = Object.assign({}, DEFAULT_DATA, config.data);

    this.settings = settings;
    this.data = data;
    this.data.tracks = this.buildVaultTracks()

    appState.tiles = [ ...this.data.tiles ];
    appState.tracks = { ...this.data.tracks };
  }

  async saveConfig() {
    const config: PluginConfiguration = {
      settings: this.settings,
      data: {
        tiles: appState.tiles,
        tracks: appState.tracks,
      }
    };

    // console.log('saveConfig', config);

    await this.saveData(config);
  }

  async clearData() {
    const config: PluginConfiguration = {
      settings: this.settings,
      data: DEFAULT_DATA,
    };

    await this.saveData(config);
    await this.loadConfig();
  }

  async cleanData() {
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_SOUNDBOARD);

    if (leaves.length > 0) {
      leaf = leaves[0] as WorkspaceLeaf;
    } else {
      leaf = workspace.getRightLeaf(false) as WorkspaceLeaf;
      await leaf.setViewState({ type: VIEW_TYPE_SOUNDBOARD, active: true });
    }

    await workspace.revealLeaf(leaf);
  }

  async onload(): Promise<void> {
    // wait for workspace to be ready before loading config / building app state
    //
    // otherwise we run into timing issues where `app.vault.getAllLoadedFiles()`
    // only returns the root (/) folder
    this.app.workspace.onLayoutReady(async () => {
      await this.loadConfig();

      this.registerView(VIEW_TYPE_SOUNDBOARD, (leaf) => new SoundboardView(leaf));
      this.addSettingTab(new SoundboardSettingsTab(this.app, this));
    });

    this.addRibbonIcon('audio-lines', 'Soundboard', async (_ev: MouseEvent) => {
      await this.activateView();
    });

    this.addCommand({
      id: 'open-soundboard',
      name: 'Open soundboard',
      callback: () => {
        new Notice('Open soundboard');
      }
    });

    this.addCommand({
      id: 'open-soundboard-popout',
      name: 'Open soundboard (new window)',
      callback: () => {
        new Notice('Open soundboard (new window)');
      }
    });
  }

  onunload(): void {
    this.saveConfig()
      .catch(() => {});
  }
}
