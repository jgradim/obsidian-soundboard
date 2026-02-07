import { ItemView, WorkspaceLeaf, type IconName } from "obsidian";
import { mount, unmount } from "svelte"

import SoundboardComponent from "src/components/Soundboard.svelte";

export const VIEW_TYPE_SOUNDBOARD = 'obsidian-soundboard';

export class SoundboardView extends ItemView {
  soundboard: ReturnType<typeof SoundboardComponent> | undefined;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_SOUNDBOARD;
  }

  getDisplayText(): string {
    return 'Soundboard';
  }

  getIcon(): IconName {
    return 'audio-lines';
  }

  protected async onOpen(): Promise<void> {
    this.soundboard = mount(SoundboardComponent, {
      target: this.contentEl,
      props: {}
    });
  }

  protected async onClose(): Promise<void> {
    if (this.soundboard) {
      await unmount(this.soundboard);
    }
  }
}

