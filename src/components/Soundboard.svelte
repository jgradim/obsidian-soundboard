<script lang="ts">
  import { setIcon } from 'obsidian';

  import { buildDefaultTile } from '../shared';

  import TileComponent from './Tile.svelte';
  import SectionComponent from './Section.svelte';
  import { appState, addTile } from '../state.svelte';

  // Callbacks
  function onAddTile() {
    addTile(buildDefaultTile());
  }

  function onEnded() {};
</script>

<div class="soundboard">
  {#if appState?.settings?.useSections ?? false}
    {#each appState.sections as section, idx (`${section.name}-${idx}`)}
      {#if section.visible}
        <SectionComponent section={section} idx={idx} />
      {/if}
    {/each}
  {:else}
    <div class="tiles">
      {#each (appState?.tiles ?? []) as _, idx (idx)}
        <TileComponent
          idx={idx}
          sectionIdx={null}
          onEnded={onEnded}
        />
      {/each}

      <button
        class="add-tile add-tile-{appState?.settings?.tileSize}"
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

    &.add-tile-s {
      width: 105px;
      height: 105px;
    }

    &.add-tile-m {
      width: 120px;
      height: 120px;
    }

    :global(svg) {
      width: 48px;
      height: 48px;
    }
  }
</style>
