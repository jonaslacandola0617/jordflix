import { date, integer, jsonb, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import type { MediaItem } from "@/lib/types";

export const watchCounts = pgTable(
  "jordflix_watch_counts",
  {
    mediaType: text("media_type").notNull(),
    tmdbId: integer("tmdb_id").notNull(),
    watchDate: date("watch_date").notNull(),
    watchCount: integer("watch_count").notNull().default(1),
    media: jsonb("media").$type<MediaItem>().notNull(),
  },
  table => [
    primaryKey({ columns: [table.mediaType, table.tmdbId, table.watchDate] }),
  ],
);
