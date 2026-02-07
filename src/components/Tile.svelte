<script lang="ts">
  import { setIcon, setTooltip, moment } from "obsidian";
  import { appState, removeTile, updateTile } from "src/state.svelte";

  import type { Tile, Track } from "src/types";
  import type { Attachment } from "svelte/attachments";
  import type { KeyboardEventHandler, MouseEventHandler } from "svelte/elements";

  interface Props {
    idx: number;
    tile: Tile;
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
    tile,
  }: Props = $props();

  // State
  let isPlaying: boolean = $state(false);
  let currentTime: number = $state(0);
  let duration: number = $state(0);

  // Derived
  let tracks: Record<string, Track> = $derived(appState.tracks);
  let track: Track | undefined = $derived.by(() => {
    if (tile.track) return appState.tracks[tile.track];
    return;
  });
  let background: string = $derived.by(() => {
    const progress = duration > 0 ? `${(currentTime / duration * 100).toFixed(5)}%` : '0%'
    const bg = track?.bg || 'rgba(0, 0, 0, 0.1)';

    return `linear-gradient(90deg, color-mix(in srgb, ${bg}, black 30%) ${progress}, ${bg} 0%);`
  });
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
        disabled: !track || !isPlaying,
      },
      {
        label: "Loop",
        icon: "repeat",
        onClick: toggleLoop,
        pressed: tile.loop,
        disabled: !track || !isPlaying,
      },
      {
        label: "Edit",
        icon: "pencil",
        onClick: edit,
        pressed: false,
        disabled: !track || !isPlaying,
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

    updateTile(idx, { track: target.value });
  }

  const toggleLoop = async () => {
    if (!tile.track) return;

    updateTile(idx, { loop: !tile.loop})
  }

  const playPause = () => {
    if (!tile.track) return;

    isPlaying = !isPlaying;

    const audio: HTMLAudioElement = document.getElementById(uid) as HTMLAudioElement;
    
    if (isPlaying)
      audio.play();
    else
      audio.pause();
  }

  const stop = () => {
    if (!tile.track) return;

    isPlaying = false;

    const audio: HTMLAudioElement = document.getElementById(uid) as HTMLAudioElement;

    audio.pause();
    audio.currentTime = 0;
    currentTime = 0;
  }

  const edit = () => {
    tile.track = null;
  }

  const remove = () => {
    removeTile(idx);
  }

  const onLoadedData = (ev: Event) => {
    const target: HTMLAudioElement = ev.target as HTMLAudioElement;
    target.volume = tile.volume;
    duration = target.duration;
  }

  const updateProgress = (ev: Event ) => {
    const target: HTMLAudioElement = ev.target as HTMLAudioElement;
    currentTime = target.currentTime;
  }

  const onEnded = () => {
    isPlaying = false
    currentTime = 0;
  };
</script>

<div class="tile" style={`background: ${background}`}>
  <div class="tile-controls">
    {#each controls as control}
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
      <div class="track-time">{moment.utc(duration * 1000).format('mm:ss')}</div>
    {:else}
      <select onchange={onTrackChange}>
        <option value="" disabled selected>Select track</option>
        {#each Object.entries(tracks) as [path, track]}
          <option value={path}>{track.name}</option>
        {/each}
      </select>
    {/if}
  </div>

  {#if track}
    <audio
      id={uid}
      src={track.uri}
      loop={tile.loop}
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

    &.disabled { cursor: default; }
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
</style>
