<script lang="ts">
  import type { Section } from "src/types";

  import { appState, addSectionTile } from "src/state.svelte";
  import TileComponent from './Tile.svelte';
  import { buildDefaultTile } from "src/shared";
  import { setIcon } from "obsidian";

  interface Props {
    idx: number;
    section: Section;
  }

  const { idx: sectionIdx, section }: Props = $props();

  let tiles = $derived.by(() => appState.sections[sectionIdx]?.tiles || []);

  const onAddTile = () => {
    addSectionTile(sectionIdx, buildDefaultTile())
  }
  
</script>

<div class="section">
  {#if section.name}
    <div class="section-title flex flex-sp-between">
      <span>{section.name}</span>
      <button
        class="extra"
        aria-label="Add tile"
        onclick={onAddTile}
        use:setIcon={"square-plus"}
      >
      </button>
    </div>
  {/if}

  <div class="tiles">
    {#each tiles as tile, idx (idx)}
      <TileComponent
        idx={idx}
        tile={tile}
        sectionIdx={sectionIdx}
      />
    {/each}
  </div>
</div>

<style scoped>
  .section {
    margin-bottom: 15px;
  }

  .section-title {
    font-size: var(--font-ui-large);
    font-weight: var(--font-bold);
    background: rgba(0, 0, 0, 0.25);
    padding: 5px 10px;
    border-radius: 5px;
  }

  .tiles {
    padding: 10px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
</style>
