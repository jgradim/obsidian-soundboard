<script lang="ts">
  import type { Section, Tile, Track } from "src/types";

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
    <div class="section-title">{section.name}</div>
  {/if}

  <div class="tiles">
    {#each tiles as tile, idx}
      <TileComponent
        idx={idx}
        tile={tile}
        sectionIdx={sectionIdx}
      />
    {/each}

    <button
      class="add-tile"
      aria-label="Add tile"
      onclick={onAddTile}
      use:setIcon={"square-plus"}
    >
    </button>
  </div>
</div>

<style scoped>
  .section-title {
    font-size: var(--font-ui-large);
    font-weight: var(--font-bold);
  }

  .tiles {
    padding: 10px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .add-tile {
    width: 135px;
    height: 135px;
    border-radius: 5px;
    padding: 10px;
    font-size: 1.2rem;
    cursor: pointer;

    :global(svg) {
      width: 48px;
      height: 48px;
    }
  }
</style>
