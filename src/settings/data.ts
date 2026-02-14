import { Setting, SettingGroup } from "obsidian";

import { SoundboardSettingsTab } from "src/settings";

export default function renderDataSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  const { plugin } = settingsTab;

  containerEl.empty();

  new SettingGroup(containerEl)

  .addSetting((setting: Setting) => {

    setting
      .setName("Manage data")
      .setDesc("Export / import config, reset data")
      .addButton((button) => {
        button
          .setButtonText("Clear data")
          .onClick(async () => {
            await plugin.clearData();
            settingsTab.renderTracks();
          })
      })
    }
  )
}
