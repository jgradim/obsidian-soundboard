<script lang="ts">
  import { setIcon } from "obsidian";

  import type { Section } from "../types";
  import { appState, addSectionTile } from "../state.svelte";
  import TileComponent from './Tile.svelte';
  import { buildDefaultTile, tileUid } from "../shared";
  import { icon } from "../shared/attachments";

  interface Props {
    idx: number;
    section: Section;
  }

  const { idx: sectionIdx, section }: Props = $props();

  let tiles = $derived.by(() => appState.sections[sectionIdx]?.tiles || []);

  const onAddTile = () => {
    addSectionTile(sectionIdx, buildDefaultTile())
  }

  const onTileEnded = (tileIdx: number) => {
    if (!section.autoplay) return;
    if (tiles[tileIdx]?.loop) return;
    
    const lastTile = tileIdx === tiles.length - 1;

    document
      .getElementById(tileUid(sectionIdx, lastTile ? 0 : tileIdx + 1))
      ?.click()
  }
  
</script>

<div class="section">
  <div class="section-title flex ai-center jc-between">
    <div class="flex ai-center gap-8">
      <span {@attach icon(section.autoplay ? 'list-music' : 'music-3')}></span>
      <span>{section.name}</span>
    </div>
    <button
      class="extra"
      aria-label="Add tile"
      onclick={onAddTile}
      use:setIcon={"square-plus"}
    >
    </button>
  </div>

  <div class="tiles gap-8">
    {#each tiles as tile, idx (`${tile.track}-${idx}`)}
      <TileComponent
        idx={idx}
        tile={tile}
        sectionIdx={sectionIdx}
        onEnded={() => onTileEnded(idx)}
      />
    {/each}
  </div>
</div>

<style scoped>
  .section {
    margin-bottom: var(--size-4-2);
  }

  .section-title {
    font-size: var(--font-ui-large);
    font-weight: var(--font-bold);
    background: rgba(0, 0, 0, 0.25);
    padding: var(--size-2-3) var(--size-4-4);
    border-radius: var(--button-radius);
  }

  .tiles {
    padding: var(--size-4-2) 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
