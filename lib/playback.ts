import type { MediaType } from "@/lib/types";

const DEFAULT_MOVIE_EMBED_TEMPLATE = "https://player.sample/embed/movie/{id}";
const DEFAULT_TV_EMBED_TEMPLATE = "https://player.sample/embed/tv/{id}/{season}/{episode}";
const PLAYBACK_SERVER_COUNT = 7;

export type PlaybackEmbedSource = {
  id: string;
  label: string;
  url: string | null;
  configured: boolean;
};

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

function serverTemplate(type: MediaType, server: number) {
  const scopedKey = `PLAYBACK_SERVER_${server}_${type === "movie" ? "MOVIE" : "TV"}_TEMPLATE`;
  const scopedTemplate = process.env[scopedKey]?.trim();
  if (scopedTemplate) return { template: scopedTemplate, configured: true };

  if (server !== 1) return { template: "", configured: false };

  const legacyTemplate = type === "movie"
    ? process.env.PLAYBACK_MOVIE_EMBED_TEMPLATE?.trim()
    : process.env.PLAYBACK_TV_EMBED_TEMPLATE?.trim();

  if (legacyTemplate) return { template: legacyTemplate, configured: true };

  return {
    template: type === "movie" ? DEFAULT_MOVIE_EMBED_TEMPLATE : DEFAULT_TV_EMBED_TEMPLATE,
    configured: false,
  };
}

/**
 * Returns seven configurable self-hosted embed slots for Jordflix.
 *
 * Server 1 remains backward compatible with the original env vars:
 * PLAYBACK_MOVIE_EMBED_TEMPLATE / PLAYBACK_TV_EMBED_TEMPLATE.
 *
 * Servers 1-7 can also use the scalable form:
 * PLAYBACK_SERVER_1_MOVIE_TEMPLATE=...
 * PLAYBACK_SERVER_1_TV_TEMPLATE=...
 * ...through PLAYBACK_SERVER_7_...
 *
 * Optional labels can be customized with PLAYBACK_SERVER_1_LABEL, etc.
 */
export function playbackEmbedSources(type: MediaType, id: string | number, season = 1, episode = 1): PlaybackEmbedSource[] {
  const values = { type, id, tmdbId: id, season, episode };

  return Array.from({ length: PLAYBACK_SERVER_COUNT }, (_, index) => {
    const server = index + 1;
    const { template, configured } = serverTemplate(type, server);
    const label = process.env[`PLAYBACK_SERVER_${server}_LABEL`]?.trim() || `Server ${server}`;

    return {
      id: `server-${server}`,
      label,
      url: template ? fillTemplate(template, values) : null,
      configured,
    };
  });
}

/**
 * Backward-compatible helper returning the first explicitly configured embed source.
 */
export function playbackEmbedUrl(type: MediaType, id: string | number, season = 1, episode = 1) {
  return playbackEmbedSources(type, id, season, episode).find(source => source.configured && source.url)?.url ?? null;
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
