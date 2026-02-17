import { debounce, SettingGroup, type FuzzyMatch } from "obsidian";

import { SoundboardSettingsTab } from "src/settings";
import { groupTracksBySubfolder } from "src/shared";
import { appState, updateTrack } from "src/state.svelte";
import { IconInputSuggest } from "src/suggest";
import type { Track } from "src/types";

export default function renderTracksSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  containerEl.empty();

  new SettingGroup(containerEl)
    .setHeading("Track customization")
    .addClass("soundboard-settings-group")
    .addClass("track-search")
    .addSetting((setting) => {
      setting
        .setDesc("Customize audio tracks under root folder. Change display name, icon, and background and foreground tile colors")
        .addSearch((search) => {
          search
            .setPlaceholder('Search path / name')
            .onChange(debounce((val) => {
              renderTracks(tracksContainer, settingsTab, val);
            }, 150))
        })
    })

  const tracksContainer: HTMLElement = containerEl.createDiv();
  
  renderTracks(tracksContainer, settingsTab, '');
}

function renderTracks(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
  search: string,
): void {
  const { app, plugin } = settingsTab;

  containerEl.empty();

  const filteredTracks: Record<string, Track> = {};
  Object.values(appState.tracks).reduce((all, track) => {
    if (track.path.match(new RegExp(search, 'i'))) all[track.path] = track;
    return all;
  }, filteredTracks);
  const groupedTracks = groupTracksBySubfolder(filteredTracks, appState.settings.rootFolder);

  const sg = new SettingGroup(containerEl)
    .addClass("soundboard-settings-group")
    .addClass("tracks")

  for (const [subfolder, tracks] of Object.entries(groupedTracks)) {
    sg.addSetting((setting) => {
      setting
        .setName(`${appState.settings.rootFolder}/${subfolder}`)
    });

    for (const track of tracks) {
      sg.addSetting((setting) => {
        setting
          .addText((text) => {
            text
              .setPlaceholder('Name')
              .setValue(track.name || track.path)
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
              renderTracks(containerEl, settingsTab, search);
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
      })
    }
  }

}
