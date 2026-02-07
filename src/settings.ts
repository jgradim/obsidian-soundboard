import {App, PluginSettingTab } from "obsidian";

import { type PluginData, type PluginSettings } from "src/types";
import type Soundboard from "src/main";

import renderRootFolderSetting from "src/settings/root-folder";
// import renderSubfolderSetting from "src/settings/subfolders";
import renderTracksSettings from "src/settings/tracks";

export const DEFAULT_SETTINGS: PluginSettings = {
  rootFolder: '',
}

export const DEFAULT_DATA: PluginData = {
  tracks: {},
  tiles: [],
}

export class SoundboardSettingsTab extends PluginSettingTab {
  plugin: Soundboard;

  private rootContainer: HTMLElement;
  private tracksContainer: HTMLElement;

  constructor(app: App, plugin: Soundboard) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    this.rootContainer = containerEl.createDiv();
    this.tracksContainer = containerEl.createDiv();

    this.renderRootFolder();
    this.renderTracks();
  }

  renderRootFolder(): void {
    renderRootFolderSetting(this.rootContainer, this);
  }

  renderTracks(): void {
    renderTracksSettings(this.tracksContainer, this);
  }
}
