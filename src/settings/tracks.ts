import { Setting, type FuzzyMatch } from "obsidian";

import { SoundboardSettingsTab } from "src/settings";
import { appState, updateTrack } from "src/state.svelte";
import { IconInputSuggest } from "src/suggest";

export default function renderTracksSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  const { app, plugin } = settingsTab;

  containerEl.empty();

  new Setting(containerEl)
    .setName("Customize tracks")
    .setDesc("Customize audio tracks under root folder. Change display name, icon, and background and foreground tile colors")

  const div = containerEl.createDiv("soundboard-settings-tracks");

  for (const track of Object.values(appState.tracks)) {
    new Setting(div)
      .addText((text) => {
        text
          .setPlaceholder('Name')
          .setValue(track.name)
          .onChange(async (value: string) => {
            text.setValue(value);

            updateTrack(track.path, { name: value });
            await plugin.saveConfig();
          })
      })
      .addText((text) => {
        text
          .setPlaceholder('Icon')
          .setValue(track.icon)

        const suggestions = new IconInputSuggest(app, text);
        suggestions.onSelect(async (result: FuzzyMatch<string>) => {
          text.setValue(result.item);

          updateTrack(track.path, { icon: result.item });
          await plugin.saveConfig();
          
          suggestions.close();
          settingsTab.renderTracks();
        })
      })
      .addExtraButton((button) => {
        button
          .setIcon(track.icon)
          .setDisabled(true);
      })
      .addColorPicker((picker) => {
        picker
          .setValue(track.bg)
          .onChange(async (bg) => {
            picker.setValue(bg);

            updateTrack(track.path, { bg });
            await plugin.saveConfig();
          });
      })
      .addColorPicker((picker) => {
        picker
          .setValue(track.fg)
          .onChange(async (fg) => {
            picker.setValue(fg);

            updateTrack(track.path, { fg });
            await plugin.saveConfig();
          });
      })
  }
    
}
