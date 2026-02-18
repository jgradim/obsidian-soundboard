# obsidian-soundboard

obsidian-soundboard is a plugin for [Obsidian](https://obsidian.md) that allows you to use local sound files to create soundboards and playlists for tracks, ambiance and sound effects.

> [!WARNING]
> Plugin under heavy development

## Why?

Because I use [Obsidian](https://obsidian.md) on my laptop to run an offline D&D campaign (thank you [@javalent](github.com/javalent/)!), and use background music, ambiance, and sound effects. I couln't find anything that would fit my needs: no internet access required, ability to use custom tracks, and light on battery usage.

So I decided to add my soundtracks to my D&D vault, and start building a weird soundboard / playlist mix.

This plugin is probably not for you. But if it is, I hope you find it useful and it helps you run some memorable games!

## Features

- Create a single soundboard with unlimited tracks, or create multiple soundboards for better organization;
- Customize track names, icon, background color, and text and icon colors;
- Reacts to changes in your vault filesystem; move, rename, or delete your files, and your soundboards and settings will be automatically updated;

## Development

This project aims to have no runtime dependencies, other than `obsidian`.

The custom soundboard view uses Svelte 5.

## Releasing new versions

- Ensure all tests, linters, and build have no issues.
- Run `npm version <major|minor|patch>`;
  - This will update the versions in `package.json`, `package-lock.json`, `manifest.json`, `versions.json` as well as generate the latest version of `CHANGELOG.md` and create a new git tag and commit where the commit message is the new version, in `major.minor.patch` format.
- `git push origin main`
- `git push origin --tags`
- The `.github/workflows/release` will then be run when this new tag is pushed, and create a [draft release](https://github.com/jgradim/obsidian-soundboard/releases)

## TODO

- [ ] Section Settings
  - [ ] Toggle Visibility
- [ ] Track Settings
  - [x] Filter / search tracks
  - [ ] Sort tracks
- [ ] Section controls
  - [x] Add Tile
  - [ ] Stop all
- [ ] Section playlist / sequencer mode
  - [ ] Play tiles in sequence


------------------------------------------------------------------------------------

## Adding your plugin to the community plugin list

- Check the [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines).
- Publish an initial version.
- Make sure you have a `README.md` file in the root of your repo.
- Make a pull request at https://github.com/obsidianmd/obsidian-releases to add your plugin.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

## Funding URL

You can include funding URLs where people who use your plugin can financially support it.

The simple way is to set the `fundingUrl` field to your link in your `manifest.json` file:

```json
{
    "fundingUrl": "https://buymeacoffee.com"
}
```

If you have multiple URLs, you can also do:

```json
{
    "fundingUrl": {
        "Buy Me a Coffee": "https://buymeacoffee.com",
        "GitHub Sponsor": "https://github.com/sponsors",
        "Patreon": "https://www.patreon.com/"
    }
}
```

## API Documentation

See https://docs.obsidian.md
