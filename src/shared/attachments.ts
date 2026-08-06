import { setIcon, setTooltip } from "obsidian";
import type { Attachment } from "svelte/attachments";

// Attachments
export const icon = (name: string): Attachment<HTMLElement> =>
  (containerEl: HTMLElement) => {
    setIcon(containerEl, name);
  }

export const tooltip = (text: string): Attachment<HTMLElement> =>
  (containerEl: HTMLElement) => {
    setTooltip(containerEl, text);
  }
