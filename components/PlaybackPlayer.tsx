"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PlaybackEmbedSource } from "@/lib/playback";

type Props = {
  title: string;
  embedSources?: PlaybackEmbedSource[];
  source?: string | null;
  trailerKey?: string;
  poster?: string | null;
};

function ServerSelector({ sources, value, onChange }: { sources: PlaybackEmbedSource[]; value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = sources.find(item => item.id === value) || sources[0];

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className={`server-selector ${open ? "open" : ""}`} ref={rootRef}>
      <button
        className="server-selector-trigger"
        type="button"
        onClick={() => setOpen(current => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="server-selector-copy">
          <small>Playback source</small>
          <strong>{selected?.label || "Choose server"}</strong>
        </span>
        <span className="server-selector-chevron" aria-hidden="true">⌄</span>
      </button>

      {open && (
        <div className="server-selector-menu" role="listbox" aria-label="Playback server">
          {sources.map(item => {
            const available = Boolean(item.configured && item.url);
            const active = item.id === value;
            return (
              <button
                className={`server-selector-option ${active ? "active" : ""}`}
                key={item.id}
                type="button"
                role="option"
                aria-selected={active}
                disabled={!available}
                onClick={() => {
                  if (!available) return;
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                <span className="server-option-main">
                  <i aria-hidden="true" />
                  <strong>{item.label}</strong>
                </span>
                <small>{available ? (active ? "Playing" : "Ready") : "Not configured"}</small>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PlaybackPlayer({ title, embedSources = [], source, trailerKey, poster }: Props) {
  const configuredSources = embedSources.filter(item => item.configured && item.url);
  const firstServerId = configuredSources[0]?.id || "";
  const [selectedServerId, setSelectedServerId] = useState(firstServerId);
  const selectedSource = embedSources.find(item => item.id === selectedServerId && item.configured && item.url);
  const activeSource = selectedSource || configuredSources[0];
  const embedUrl = activeSource?.url || null;
  const isHls = source ? /\.m3u8(?:$|\?)/i.test(source) : false;
  const hasPlayback = Boolean(embedUrl || source);

  useEffect(() => {
    if (!selectedSource && firstServerId && selectedServerId !== firstServerId) {
      setSelectedServerId(firstServerId);
    }
  }, [firstServerId, selectedServerId, selectedSource]);

  return (
    <section className="playback-section" id="watch" aria-labelledby="watch-heading">
      <div className="playback-heading">
        <div>
          <span className="eyebrow">Jordflix player</span>
          <h2 className="subhead" id="watch-heading">Watch {title}</h2>
        </div>
        <span className={`playback-status ${hasPlayback ? "ready" : "trailer-only"}`}>
          {embedUrl ? `${activeSource?.label || "Embed"} ready` : source ? "Media source ready" : trailerKey ? "Trailer mode" : "No source configured"}
        </span>
      </div>

      <div className="player-shell">
        {embedUrl ? (
          <iframe
            key={`${activeSource?.id}:${embedUrl}`}
            className="video-player embed-player"
            src={embedUrl}
            title={`${title} ${activeSource?.label || "Jordflix"} player`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : source ? (
          <video
            className="video-player"
            controls
            playsInline
            preload="metadata"
            poster={poster || undefined}
          >
            <source src={source} type={isHls ? "application/vnd.apple.mpegurl" : undefined} />
            Your browser could not play this video source.
          </video>
        ) : trailerKey ? (
          <iframe
            className="video-player trailer-player"
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?rel=0`}
            title={`${title} official trailer`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : poster ? (
          <div className="player-placeholder">
            <Image src={poster} alt="" fill sizes="(max-width: 900px) 100vw, 70vw" />
            <div className="player-placeholder-scrim" />
            <div className="player-placeholder-copy">
              <strong>Player ready for your media.</strong>
              <span>Configure one of your self-hosted server routes or an MP4/HLS source to start playback here.</span>
            </div>
          </div>
        ) : (
          <div className="player-placeholder plain">
            <div className="player-placeholder-copy">
              <strong>Player ready for your media.</strong>
              <span>Configure a playback source for this title.</span>
            </div>
          </div>
        )}
      </div>

      {embedSources.length > 0 && (
        <div className="playback-toolbar">
          <ServerSelector sources={embedSources} value={activeSource?.id || selectedServerId} onChange={setSelectedServerId} />
        </div>
      )}

      {!embedUrl && source && isHls && (
        <p className="player-note">HLS playback depends on browser support. MP4 works most consistently across desktop and mobile browsers.</p>
      )}
      {!hasPlayback && trailerKey && (
        <p className="player-note">Showing the official trailer because no self-hosted playback source is configured for this title.</p>
      )}
    </section>
  );
}
