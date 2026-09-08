import { neon } from "@neondatabase/serverless";
import { desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { watchCounts } from "@/lib/activity-schema";
import type { MediaItem, MediaType } from "@/lib/types";

let schemaReady: Promise<void> | null = null;

function database() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) return null;
  return drizzle(neon(connectionString));
}

async function ensureSchema(db: NonNullable<ReturnType<typeof database>>) {
  if (!schemaReady) {
    schemaReady = db.execute(sql`
      CREATE TABLE IF NOT EXISTS jordflix_watch_counts (
        media_type text NOT NULL CHECK (media_type IN ('movie', 'tv')),
        tmdb_id integer NOT NULL,
        watch_date date NOT NULL DEFAULT CURRENT_DATE,
        watch_count integer NOT NULL DEFAULT 1 CHECK (watch_count > 0),
        media jsonb NOT NULL,
        PRIMARY KEY (media_type, tmdb_id, watch_date)
      )
    `).then(() => undefined);
  }
  await schemaReady;
}

export function communityActivityEnabled() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function activityHealth() {
  const db = database();
  if (!db) return { configured: false, reachable: false };

  try {
    await ensureSchema(db);
    await db.execute(sql`SELECT 1 AS ok`);
    return { configured: true, reachable: true };
  } catch {
    return { configured: true, reachable: false };
  }
}

export async function recordWatchActivity(type: MediaType, item: MediaItem) {
  const db = database();
  if (!db) return false;

  await ensureSchema(db);
  const snapshot: MediaItem = { ...item, media_type: type };

  await db
    .insert(watchCounts)
    .values({
      mediaType: type,
      tmdbId: item.id,
      watchDate: sql`CURRENT_DATE`,
      watchCount: 1,
      media: snapshot,
    })
    .onConflictDoUpdate({
      target: [watchCounts.mediaType, watchCounts.tmdbId, watchCounts.watchDate],
      set: {
        watchCount: sql`${watchCounts.watchCount} + 1`,
        media: snapshot,
      },
    });

  return true;
}

export async function getCommunityWatchActivity(limit = 20): Promise<MediaItem[]> {
  const db = database();
  if (!db) return [];

  try {
    await ensureSchema(db);

    const score = sql<number>`
      SUM(
        ${watchCounts.watchCount} *
        CASE
          WHEN ${watchCounts.watchDate} = CURRENT_DATE THEN 4
          WHEN ${watchCounts.watchDate} >= CURRENT_DATE - 2 THEN 2
          ELSE 1
        END
      )
    `;

    const rows = await db
      .select({
        media: watchCounts.media,
        score,
      })
      .from(watchCounts)
      .where(sql`${watchCounts.watchDate} >= CURRENT_DATE - 6`)
      .groupBy(watchCounts.mediaType, watchCounts.tmdbId, watchCounts.media)
      .orderBy(desc(score))
      .limit(limit);

    return rows
      .map(row => row.media)
      .filter((item): item is MediaItem => Boolean(item?.id && item?.media_type));
  } catch (error) {
    console.warn("[jordflix-activity] community ranking unavailable", error);
    return [];
  }
}
