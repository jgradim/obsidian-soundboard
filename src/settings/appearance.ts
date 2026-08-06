import { SettingGroup } from "obsidian";

import type { SoundboardSettingsTab } from "../settings";
import { updateSettings } from "../state.svelte";
import { isTileSize } from "../shared";

export default function renderAppearanceSettings(
  containerEl: HTMLElement,
  settingsTab: SoundboardSettingsTab,
) {
  const { plugin } = settingsTab;

  containerEl.empty();

  new SettingGroup(containerEl)
    .setHeading("Appearance")
    .addSetting((setting) => {
      setting
        .setName("Tile size")
        .addDropdown((dropdown) => {
          dropdown
            .addOptions({
              s: "Small",
              m: "Medium",
              l: "Large",
            })
            .onChange(async (tileSize: string) => {
              if (!isTileSize(tileSize)) return;

              updateSettings({ tileSize });
              await plugin.saveConfig();
              await plugin.loadConfig();
            })
        })
    })
}
