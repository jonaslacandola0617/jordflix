import Hero from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import { discover } from "@/lib/tmdb";

export default async function HomePage() {
  const [movieDiscovery, seriesDiscovery, highlyRated] = await Promise.all([
    discover("movie", 1, "popularity.desc"),
    discover("tv", 1, "popularity.desc"),
    discover("movie", 1, "vote_average.desc", { "vote_count.gte": 500 }),
  ]);
  const featured = movieDiscovery.results.find((item) => item.backdrop_path && item.overview) || movieDiscovery.results[0];

  return <><Hero item={featured} type="movie" /><div className="home-shell"><MediaRow eyebrow="Streaming in your region" title="Movies people are watching" items={movieDiscovery.results} type="movie" href="/movies" /><MediaRow eyebrow="Series" title="Worth getting hooked on" items={seriesDiscovery.results} type="tv" href="/series" /><MediaRow eyebrow="Crowd favorites" title="Highly rated, actually available" items={highlyRated.results} type="movie" href="/movies?sort=rated" /></div></>;
}
