import type { MediaItem, MediaType } from "@/lib/types";

const QUEUE_KEY = "jordflix:queue:v1";
export const QUEUE_EVENT = "jordflix:queue-changed";

export type QueueItem = {
  key: string;
  type: MediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  addedAt: number;
};

export type QueueItemInput = {
  item: MediaItem;
  type: MediaType;
  season?: number;
  episode?: number;
  episodeTitle?: string;
};

export function queueItemKey(type: MediaType, tmdbId: number, season?: number, episode?: number) {
  if (type === "tv") return `tv:${tmdbId}:s${season || 1}:e${episode || 1}`;
  return `movie:${tmdbId}`;
}

export function buildQueueItem(input: QueueItemInput): QueueItem {
  const title = input.item.title || input.item.name || "Untitled";
  return {
    key: queueItemKey(input.type, input.item.id, input.season, input.episode),
    type: input.type,
    tmdbId: input.item.id,
    title,
    posterPath: input.item.poster_path,
    season: input.type === "tv" ? input.season || 1 : undefined,
    episode: input.type === "tv" ? input.episode || 1 : undefined,
    episodeTitle: input.type === "tv" ? input.episodeTitle : undefined,
    addedAt: Date.now(),
  };
}

function validQueueItem(value: unknown): value is QueueItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<QueueItem>;
  return typeof item.key === "string"
    && (item.type === "movie" || item.type === "tv")
    && Number.isInteger(item.tmdbId)
    && item.tmdbId! > 0
    && typeof item.title === "string"
    && (typeof item.posterPath === "string" || item.posterPath === null);
}

function notifyQueueChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(QUEUE_EVENT));
}

export function readQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(validQueueItem) : [];
  } catch {
    return [];
  }
}

export function writeQueue(items: QueueItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  notifyQueueChanged();
}

export function addQueueItem(item: QueueItem) {
  const queue = readQueue();
  if (queue.some(existing => existing.key === item.key)) return false;
  writeQueue([...queue, item]);
  return true;
}

export function removeQueueItem(key: string) {
  const queue = readQueue();
  const next = queue.filter(item => item.key !== key);
  if (next.length === queue.length) return false;
  writeQueue(next);
  return true;
}

export function moveQueueItem(key: string, direction: -1 | 1) {
  const queue = readQueue();
  const index = queue.findIndex(item => item.key === key);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= queue.length) return false;
  const next = [...queue];
  [next[index], next[target]] = [next[target], next[index]];
  writeQueue(next);
  return true;
}

export function clearQueue() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(QUEUE_KEY);
  notifyQueueChanged();
}

export function queueItemLabel(item: QueueItem) {
  if (item.type === "tv") {
    const episode = `S${item.season || 1}E${item.episode || 1}`;
    return item.episodeTitle ? `${item.title} · ${episode} · ${item.episodeTitle}` : `${item.title} · ${episode}`;
  }
  return item.title;
}

export function queueItemMeta(item: QueueItem) {
  return item.type === "tv" ? `Series · S${item.season || 1}E${item.episode || 1}` : "Movie";
}

export function queueItemRoute(item: QueueItem) {
  if (item.type === "tv") {
    return `/title/tv/${item.tmdbId}?season=${item.season || 1}&episode=${item.episode || 1}#watch`;
  }
  return `/title/movie/${item.tmdbId}#watch`;
}
