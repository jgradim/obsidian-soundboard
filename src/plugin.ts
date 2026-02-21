import { Notice, Plugin, TAbstractFile, TFile, TFolder, WorkspaceLeaf } from 'obsidian';

import { DEFAULT_DATA, DEFAULT_SETTINGS, SoundboardSettingsTab } from 'src/settings';
import { type PluginSettings, type PluginData, type PluginConfiguration, type Track } from 'src/types';
import { SoundboardView, VIEW_TYPE_SOUNDBOARD } from 'src/views/view.soundboard';
import { appState } from 'src/state.svelte';
import { buildDefaultSection, isSoundboardFile } from 'src/shared';
import { ICON_COLORS } from 'src/constants/colors';

export default class Soundboard extends Plugin {

  async onload(): Promise<void> {
    // - register handlers inside `onLayoutReady` to avoid events sent on vault load
    // - wait for workspace to be ready before loading config / building app state
    //   otherwise we run into timing issues where `app.vault.getAllLoadedFiles()`
    //   only returns the root (/) folder
    this.app.workspace.onLayoutReady(async () => {
      await this.loadConfig();

      this.registerView(VIEW_TYPE_SOUNDBOARD, (leaf) => new SoundboardView(leaf));
      this.addSettingTab(new SoundboardSettingsTab(this.app, this));

      this.registerEvent(
        this.app.vault.on("create", async (file: TAbstractFile) => {
          if (file instanceof TFile) await this.onFileAdded(file);
          if (file instanceof TFolder) await this.onFolderAdded(file);
        })
      );

      this.registerEvent(
        this.app.vault.on("rename", async (file: TAbstractFile, previousPath: string | null) => {
          if (!previousPath) return; // FIXME: when does this happen?

          if (file instanceof TFile) await this.onFileRenamed(file, previousPath);
          if (file instanceof TFolder) await this.onFolderRenamed(file, previousPath);
        })
      );

      // handle files deleted from sounds root folder
      this.registerEvent(
        this.app.vault.on("delete", async (file: TAbstractFile) => {
          
          if (file instanceof TFile) await this.onFileDeleted(file);
          if (file instanceof TFolder) await this.onFolderDeleted(file);
        })
      );
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

  // --------------------------------------------------------------------------

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

  getSoundboardFiles(): Array<TFile> {
    return this.app.vault.getAllLoadedFiles()
    .filter((file: TAbstractFile) => (
      isSoundboardFile(file, appState.settings.rootFolder)
      && file instanceof TFile
    )) as Array<TFile>
  }

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

  buildVaultTracks(savedData: PluginConfiguration): Record<string, Track> {
    const { vault } = this.app;

    const audioTracks = this.app.vault.getAllLoadedFiles()
      .filter((file: TAbstractFile) => (
        isSoundboardFile(file, savedData.settings.rootFolder)
      ))
      .reduce((tracks, file: TFile) => {
        const track = savedData.data.tracks[file.path] !== undefined
          ? { ...savedData.data.tracks[file.path], uri: vault.adapter.getResourcePath(file.path) }
          : this.buildTrack(file);

        return {
          ...tracks,
          [file.path]: track,
        }
      }, {});

    return audioTracks;
  }

  async loadConfig() {
    const config: PluginConfiguration = await this.loadData() as PluginConfiguration;

    const settings = Object.assign({}, DEFAULT_SETTINGS, config.settings) as PluginSettings;
    const data = Object.assign({}, DEFAULT_DATA, config.data) as PluginData;

    appState.settings = settings;

    appState.tracks = this.buildVaultTracks(config);
    appState.sections = data.sections.map((s) => ({ ...buildDefaultSection(), ...s }));
    appState.tiles = data.tiles ;
  }

  async saveConfig() {
    const config: PluginConfiguration = {
      settings: appState.settings,
      data: {
        tiles: appState.tiles,
        tracks: appState.tracks,
        sections: appState.sections,
      }
    };

    await this.saveData(config);
  }

  async clearData() {
    const config: PluginConfiguration = {
      settings: appState.settings,
      data: DEFAULT_DATA,
    };

    await this.saveData(config);
    await this.loadConfig();
  }

  async cleanData() {
  }

  // --------------------------------------------------------------------------

  async onFolderAdded(folder: TFolder): Promise<void> {
    if (!folder.path.startsWith(appState.settings.rootFolder)) return;

    let count = 0;

    for (const file of this.getSoundboardFiles()) {
      if (!file.path.startsWith(folder.path)) continue;
      if (file.path in appState.tracks) continue;

      appState.tracks[file.path] = this.buildTrack(file);

      count += 1;
    }

    await this.saveConfig();

    new Notice(`Soundboard: ${count} tracks added`);
  }

  async onFolderRenamed(folder: TFolder, previousPath: string): Promise<void> {
    if (!previousPath?.startsWith(appState.settings.rootFolder)) return;
    if (!folder.path.startsWith(appState.settings.rootFolder)) return;

    await this.saveConfig();
  }

  async onFolderDeleted(folder: TFolder): Promise<void> {
    if (!folder.path.startsWith(appState.settings.rootFolder)) return;
    if (!(folder.path in appState.tracks)) return;

    let count = 0;

    for (const file of this.getSoundboardFiles()) {
      if (!file.path.startsWith(folder.path)) continue;
      if (!(file.path in appState.tracks)) continue;

      this.deleteTrack(file);

      count += 1;
    }

    await this.saveConfig();

    new Notice(`Soundboard: ${count} tracks deleted`);
  }

  // TFile handlers
  async onFileAdded(file: TFile): Promise<void> {
    if (!file.path.startsWith(appState.settings.rootFolder)) return;
    if (file.path in appState.tracks) return;

    appState.tracks[file.path] = this.buildTrack(file);

    await this.saveConfig();

    new Notice('Soundboard: 1 track added')
  }

  async onFileRenamed(file: TFile, previousPath: string): Promise<void> {
    if (!file.path.startsWith(appState.settings.rootFolder)) return;
    if (!(previousPath in appState.tracks)) return;
    if (file.path in appState.tracks) return;

    this.renameTrack(file, previousPath);

    await this.saveConfig();

    new Notice('Soundboard: 1 track updated')
  }

  async onFileDeleted(file: TFile): Promise<void> {
    if (!file.path.startsWith(appState.settings.rootFolder)) return;
    if (!(file.path in appState.tracks)) return;

    this.deleteTrack(file);

    await this.saveConfig();

    new Notice('Soundboard: 1 track deleted')
  }

  renameTrack(file: TFile, previousPath: string): void {
    // update tiles that reference path
    appState.tiles = appState.tiles
      .map((tile) => {
        if (tile.track !== previousPath) return tile;

        tile.track = file.path;
        return tile;
      });

    // update tiles in sections that reference path
    appState.sections = appState.sections
      .map((section) => ({
        ...section,
        tiles: section.tiles.map((tile) => {
          if (tile.track !== previousPath) return tile;

          tile.track = file.path;
          return tile;
        })
      }));

    // update track
    appState.tracks[file.path] = Object.assign({}, appState.tracks[previousPath]);
    delete appState.tracks[previousPath];
  }

  deleteTrack(file: TFile): void {
    // delete tiles that reference path
    appState.tiles = appState.tiles
      .filter((tile) => tile.track !== file.path);

    // delete tiles in sections that reference path
    appState.sections = appState.sections
      .map((section) => ({
        ...section,
        tiles: section.tiles.filter((tile) => tile.track !== file.path)
      }))

    // delete track
    delete appState.tracks[file.path];
  }
}
