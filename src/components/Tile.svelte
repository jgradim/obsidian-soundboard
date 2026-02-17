<script lang="ts">
  import { setIcon, setTooltip, moment } from "obsidian";
  import type { Attachment } from "svelte/attachments";

  import type { Tile, Track } from "src/types";
  import { appState, removeSectionTile, removeTile, updateSectionTile, updateTile } from "src/state.svelte";
  import { TILE_DEFAULT_VOLUME } from "src/constants/tile";
  import { groupTracksBySubfolder } from "src/shared";

  interface Props {
    idx: number;
    tile: Tile;
    sectionIdx: number | null;
  }

  interface TileControl {
    label: string;
    icon: string;
    onClick: () => void;
    pressed: boolean;
    disabled: boolean;
  }

  // Props
  const uid = $props.id();
  let {
    idx,
    // tile,
    sectionIdx,
  }: Props = $props();

  // State
  let isPlaying: boolean = $state(false);
  let currentTime: number = $state(0);
  let duration: number = $state(0);

  // Derived
  let groupedTracks: Record<string, Array<Track>> = $derived.by(() => (
    groupTracksBySubfolder(appState.tracks, appState.settings.rootFolder)
  ))

  let tile: Tile | undefined = $derived.by(() => {
    if (sectionIdx !== null) return appState.sections[sectionIdx]?.tiles[idx];
    else return appState.tiles[idx];
  })
  let track: Track | undefined = $derived.by(() => {
    if (tile?.track) return appState.tracks[tile.track];
    return;
  });
  let background: string = $derived.by(() => {
    const progress = duration > 0 ? `${(currentTime / duration * 100).toFixed(5)}%` : '0%'
    const bg = track?.bg || 'rgba(0, 0, 0, 0.1)';

    return `linear-gradient(90deg, color-mix(in srgb, ${bg}, black 30%) ${progress}, ${bg} 0%);`
  });
  let foreground: string = $derived.by(() => track?.fg ?? '#fff');
  let controls: Array<TileControl> = $derived.by(() => {
    return [
      {
        label: isPlaying ? "Pause" : "Play",
        icon: "play",
        onClick: playPause,
        pressed: isPlaying,
        disabled: !track,
      },
      {
        label: "Stop",
        icon: "square",
        onClick: stop,
        pressed: false,
        disabled: !track,
      },
      {
        label: "Loop",
        icon: "repeat",
        onClick: toggleLoop,
        pressed: tile?.loop || false,
        disabled: !track,
      },
      {
        label: "Edit",
        icon: "pencil",
        onClick: edit,
        pressed: false,
        disabled: !track,
      },
      {
        label: "Remove",
        icon: "trash",
        onClick: remove,
        pressed: false,
        disabled: false,
      }
    ]
  });

  let volume: number = $derived.by(() => (tile?.volume ?? TILE_DEFAULT_VOLUME))
  let volumeIcon: string = $derived.by(() => {
    const v = Math.floor(volume * 100);
    if (v === 0) return 'volume-x';
    if (v < 33) return 'volume';
    if (v < 66) return 'volume-1';
    return 'volume-2';
  });

  // Attachments
  const icon = (name: string): Attachment =>
    (containerEl: HTMLElement) => {
      setIcon(containerEl, name);
    }
  const tooltip = (text: string): Attachment =>
    (containerEl: HTMLElement) => {
      setTooltip(containerEl, text);
    }

  // Callbacks
  const onTrackChange = async (ev: Event) => {
    const target = ev.target as HTMLSelectElement;

    if (sectionIdx !== null)
      updateSectionTile(sectionIdx, idx, { track: target.value });
    else
      updateTile(idx, { track: target.value });
  }

  const toggleLoop = async () => {
    if (!tile?.track) return;

    if (sectionIdx !== null)
      updateSectionTile(sectionIdx, idx, { loop: !tile.loop })
    else
      updateTile(idx, { loop: !tile.loop })
  }

  const playPause = () => {
    if (!tile?.track) return;

    isPlaying = !isPlaying;

    const audio: HTMLAudioElement = document.getElementById(uid) as HTMLAudioElement;
    
    if (isPlaying)
      audio.play();
    else
      audio.pause();
  }

  const stop = () => {
    if (!tile?.track) return;

    isPlaying = false;

    const audio: HTMLAudioElement = document.getElementById(uid) as HTMLAudioElement;

    audio.pause();
    audio.currentTime = 0;
    currentTime = 0;
  }

  const edit = () => {
    stop();

    if (sectionIdx !== null)
      updateSectionTile(sectionIdx, idx, { track: null });
    else
      updateTile(idx, { track: null });
  }

  const remove = () => {
    if (sectionIdx !== null)
      removeSectionTile(sectionIdx, idx);
    else
      removeTile(idx);
  }

  const onVolumeChange = (ev: Event) => {
    const target: HTMLInputElement = ev.target as HTMLInputElement;

    const value: number = parseFloat(target.value);

    if (sectionIdx !== null)
      updateSectionTile(sectionIdx, idx, { volume: value });
    else
      updateTile(idx, { volume: value });
  }

  const onLoadedData = (ev: Event) => {
    const target: HTMLAudioElement = ev.target as HTMLAudioElement;
    duration = target.duration;
  }

  const updateProgress = (ev: Event) => {
    const target: HTMLAudioElement = ev.target as HTMLAudioElement;
    currentTime = target.currentTime;
  }

  const onEnded = () => {
    isPlaying = false
    currentTime = 0;
  };
