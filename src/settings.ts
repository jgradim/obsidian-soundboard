import {App, FuzzyMatch, normalizePath, PluginSettingTab, Setting, TFolder} from "obsidian";

import { ObsidianSoundboardPluginSettings } from "./types";
import ObsidianSoundboard from "main";
import { FolderInputSuggest } from "@javalent/utilities";
// import { FolderInputSuggest } from "suggest.folder";

export const DEFAULT_SETTINGS: ObsidianSoundboardPluginSettings = {
  sourceFolder: '',
  mapSubfoldersToCategories: false,
}

export class ObsidianSoundboardSettingsTab extends PluginSettingTab {
  plugin: ObsidianSoundboard;

  constructor(app: App, plugin: ObsidianSoundboard) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Sounds folder location")
      .setDesc("Sound files in this folder will be available for Obsidian Soundboard to use.")
      .addSearch((search) => {
        search
          .setPlaceholder('Sounds folder location')
          .setValue(this.plugin.settings.sourceFolder)
          .onChange(async (val) => {
            console.log(`onChange folder: ${val}`);
            this.plugin.settings.sourceFolder = val;
            await this.plugin.saveSettings();
          })

        const suggestions = new FolderInputSuggest(this.app, search, this.app.vault.getAllFolders(false));
        // const suggestions = new FolderInputSuggest(this.app, search, []);
        suggestions.onSelect((result: FuzzyMatch<TFolder>) => {
          const path = normalizePath(result.item.path);
          console.log(`onSelect folder: ${result.item.path} => ${path}`);
          search.setValue(path);
        })
      })

    new Setting(containerEl)
      .setName("Map subfolders to categories")
      .setDesc("Subfolders will automatically categorize sounds")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.mapSubfoldersToCategories)
          .onChange(async (val) => {
            this.plugin.settings.mapSubfoldersToCategories = val;
            await this.plugin.saveSettings();
          })
      });
  }
}

// export class SampleSettingTab extends PluginSettingTab {
//   plugin: MyPlugin;
// 
//   constructor(app: App, plugin: MyPlugin) {
//     super(app, plugin);
//     this.plugin = plugin;
//   }
// 
//   display(): void {
//     const {containerEl} = this;
// 
//     containerEl.empty();
// 
//     new Setting(containerEl)
//       .setName('Settings #1')
//       .setDesc('It\'s a secret')
//       .addText(text => text
//         .setPlaceholder('Enter your secret')
//         .setValue(this.plugin.settings.mySetting)
//         .onChange(async (value) => {
//           this.plugin.settings.mySetting = value;
//           await this.plugin.saveSettings();
//         }));
//   }
// }
