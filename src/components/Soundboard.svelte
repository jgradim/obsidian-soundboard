<script lang="ts">
  import { buildDefaultTile } from 'src/shared';

  import TileComponent from './Tile.svelte';
  import SectionComponent from './Section.svelte';
  import { appState, addTile } from 'src/state.svelte';
  import { setIcon } from 'obsidian';

  // Callbacks
  function onAddTile() {
    addTile(buildDefaultTile());
  }

  function onEnded() {};
</script>

<div class="soundboard">
  {#if appState.settings.useSections}
    {#each appState.sections as section, idx (`${section.name}-${idx}`)}
      {#if section.visible}
        <SectionComponent section={section} idx={idx} />
      {/if}
    {/each}
  {:else}
    <div class="tiles">
      {#each appState.tiles as tile, idx (idx)}
        <TileComponent
          idx={idx}
          tile={tile}
          sectionIdx={null}
          onEnded={onEnded}
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
