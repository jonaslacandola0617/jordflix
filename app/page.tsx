import Hero from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import { discover, trending } from "@/lib/tmdb";

export default async function HomePage() {
  const [movieDiscovery, seriesDiscovery, trendingMovies] = await Promise.all([
    discover("movie", 1, "popularity.desc"),
    discover("tv", 1, "popularity.desc"),
    trending("movie"),
  ]);
  const featured = movieDiscovery.results.find((item) => item.backdrop_path && item.overview) || trendingMovies[0];
  return <><Hero item={featured} type="movie" /><div className="home-shell"><MediaRow eyebrow="Streaming in your region" title="Movies people are watching" items={movieDiscovery.results} type="movie" href="/movies" /><MediaRow eyebrow="Series" title="Worth getting hooked on" items={seriesDiscovery.results} type="tv" href="/series" /><MediaRow eyebrow="This week" title="Trending now" items={trendingMovies} type="movie" href="/movies" /></div></>;
}
