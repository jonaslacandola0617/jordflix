type Props = {
  id: string;
  season: number;
  episode: number;
  maxSeason: number;
  maxEpisode: number;
  episodeTitle?: string;
};

export default function EpisodePicker({ id, season, episode, maxSeason, maxEpisode, episodeTitle }: Props) {
  return (
    <form className="episode-picker" action={`/title/tv/${id}`} method="get">
      <div className="episode-picker-copy">
        <span className="eyebrow">Episode</span>
        <strong>{episodeTitle || `Season ${season} · Episode ${episode}`}</strong>
      </div>
      <label>
        <span>Season</span>
        <input name="season" type="number" min="1" max={Math.max(1, maxSeason)} defaultValue={season} inputMode="numeric" />
      </label>
      <label>
        <span>Episode</span>
        <input name="episode" type="number" min="1" max={Math.max(1, maxEpisode)} defaultValue={episode} inputMode="numeric" />
      </label>
      <button className="button ghost" type="submit">Load episode</button>
    </form>
  );
}
