import { recordWatchActivity } from "@/lib/activity";
import type { MediaItem, MediaType } from "@/lib/types";

function validType(value: unknown): value is MediaType {
  return value === "movie" || value === "tv";
}

function validItem(value: unknown): value is MediaItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<MediaItem>;
  return Number.isInteger(item.id)
    && item.id! > 0
    && typeof item.overview === "string"
    && (typeof item.poster_path === "string" || item.poster_path === null)
    && (typeof item.backdrop_path === "string" || item.backdrop_path === null)
    && typeof item.vote_average === "number"
    && typeof item.vote_count === "number"
    && typeof item.popularity === "number";
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { type?: unknown; item?: unknown };
    if (!validType(body.type) || !validItem(body.item)) {
      return Response.json({ stored: false, error: "Invalid watch activity payload" }, { status: 400 });
    }

    const stored = await recordWatchActivity(body.type, body.item);
    return Response.json({ stored }, { status: stored ? 201 : 202 });
  } catch {
    return Response.json({ stored: false, error: "Could not record watch activity" }, { status: 400 });
  }
}
