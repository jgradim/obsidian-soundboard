import { Setting } from "obsidian";

import { type SoundboardSettingsTab } from "src/settings";
import { buildDefaultSection } from "src/shared";
import { addSection, appState, removeSection, updateSection } from "src/state.svelte";

export default function renderSectionsSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  const { plugin } = settingsTab;

  const saveAndRefresh = async (): Promise<void> => {
    await plugin.saveConfig();
    await plugin.loadConfig();
    
    settingsTab.renderSections();
  }

  containerEl.empty();

  const toggleSetting = new Setting(containerEl)
    .setName("Use sections")
    .setDesc("Toggle between single or multiple soundboards")
    .addToggle((toggle) => {
      toggle
        .setValue(plugin.settings.useSections)
        .onChange(async (enabled: boolean) => {
          plugin.settings.useSections = enabled;

          await saveAndRefresh();
        });
    })

  if (!plugin.settings.useSections) return;

  toggleSetting
    .addButton((button) => {
      button
        .setButtonText('Add section')
        .onClick(async() => {
          addSection(buildDefaultSection());

          await saveAndRefresh();
        })
    })

  const div = containerEl.createDiv("soundboard-settings-sections");

  // for (const section of appState.sections) {
  appState.sections.forEach((section, idx) => {
    new Setting(div)
      .addText((text) => {
        text
          .setPlaceholder('Section name')
          .setValue(section.name ?? '')
          .onChange(async (value: string) => {
            text.setValue(value);
            updateSection(idx, { name: value });

            // await saveAndRefresh();
          })
      })
      .addButton((button) => {
        button
          .setIcon('trash')
          .onClick(async () => {
            removeSection(idx);

            await saveAndRefresh();
          })
      })
  });
}
