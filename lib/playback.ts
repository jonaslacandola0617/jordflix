import type { MediaType } from "@/lib/types";

const DEFAULT_MOVIE_EMBED_TEMPLATE = "https://player.sample/embed/movie/{id}";
const DEFAULT_TV_EMBED_TEMPLATE = "https://player.sample/embed/tv/{id}/{season}/{episode}";

function validHttpUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function fillTemplate(template: string, values: Record<string, string | number>) {
  let resolved = template;
  Object.entries(values).forEach(([key, value]) => {
    resolved = resolved.replaceAll(`{${key}}`, encodeURIComponent(String(value)));
  });
  return validHttpUrl(resolved);
}

/**
 * Resolves a VidSrc-style self-hosted embed page.
 *
 * Defaults are intentionally the non-working sample structures used while developing Jordflix:
 *   movie: https://player.sample/embed/movie/{id}
 *   tv:    https://player.sample/embed/tv/{id}/{season}/{episode}
 *
 * Override them locally or in Vercel with:
 * PLAYBACK_MOVIE_EMBED_TEMPLATE=https://your-player.example/embed/movie/{id}
 * PLAYBACK_TV_EMBED_TEMPLATE=https://your-player.example/embed/tv/{id}/{season}/{episode}
 */
export function playbackEmbedUrl(type: MediaType, id: string | number, season = 1, episode = 1) {
  const template = type === "movie"
    ? (process.env.PLAYBACK_MOVIE_EMBED_TEMPLATE ?? DEFAULT_MOVIE_EMBED_TEMPLATE).trim()
    : (process.env.PLAYBACK_TV_EMBED_TEMPLATE ?? DEFAULT_TV_EMBED_TEMPLATE).trim();

  if (!template) return null;

  return fillTemplate(template, {
    type,
    id,
    tmdbId: id,
    season,
    episode,
  });
}

/**
 * Optional direct MP4/HLS playback path kept for self-hosted media files.
 * Example: PLAYBACK_URL_TEMPLATE=https://media.example.com/{type}/{id}/master.m3u8
 */
export function playbackUrl(type: MediaType, id: string | number) {
  const template = process.env.PLAYBACK_URL_TEMPLATE?.trim();
  if (!template) return null;

  return fillTemplate(template, {
    type,
    id,
    tmdbId: id,
  });
}
