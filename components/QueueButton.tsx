"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  QUEUE_EVENT,
  clearQueue,
  moveQueueItem,
  queueItemLabel,
  queueItemMeta,
  queueItemRoute,
  readQueue,
  removeQueueItem,
  type QueueItem,
} from "@/lib/queue";

function posterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w342${path}` : null;
}

export default function QueueButton() {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setQueue(readQueue());
    sync();
    window.addEventListener(QUEUE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(QUEUE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const play = (item: QueueItem) => {
    setOpen(false);
    router.push(queueItemRoute(item));
  };

  const drawer = mounted && open
    ? createPortal(
        <div
          className="queue-layer"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <aside className="queue-drawer" role="dialog" aria-modal="true" aria-labelledby="queue-title">
            <div className="queue-drawer-head">
              <div>
                <span className="eyebrow">Your marathon</span>
                <h2 id="queue-title">Jordflix Queue</h2>
              </div>
              <button className="queue-close" type="button" onClick={() => setOpen(false)} aria-label="Close queue">×</button>
            </div>

            {queue.length === 0 ? (
              <div className="queue-empty">
                <div className="queue-empty-mark" aria-hidden="true">＋</div>
                <strong>Your queue is empty.</strong>
                <p>Add a movie or the exact series episode you want to watch next.</p>
              </div>
            ) : (
              <>
                <div className="queue-list">
                  {queue.map((item, index) => {
                    const poster = posterUrl(item.posterPath);
                    return (
                      <article className="queue-entry" key={item.key}>
                        <button className="queue-entry-main" type="button" onClick={() => play(item)}>
                          <span className="queue-position">{String(index + 1).padStart(2, "0")}</span>
                          <span className="queue-poster">
                            {poster ? (
                              <Image src={poster} alt="" fill sizes="54px" />
                            ) : (
                              <span className="queue-poster-fallback">J</span>
                            )}
                          </span>
                          <span className="queue-entry-copy">
                            <strong>{queueItemLabel(item)}</strong>
                            <small>{queueItemMeta(item)}</small>
                          </span>
                          <span className="queue-play" aria-hidden="true">▶</span>
                        </button>

                        <div className="queue-entry-actions" aria-label={`Reorder ${queueItemLabel(item)}`}>
                          <button
                            type="button"
                            onClick={() => moveQueueItem(item.key, -1)}
                            disabled={index === 0}
                            aria-label="Move up"
                            title="Move up"
                          >↑</button>
                          <button
                            type="button"
                            onClick={() => moveQueueItem(item.key, 1)}
                            disabled={index === queue.length - 1}
                            aria-label="Move down"
                            title="Move down"
                          >↓</button>
                          <button
                            className="queue-remove"
                            type="button"
                            onClick={() => removeQueueItem(item.key)}
                            aria-label={`Remove ${queueItemLabel(item)} from queue`}
                            title="Remove"
                          >×</button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="queue-drawer-foot">
                  <span>{queue.length} {queue.length === 1 ? "title" : "items"} queued</span>
                  <button type="button" onClick={clearQueue}>Clear queue</button>
                </div>
              </>
            )}
          </aside>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        className="queue-nav-button"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={queue.length ? `Open queue with ${queue.length} items` : "Open queue"}
      >
        <span className="queue-nav-icon" aria-hidden="true">≡</span>
        <span className="queue-nav-label">Queue</span>
        {queue.length > 0 && <span className="queue-badge">{queue.length > 99 ? "99+" : queue.length}</span>}
      </button>
      {drawer}
    </>
  );
}
