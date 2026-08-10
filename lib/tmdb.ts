import type { MediaDetails, MediaItem, MediaType, ProviderRegion, SeasonDetails } from "@/lib/types";

const BASE_URL = "https://api.themoviedb.org/3";
const token = process.env.TMDB_API_TOKEN;
const apiKey = process.env.TMDB_API_KEY;
export const defaultRegion = process.env.DEFAULT_REGION || "PH";

function authHeaders(): HeadersInit {
  return token ? { Authorization: `Bearer ${token}`, Accept: "application/json" } : { Accept: "application/json" };
}

async function tmdb<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}, revalidate = 3600): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  if (!token && apiKey) url.searchParams.set("api_key", apiKey);
  if (!token && !apiKey) throw new Error("Missing TMDB_API_TOKEN or TMDB_API_KEY");

  const response = await fetch(url, { headers: authHeaders(), next: { revalidate } });
  if (!response.ok) throw new Error(`TMDB request failed (${response.status}) for ${path}`);
  return response.json() as Promise<T>;
}

const watchable = {
  watch_region: defaultRegion,
  with_watch_monetization_types: "flatrate|free|ads",
  include_adult: false,
  language: "en-US",
};

export async function discover(type: MediaType, page = 1, sortBy = "popularity.desc", extra: Record<string, string | number | boolean | undefined> = {}) {
  const data = await tmdb<{ results: MediaItem[]; total_pages: number }>(`/discover/${type}`, { ...watchable, sort_by: sortBy, page, ...extra });
  return data;
}

export async function trending(type: MediaType = "movie") {
  const data = await tmdb<{ results: MediaItem[] }>(`/trending/${type}/week`);
  return data.results;
}

export async function details(type: MediaType, id: string | number) {
  return tmdb<MediaDetails>(`/${type}/${id}`, { append_to_response: "videos,credits,recommendations", language: "en-US" });
}

export async function seasonDetails(tvId: string | number, seasonNumber: string | number) {
  return tmdb<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`, { language: "en-US" });
}

export async function watchProviders(type: MediaType, id: string | number) {
  const data = await tmdb<{ results: Record<string, ProviderRegion> }>(`/${type}/${id}/watch/providers`);
  return data.results?.[defaultRegion] || null;
}

export async function searchMulti(query: string, page = 1) {
  const data = await tmdb<{ results: MediaItem[]; total_pages: number }>("/search/multi", { query, page, include_adult: false, language: "en-US" }, 300);
  return { ...data, results: data.results.filter((item) => (item.media_type === "movie" || item.media_type === "tv") && item.poster_path) };
}

export function titleOf(item: MediaItem) { return item.title || item.name || "Untitled"; }
export function dateOf(item: MediaItem) { return item.release_date || item.first_air_date || ""; }
export function yearOf(item: MediaItem) { const date = dateOf(item); return date ? date.slice(0, 4) : "—"; }
export function image(path: string | null | undefined, size: "w342" | "w500" | "w780" | "original" = "w500") { return path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg"; }
