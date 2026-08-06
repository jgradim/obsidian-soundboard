import z from "zod";

export const TrackSchema = z.object({
  path: z.string(),
  uri: z.string(),
  name: z.string(),
  icon: z.string(),
  bg: z.string(),
  fg: z.string(),
});

export const TileSchema = z.object({
  track: z.string().nullable(),
  volume: z.number(),
  loop: z.boolean(),
});

export const SectionSchema = z.object({
  name: z.string().nullable(),
  tiles: z.array(TileSchema),
  autoplay: z.boolean(),
  repeat: z.boolean(),
  visible: z.boolean(),
})

export const TileSizeSchema = z.enum(["s", "m", "l"]);

export const PluginSettingsSchema = z.object({
  rootFolder: z.string(),
  useSections: z.boolean(),
  tileSize: TileSizeSchema,
});

export const PluginDataSchema = z.object({
  tracks: z.record(z.string(), TrackSchema),
  tiles: z.array(TileSchema),
  sections: z.array(SectionSchema),
});

export const PluginConfigurationSchema = z.object({
  settings: PluginSettingsSchema,
  data: PluginDataSchema,
});

export const AppStateSchema = z.object({
  settings: PluginSettingsSchema,
  tracks: z.record(z.string(), TrackSchema),
  tiles: z.array(TileSchema),
  sections: z.array(SectionSchema),
})

export const SoundboardDataSchema = z.object({
  settings: z.object({
    rootFolder: z.string().default(""),
    useSections: z.boolean().default(false),
    tileSize: z.enum(["s", "m", "l"]).default("s"),
  }),
  data: z.object({
    tracks: z.record(z.string(), TrackSchema).default({}),
    tiles: z.array(TileSchema).default([]),
    sections: z.array(SectionSchema).default([]),
  }),
});

export type Track = z.infer<typeof TrackSchema>;
export type Tile = z.infer<typeof TileSchema>;
export type Section = z.infer<typeof SectionSchema>;

export type TileSize = z.infer<typeof TileSizeSchema>;
export type PluginSettings = z.infer<typeof PluginSettingsSchema>;
export type PluginData = z.infer<typeof PluginDataSchema>;
export type PluginConfiguration = z.infer<typeof PluginConfigurationSchema>;

export type AppState = z.infer<typeof AppStateSchema>;
export type SoundboardData = z.infer<typeof SoundboardDataSchema>;
