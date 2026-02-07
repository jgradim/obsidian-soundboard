<script lang="ts">
  import { createDefaultTile } from 'src/shared';

  import TileComponent from './Tile.svelte';
  import { appState, addTile } from 'src/state.svelte';

  let tiles = $derived(appState.tiles);

  // Callbacks
  function onAddTile() {
    addTile(createDefaultTile());
  }
</script>

<div class="soundboard">
  <div class="tiles">
    {#each tiles as tile, idx}
      <TileComponent
        idx={idx}
        tile={tile}
      />
    {/each}

    <button class="tile" onclick={onAddTile}>
      + Add Tile
    </button>

  </div>
</div>

<style scoped>
  .tiles {
    padding: 10px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
</style>
