"use client";

import { useEffect, useMemo, useState } from "react";
import {
  QUEUE_EVENT,
  addQueueItem,
  buildQueueItem,
  queueItemKey,
  readQueue,
  removeQueueItem,
} from "@/lib/queue";
import type { MediaItem, MediaType } from "@/lib/types";

type Props = {
  item: MediaItem;
  type: MediaType;
  season?: number;
  episode?: number;
  episodeTitle?: string;
};

export default function QueueAddButton({ item, type, season, episode, episodeTitle }: Props) {
  const key = useMemo(
    () => queueItemKey(type, item.id, season, episode),
    [type, item.id, season, episode],
  );
  const [queued, setQueued] = useState(false);

  useEffect(() => {
    const sync = () => setQueued(readQueue().some(entry => entry.key === key));
    sync();
    window.addEventListener(QUEUE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(QUEUE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);

  const toggle = () => {
    if (queued) {
      removeQueueItem(key);
      return;
    }
    addQueueItem(buildQueueItem({ item, type, season, episode, episodeTitle }));
  };

  return (
    <button
      className={`button ghost queue-add-button ${queued ? "queued" : ""}`}
      type="button"
      onClick={toggle}
      aria-pressed={queued}
    >
      <span aria-hidden="true">{queued ? "✓" : "+"}</span>
      {queued ? "In queue" : type === "tv" ? "Add episode to queue" : "Add to queue"}
    </button>
  );
}
