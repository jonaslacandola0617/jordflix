import type { MediaType } from "@/lib/types";

/**
 * Resolves an authorized/self-hosted playback URL for a TMDB title.
 *
 * Example:
 * PLAYBACK_URL_TEMPLATE=https://media.example.com/{type}/{id}/master.m3u8
 *
 * Supported placeholders: {type}, {id}, {tmdbId}
 */
export function playbackUrl(type: MediaType, id: string | number) {
  const template = process.env.PLAYBACK_URL_TEMPLATE?.trim();
  if (!template) return null;

  const encodedType = encodeURIComponent(type);
  const encodedId = encodeURIComponent(String(id));
  const resolved = template
    .replaceAll("{type}", encodedType)
    .replaceAll("{id}", encodedId)
    .replaceAll("{tmdbId}", encodedId);

  try {
    const url = new URL(resolved);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