</script>

<div class="tile" style={`background: ${background}; color: ${foreground}`}>
  <div class="tile-controls">
    {#each controls as control (control.icon)}
      <div
        role="button"
        tabindex="0"
        class="tile-control"
        aria-label={control.label}
        onclick={control.onClick}
        onkeypress={control.onClick}
        class:pressed={control.pressed}
        class:disabled={control.disabled}
        {@attach icon(control.icon)}
        {@attach tooltip(control.label)}
      ></div>
    {/each}
  </div>

  <div
    class="tile-info"
    role="button"
    tabindex="0"
    onclick={playPause}
    onkeypress={playPause}
    aria-label={isPlaying ? "Pause" : "Play"}
  >
    {#if track}
      <div class="track-icon" {@attach icon(track.icon)}></div>
      <div class="track-name">{track.name}</div>
    {:else}
      <select onchange={onTrackChange}>
        <option value="" disabled selected>Select track</option>
        {#each Object.entries(groupedTracks) as [subfolder, tracks] (subfolder)}
          <optgroup label={subfolder}>
            {#each tracks as track (track.path)}
              <option value={track.path}>{track.name}</option>
            {/each}
          </optgroup>
        {/each}
      </select>
    {/if}
  </div>

  {#if track}
    <div class="tile-footer">
      <div class="track-volume-icon" {@attach icon(volumeIcon) }></div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        class="track-volume"
        value={volume}
        oninput={onVolumeChange}
        {@attach tooltip(Math.floor(volume * 100).toString())}
      />
      <div class="track-time">{moment.utc(duration * 1000).format('mm:ss')}</div>
    </div>
  {/if}

  {#if track}
    <audio
      id={uid}
      src={track.uri}
      loop={tile?.loop}
      volume={volume}
      onloadeddata={onLoadedData}
      ontimeupdate={updateProgress}
      onended={onEnded}
    ></audio>
  {/if}

</div>

<style scoped>
  .tile {
    display: flex;
    justify-content: space-between;
    flex-flow: column;
    flex-shrink: 0;
    width: 135px;
    height: 135px;
    border-radius: 5px;
    padding: 10px 5px 5px;
    padding: 5px;
  }

  .tile-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    padding-bottom: 10px;
  }

  .tile-control {
    display: flex;
    flex-grow: 1;
    align-content: center;
    justify-content: center;

    cursor: pointer;
    padding: 3px;
    border-radius: 3px;

    :global(svg.svg-icon) {
      width: var(--icon-s);
      height: var(--icon-s);
    }

    &.disabled {
      cursor: default;

      :global(svg) { color: #444; }
    }
    &.pressed { background: rgba(0, 0, 0, 0.4); }
  }

  .tile-info {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;
    flex-direction: column;
    cursor: pointer;
  }

  .track-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;

    :global(svg) {
      width: 42px !important;
      height: 42px !important;
    }
  }

  .track-name {
    flex-grow: 1;
    text-align: center;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .track-time {
    display: flex;
    justify-content: flex-end;
    font-size: .75rem;
  }

  .track-volume-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
    border-radius: 3px;
  }

  .track-volume {
    margin-left: -5px;
    width: 65px;
    &::-webkit-slider-thumb {
      width: 18px;
      height: 18px;
    }
  }

  .tile-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
