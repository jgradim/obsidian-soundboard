import { type FuzzyMatch, normalizePath, TFolder, SettingGroup } from "obsidian";

import { type SoundboardSettingsTab } from "src/settings";
import { appState } from "src/state.svelte";
import { FolderInputSuggest } from "src/suggest";

export default function renderRootFolderSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  const { app, plugin } = settingsTab;

  containerEl.empty();

  new SettingGroup(containerEl)
    .setHeading("Audio files")
    .addClass("soundboard-settings-group")
    .addSetting((setting) => {
      setting
        .setName("Root folder location")
        .setDesc("Sound files in this folder and subfolders will be available to use.")
        .addText((text) => {
          text
            .setPlaceholder('/')
            .setValue(plugin.settings.rootFolder)
            .onChange(async (val) => {
              if (!app.vault.getFolderByPath(val)) return;

              plugin.settings.rootFolder = val;
              appState.settings.rootFolder = val;

              await plugin.saveConfig();
              await plugin.loadConfig();
              
              settingsTab.renderTracks();
            })

          const suggestions = new FolderInputSuggest(app, text);
          suggestions.onSelect(async (result: FuzzyMatch<TFolder>) => {
            const path = normalizePath(result.item.path)
            text.setValue(path);
            suggestions.close();

            plugin.settings.rootFolder = path;
            await plugin.saveConfig();
            await plugin.loadConfig();

            settingsTab.renderTracks();
          })
        })
    })
}
