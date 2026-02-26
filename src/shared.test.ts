import { buildTrack, filename, groupTracksBySubfolder, tileUid } from './shared';
import type { Track } from './types';

describe('tileUid', () => {
  [
    [null, 0, 'tile-0'],
    [0, 0, 'tile-0-0'],
  ].forEach(([sectionIdx, tileIdx, uid]) => {
    it(`tileUid(${sectionIdx}, ${tileIdx}) => '${uid}'`, () => {
      expect(tileUid(sectionIdx as number  | null, tileIdx as number)).toStrictEqual(uid);
    })
  })
});

describe('filename', () => {
  [
    ['/path/to/file.wav', 'file.wav'],
    ['path/to/file.wav', 'file.wav'],
    ['/file.wav', 'file.wav'],
    ['file.wav', 'file.wav'],
    ['/path/to/file', 'file'],
    ['path/to/file', 'file'],
    ['/file', 'file'],
    ['file', 'file'],
    ['/path/to/file.wav.mp3', 'file.wav.mp3'],
    ['/', ''],
    ['', ''],
    ['/path/to/', ''],
    ['/path/to//file.wav', 'file.wav'],
    ['///', ''],
    ['///file.wav', 'file.wav'],
    ['/path/to/file with spaces.wav', 'file with spaces.wav'],
    ['/path/to/file with $ymb@l$.wav', 'file with $ymb@l$.wav'],
  ].forEach(([path, basename]) => {
    it(`${path} => ${basename}`, () => {
      expect(filename(path as string)).toStrictEqual(basename);
    });
  })
});

describe('groupTracksBySubfolder', () => {
  const rootFolder = '/audio/';
  const testTracks = [
    `${rootFolder}ambient/rain.wav`,
    `${rootFolder}ambient/wind.wav`,
    `${rootFolder}ambient/campfire.wav`,
    `${rootFolder}ambient/dungeon/prison.wav`,
    `${rootFolder}fx/dagger.wav`,
    `${rootFolder}fx/sword.wav`,
    `${rootFolder}fx/dragon.wav`,
    `${rootFolder}tracks/tavern.wav`,
    `${rootFolder}tracks/combat.wav`,
  ]

  it('groups tracks', () => {
    const tracks: Record<string, Track> = testTracks.reduce((all, path) => ({
      ...all,
      [path]: buildTrack(path),
    }), {});
    const groupedTracks = groupTracksBySubfolder(tracks, rootFolder);

    expect(Object.keys(tracks)).toHaveLength(9);

    expect(Object.keys(groupedTracks).sort()).toStrictEqual([
      'ambient',
      'ambient/dungeon',
      'fx',
      'tracks',
    ]);
    expect(groupedTracks['ambient']).toHaveLength(3);
    expect(groupedTracks['ambient/dungeon']).toHaveLength(1);
    expect(groupedTracks['fx']).toHaveLength(3);
    expect(groupedTracks['tracks']).toHaveLength(2);
  });
});
