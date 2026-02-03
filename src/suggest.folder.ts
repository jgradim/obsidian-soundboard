import { type FuzzyMatch, TFolder, renderMatches, AbstractInputSuggest, App, TextComponent, SearchComponent, prepareSimpleSearch, normalizePath } from "obsidian";

export class FolderInputSuggest extends AbstractInputSuggest<FuzzyMatch<TFolder>> {
  private folders: TFolder[];

  constructor(app: App, input: TextComponent | SearchComponent, folders: TFolder[]) {
    super(app, input.inputEl)

    const appFolders = app.vault.getAllFolders(false);

    this.folders = [...appFolders, ...folders];
  }

  protected getSuggestions(query: string): FuzzyMatch<TFolder>[] | Promise<FuzzyMatch<TFolder>[]> {
    const search = prepareSimpleSearch(query);
    const results = [];

    for (const item of this.folders) {
      const match = search(query);
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
