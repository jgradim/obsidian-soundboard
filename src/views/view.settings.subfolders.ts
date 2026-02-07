import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte"

import SettingsSubfolders from "src/components/SettingsSubfolders.svelte";

export default class ViewSettingsSubfolders extends ItemView {
  subfolderTree: ReturnType<typeof SettingsSubfolders> | undefined;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return 'obsidian-soundboard-settings-subfolders';
  }

  getDisplayText(): string {
    return 'Obsidian soundboard settings: subfolders';
  }

  protected async onOpen(): Promise<void> {
    this.subfolderTree = mount(SettingsSubfolders, {
      target: this.contentEl,
    });
  }

  protected async onClose(): Promise<void> {
    if (this.subfolderTree) {
      await unmount(this.subfolderTree);
    }
  }
}
