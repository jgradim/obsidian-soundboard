<script lang="ts">
  import { buildDefaultTile } from 'src/shared';

  import TileComponent from './Tile.svelte';
  import SectionComponent from './Section.svelte';
  import { appState, addTile } from 'src/state.svelte';
  import { setIcon } from 'obsidian';

  let sections = $derived(appState.sections);
  let tiles = $derived(appState.tiles);

  const useSections = true; // FIXME;

  // Callbacks
  function onAddTile() {
    addTile(buildDefaultTile());
  }
</script>

<div class="soundboard">
  {#if useSections}
    {#each sections as section, idx}
      <SectionComponent section={section} idx={idx} />
    {/each}
  {:else}
    <div class="tiles">
      {#each tiles as tile, idx}
        <TileComponent
          idx={idx}
          tile={tile}
          sectionIdx={null}
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
  {/if}
</div>

<style scoped>
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
