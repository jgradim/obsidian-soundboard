import {App, PluginSettingTab } from "obsidian";

import { type PluginData, type PluginSettings } from "src/types";
import type Soundboard from "src/main";

import renderRootFolderSetting from "src/settings/root-folder";
import renderTracksSettings from "src/settings/tracks";
import renderSectionsSettings from "./settings/sections";
import renderDataSettings from "./settings/data";

export const DEFAULT_SETTINGS: PluginSettings = {
  rootFolder: '',
  useSections: false,
}

export const DEFAULT_DATA: PluginData = {
  tracks: {},
  tiles: [],
  sections: [],
}

export class SoundboardSettingsTab extends PluginSettingTab {
  plugin: Soundboard;

  private rootContainer: HTMLElement;
  private sectionsContainer: HTMLElement;
  private tracksContainer: HTMLElement;
  private dataContainer: HTMLElement;

  constructor(app: App, plugin: Soundboard) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    this.rootContainer = containerEl.createDiv();
    this.sectionsContainer = containerEl.createDiv();
    this.tracksContainer = containerEl.createDiv();
    this.dataContainer = containerEl.createDiv();

    this.renderRootFolder();
    this.renderSections();
    this.renderTracks();
    this.renderClearData();
  }

  renderRootFolder(): void {
    renderRootFolderSetting(this.rootContainer, this);
  }

  renderTracks(): void {
    renderTracksSettings(this.tracksContainer, this);
  }

  renderSections(): void {
    renderSectionsSettings(this.sectionsContainer, this);
  }

  renderClearData(): void {
    renderDataSettings(this.dataContainer, this);
  }
}
