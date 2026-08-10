"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: string;
  season: number;
  episode: number;
  maxSeason: number;
  maxEpisode: number;
  episodeTitle?: string;
};

export default function EpisodePicker({ id, season, episode, maxSeason, maxEpisode, episodeTitle }: Props) {
  const router = useRouter();
  const seasons = Array.from({ length: Math.max(1, maxSeason) }, (_, index) => index + 1);
  const episodes = Array.from({ length: Math.max(1, maxEpisode) }, (_, index) => index + 1);

  function goTo(nextSeason: number, nextEpisode: number) {
    router.push(`/title/tv/${id}?season=${nextSeason}&episode=${nextEpisode}#watch`);
  }

  return (
    <section className="episode-picker" aria-label="Choose season and episode">
      <div className="episode-picker-copy">
        <span className="eyebrow">Now watching</span>
        <strong>{episodeTitle || `Season ${season} · Episode ${episode}`}</strong>
      </div>

      <label>
        <span>Season</span>
        <select
          value={season}
          aria-label="Season"
          onChange={(event) => goTo(Number(event.target.value), 1)}
        >
          {seasons.map(value => <option key={value} value={value}>Season {value}</option>)}
        </select>
      </label>

      <label>
        <span>Episode</span>
        <select
          value={episode}
          aria-label="Episode"
          onChange={(event) => goTo(season, Number(event.target.value))}
        >
          {episodes.map(value => <option key={value} value={value}>Episode {value}</option>)}
        </select>
      </label>
    </section>
  );
}
