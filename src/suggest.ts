import {
  type FuzzyMatch,
  AbstractInputSuggest,
  App,
  SearchComponent,
  TFolder,
  TextComponent,
  normalizePath,
  prepareSimpleSearch,
  setIcon,
} from "obsidian";

import { LUCIDE_ICON_NAMES } from "src/constants/lucide";

export class FolderInputSuggest extends AbstractInputSuggest<FuzzyMatch<TFolder>> {
  private folders: TFolder[];

  constructor(app: App, input: TextComponent | SearchComponent, folders: TFolder[] = []) {
    super(app, input.inputEl)

    const appFolders = app.vault.getAllFolders(false);

    this.folders = [...appFolders, ...folders];
  }

  protected getSuggestions(query: string): FuzzyMatch<TFolder>[] | Promise<FuzzyMatch<TFolder>[]> {
    const search = prepareSimpleSearch(query);
    const results = [];

    for (const item of this.folders) {
      const match = search(item.path);
      if (match) {
        results.push({ item, match });
      }
    }

    return results;
  }

  renderSuggestion(result: FuzzyMatch<TFolder>, el: HTMLElement): void {
    el.setText(normalizePath(result.item.path));
  }
}

export class IconInputSuggest extends AbstractInputSuggest<FuzzyMatch<string>> {
  constructor(app: App, input: TextComponent | SearchComponent) {
    super(app, input.inputEl);
  }

  protected getSuggestions(query: string): FuzzyMatch<string>[] | Promise<FuzzyMatch<string>[]> {
    const search = prepareSimpleSearch(query);
    const results = [];

    for (const item of LUCIDE_ICON_NAMES) {
      const match = search(item);
      if (match) {
        results.push({ item, match });
      }
    }

    return results;
  }

  renderSuggestion(result: FuzzyMatch<string>, el: HTMLElement): void {
      setIcon(el, result.item)
      el.setText(result.item);
  }
}
