"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  season: number;
  episode: number;
  maxSeason: number;
  maxEpisode: number;
  episodeTitle?: string;
};

type PickerDropdownProps = {
  label: string;
  value: number;
  max: number;
  onSelect: (value: number) => void;
};

function PickerDropdown({ label, value, max, onSelect }: PickerDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const values = Array.from({ length: Math.max(1, max) }, (_, index) => index + 1);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`episode-dropdown ${open ? "open" : ""}`} ref={rootRef}>
      <span className="episode-dropdown-label">{label}</span>
      <button
        className="episode-dropdown-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
      >
        <span>{label} {value}</span>
        <span className="episode-dropdown-chevron" aria-hidden="true">⌄</span>
      </button>

      {open && (
        <div className="episode-dropdown-menu" role="listbox" aria-label={`Choose ${label.toLowerCase()}`}>
          {values.map(option => (
            <button
              key={option}
              className={`episode-dropdown-option ${option === value ? "active" : ""}`}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                setOpen(false);
                if (option !== value) onSelect(option);
              }}
            >
              <span>{label} {option}</span>
              {option === value && <span className="episode-dropdown-mark" aria-hidden="true">•</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EpisodePicker({ id, season, episode, maxSeason, maxEpisode, episodeTitle }: Props) {
  const router = useRouter();

  function goTo(nextSeason: number, nextEpisode: number) {
    // Season and episode are state within this title, not separate navigation steps.
    // Replacing the current entry keeps Back focused on the page the viewer came from.
    router.replace(`/title/tv/${id}?season=${nextSeason}&episode=${nextEpisode}#watch`);
  }

  return (
    <section className="episode-picker" aria-label="Choose season and episode">
      <div className="episode-picker-copy">
        <span className="eyebrow">Now watching</span>
        <strong>{episodeTitle || `Season ${season} · Episode ${episode}`}</strong>
      </div>

      <PickerDropdown
        label="Season"
        value={season}
        max={maxSeason}
        onSelect={(nextSeason) => goTo(nextSeason, 1)}
      />

      <PickerDropdown
        label="Episode"
        value={episode}
        max={maxEpisode}
        onSelect={(nextEpisode) => goTo(season, nextEpisode)}
      />
    </section>
  );
}
