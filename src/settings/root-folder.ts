import { type FuzzyMatch, normalizePath, TFolder, SettingGroup, TextComponent } from "obsidian";

import { type SoundboardSettingsTab } from "../settings";
import { appState } from "../state.svelte";
import { FolderInputSuggest } from "../suggest";

export default function renderRootFolderSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  const { app, plugin } = settingsTab;

  containerEl.empty();

  // local state
  let inputLocked = appState.settings.rootFolder !== '/';
  let input: TextComponent | undefined;

  new SettingGroup(containerEl)
    .setHeading("Audio files")
    .addClass("soundboard-settings-group")
    .addSetting((setting) => {
      setting
        .setName("Root folder location")
        .setDesc("Sound files in this folder and subfolders will be available to use.")
        .addText((text) => {
          input = text;
          text
            .setPlaceholder('/')
            .setValue(appState.settings.rootFolder)
            .setDisabled(inputLocked)
            .onChange(async (val) => {
              if (!app.vault.getFolderByPath(val)) return;

              await plugin.onRootFolderChanged(val);

              settingsTab.renderRootFolder();
              settingsTab.renderTracks();
            })

          const suggestions = new FolderInputSuggest(app, text);
          suggestions.setValue(appState.settings.rootFolder);
          suggestions
            .onSelect(async (result: FuzzyMatch<TFolder>) => {
              const path = normalizePath(result.item.path)
              text.setValue(path);
              suggestions.close();

              await plugin.onRootFolderChanged(path);

              settingsTab.renderRootFolder();
              settingsTab.renderTracks();
            })
        })
        .addButton((button) => {
          button
            .setIcon(inputLocked ? 'lock' : 'lock-open')
            .setTooltip(inputLocked ? 'Allow changes' : 'Prevent changes')
            .onClick(() => {
              if (!input) return;

              inputLocked = !inputLocked;

              button.setIcon(inputLocked ? 'lock' : 'lock-open');
              input.setDisabled(inputLocked);
            });
        })
    })
}
