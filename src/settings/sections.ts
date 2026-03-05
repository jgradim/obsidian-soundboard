import { SettingGroup } from "obsidian";

import { type SoundboardSettingsTab } from "../settings";
import { buildDefaultSection } from "../shared";
import {
  addSection,
  appState,
  removeSection,
  swapSections,
  updateSection,
} from "../state.svelte";

export default function renderSectionsSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  const { plugin } = settingsTab;

  const saveAndRefresh = async (): Promise<void> => {
    await plugin.saveConfig();
    
    settingsTab.renderSections();
  }

  containerEl.empty();

  const sg = new SettingGroup(containerEl)
    .setHeading("Soundboard sections")
    .addClass("soundboard-settings-group")
    .addSetting((setting) => {
      setting
        .setName("Use sections")
        .setDesc("Toggle between single or multiple soundboards")

      if (appState.settings.useSections) {
        setting
          .addButton((button) => {
            button
              .setButtonText('Add section')
              .onClick(async() => {
                addSection(buildDefaultSection());

                await saveAndRefresh();
              })
          })
      }

      setting
        .addToggle((toggle) => {
          toggle
            .setValue(appState.settings.useSections)
            .onChange(async (enabled: boolean) => {
              appState.settings.useSections = enabled;
              appState.settings.useSections = enabled;

              await saveAndRefresh();
            });
        })
    })

  if (!appState.settings.useSections) return;

  appState.sections.forEach((section, idx) => {
    sg.addSetting((setting) => {
      setting
        .setClass('soundboard-section-setting-item')
        .addButton((button) => {
          button
            .setIcon('chevron-up')
            .setTooltip('Move up')
            .setDisabled(idx === 0)
            .onClick(async () => {
              if (idx === 0) return; 

              swapSections(idx, idx - 1);

              await saveAndRefresh();
            });
        })
        .addButton((button) => {
          button
            .setIcon('chevron-down')
            .setTooltip('Move down')
            .setDisabled(idx === appState.sections.length - 1)
            .onClick(async () => {
              if (idx === appState.sections.length - 1) return; 

              swapSections(idx, idx + 1);

              await saveAndRefresh();
            });
        })
        .addButton((button) => {
          button
            .setClass('mr-auto')
            .setIcon('trash')
            .setTooltip("Delete section")
            .onClick(async () => {
              removeSection(idx);

              await saveAndRefresh();
            })
        })
        .addText((text) => {
          text
            .setPlaceholder('Section name')
            .setValue(section.name ?? '')
            .onChange((value: string) => {
              text.setValue(value);
              updateSection(idx, { name: value });
            });

            text.inputEl.onblur = saveAndRefresh;
        })
        .addButton((button) => {
          button
            .setIcon(section.autoplay ? "list-music" : "music-3")
            .setTooltip(section.autoplay ? "Switch to One-Shot" : "Switch to autoplay")
            .onClick(async () => {
              const autoplay = !section.autoplay;
              updateSection(idx, { autoplay });

              await saveAndRefresh();
            })
        })
        .addButton((button) => {
          button
            .setIcon(section.visible ? "eye" : "eye-off")
            .setTooltip(section.visible ? "Hide" : "Show")
            .onClick(async () => {
              const visible = !section.visible;
              updateSection(idx, { visible });

              await saveAndRefresh();
            })
        })
    });
  });
}
