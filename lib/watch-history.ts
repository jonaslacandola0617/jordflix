import type { MediaItem, MediaType } from "@/lib/types";

const HISTORY_KEY = "jordflix:watch-history:v1";
const COUNT_COOLDOWN_MS = 6 * 60 * 60 * 1000;
const MAX_HISTORY = 24;

export type WatchHistoryEntry = {
  type: MediaType;
  item: MediaItem;
  watchedAt: number;
};

function parseHistory(raw: string | null): WatchHistoryEntry[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter(entry => entry && (entry.type === "movie" || entry.type === "tv") && entry.item?.id && Number.isFinite(entry.watchedAt))
      : [];
  } catch {
    return [];
  }
}

export function readWatchHistory() {
  if (typeof window === "undefined") return [] as WatchHistoryEntry[];
  return parseHistory(window.localStorage.getItem(HISTORY_KEY));
}

export function rememberWatch(type: MediaType, item: MediaItem) {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  const history = readWatchHistory();
  const previous = history.find(entry => entry.type === type && entry.item.id === item.id);
  const shouldCount = !previous || now - previous.watchedAt >= COUNT_COOLDOWN_MS;
  const normalized: MediaItem = { ...item, media_type: type };

  const next: WatchHistoryEntry[] = [
    { type, item: normalized, watchedAt: now },
    ...history.filter(entry => !(entry.type === type && entry.item.id === item.id)),
  ].slice(0, MAX_HISTORY);

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("jordflix:watch-history-changed"));
  return shouldCount;
}
