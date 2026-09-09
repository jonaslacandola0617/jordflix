"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QUEUE_EVENT,
  queueItemKey,
  queueItemLabel,
  queueItemMeta,
  queueItemRoute,
  readQueue,
  removeQueueItem,
  type QueueItem,
} from "@/lib/queue";
import type { MediaType } from "@/lib/types";

type Props = {
  type: MediaType;
  tmdbId: number;
  season?: number;
  episode?: number;
};

export default function QueueNextControl({ type, tmdbId, season, episode }: Props) {
  const router = useRouter();
  const currentKey = useMemo(
    () => queueItemKey(type, tmdbId, season, episode),
    [type, tmdbId, season, episode],
  );
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    const sync = () => setQueue(readQueue());
    sync();
    window.addEventListener(QUEUE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(QUEUE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const currentIndex = queue.findIndex(item => item.key === currentKey);
  const nextItem = currentIndex >= 0 ? queue[currentIndex + 1] : queue[0];

  if (!nextItem) return null;

  const playNext = () => {
    if (currentIndex >= 0) removeQueueItem(currentKey);
    router.push(queueItemRoute(nextItem));
  };

  return (
    <section className="queue-next" aria-label="Next in queue">
      <div className="queue-next-copy">
        <span className="eyebrow">Up next in your queue</span>
        <strong>{queueItemLabel(nextItem)}</strong>
        <small>{queueItemMeta(nextItem)}</small>
      </div>
      <button className="queue-next-button" type="button" onClick={playNext}>
        Play next <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}
