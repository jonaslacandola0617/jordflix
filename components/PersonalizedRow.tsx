"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import MediaRail from "@/components/MediaRail";
import { readWatchHistory, type WatchHistoryEntry } from "@/lib/watch-history";
import type { MediaItem, MediaType } from "@/lib/types";

function titleOf(item: MediaItem) {
  return item.title || item.name || "Untitled";
}

function yearOf(item: MediaItem) {
  const date = item.release_date || item.first_air_date || "";
  return date ? date.slice(0, 4) : "—";
}

function posterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : null;
}

function PersonalizedCard({ item, fallbackType }: { item: MediaItem; fallbackType: MediaType }) {
  const type = item.media_type === "movie" || item.media_type === "tv" ? item.media_type : fallbackType;
  const title = titleOf(item);
  const poster = posterUrl(item.poster_path);

  return (
    <Link className="media-card" href={`/title/${type}/${item.id}`} aria-label={`${title}, ${yearOf(item)}`}>
      <div className="poster-wrap">
        {poster ? <Image src={poster} alt={`${title} poster`} fill sizes="(max-width: 640px) 42vw, (max-width: 1100px) 22vw, 15vw" /> : <div className="poster-fallback">J</div>}
        <div className="card-overlay"><span className="play-chip">▶</span><span>View title</span></div>
      </div>
      <div className="card-copy">
        <h3>{title}</h3>
        <div><span>{yearOf(item)}</span><span className="rating">★ {item.vote_average ? item.vote_average.toFixed(1) : "NR"}</span></div>
      </div>
    </Link>
  );
}

export default function PersonalizedRow() {
  const [source, setSource] = useState<WatchHistoryEntry | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);

  const load = useCallback(async () => {
    const latest = readWatchHistory()[0] || null;
    setSource(latest);
    setItems([]);

    if (!latest) return;

    try {
      const response = await fetch(`/api/recommendations?type=${latest.type}&id=${latest.item.id}`);
      if (!response.ok) return;
      const data = await response.json() as { results?: MediaItem[] };
      setItems((data.results || []).filter(item => item.id !== latest.item.id && item.poster_path).slice(0, 20));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
    window.addEventListener("jordflix:watch-history-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("jordflix:watch-history-changed", load);
      window.removeEventListener("storage", load);
    };
  }, [load]);

  if (!source || items.length === 0) return null;

  const sourceTitle = titleOf(source.item);

  return (
    <section className="media-section personalized-section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Picked from your watch history</span>
          <h2>Because you watched {sourceTitle}</h2>
        </div>
      </div>
      <MediaRail label={`Because you watched ${sourceTitle}`}>
        {items.map(item => <PersonalizedCard key={`${item.media_type || source.type}-${item.id}`} item={item} fallbackType={source.type} />)}
      </MediaRail>
    </section>
  );
}
