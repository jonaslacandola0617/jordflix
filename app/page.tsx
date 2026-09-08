import Hero from "@/components/Hero";
import MediaRow from "@/components/MediaRow";
import PersonalizedRow from "@/components/PersonalizedRow";
import { getCommunityWatchActivity } from "@/lib/activity";
import { discover, trending } from "@/lib/tmdb";
import type { MediaItem, MediaType } from "@/lib/types";

function withType(items: MediaItem[], type: MediaType) {
  return items.map(item => ({ ...item, media_type: type }));
}

function itemKey(item: MediaItem) {
  return `${item.media_type || "movie"}:${item.id}`;
}

function dateValue(item: MediaItem) {
  const value = item.release_date || item.first_air_date || "";
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: number) {
  const copy = [...items];
  let state = seed || 1;

  const random = () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function unique(items: MediaItem[]) {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = itemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(item.poster_path);
  });
}

export default async function HomePage() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const freshSinceDate = new Date(now);
  freshSinceDate.setUTCDate(freshSinceDate.getUTCDate() - 35);
  const freshSince = freshSinceDate.toISOString().slice(0, 10);
  const previousYear = `${now.getUTCFullYear() - 1}-12-31`;
  const dailySeed = hashSeed(today);

  const [
    dailyTrending,
    freshMovies,
    freshSeries,
    gemMovies,
    gemSeries,
    ratedMovies,
    ratedSeries,
    communityActivity,
  ] = await Promise.all([
    trending("all", "day"),
    discover("movie", 1, "primary_release_date.desc", {
      "primary_release_date.gte": freshSince,
      "primary_release_date.lte": today,
      "vote_count.gte": 10,
    }),
    discover("tv", 1, "first_air_date.desc", {
      "first_air_date.gte": freshSince,
      "first_air_date.lte": today,
      "vote_count.gte": 10,
    }),
    discover("movie", 1, "vote_average.desc", {
      "vote_average.gte": 7,
      "vote_count.gte": 100,
      "primary_release_date.lte": previousYear,
    }),
    discover("tv", 1, "vote_average.desc", {
      "vote_average.gte": 7,
      "vote_count.gte": 100,
      "first_air_date.lte": previousYear,
    }),
    discover("movie", 1, "vote_average.desc", { "vote_count.gte": 1000 }),
    discover("tv", 1, "vote_average.desc", { "vote_count.gte": 1000 }),
    getCommunityWatchActivity(20),
  ]);

  const trendingItems = unique(dailyTrending).slice(0, 20);
  const trendingKeys = new Set(trendingItems.map(itemKey));

  const freshItems = unique([
    ...withType(freshMovies.results, "movie"),
    ...withType(freshSeries.results, "tv"),
  ])
    .sort((a, b) => dateValue(b) - dateValue(a))
    .slice(0, 20);
  const freshKeys = new Set(freshItems.map(itemKey));

  const gemPool = unique([
    ...withType(gemMovies.results, "movie"),
    ...withType(gemSeries.results, "tv"),
  ]).filter(item => !trendingKeys.has(itemKey(item)) && !freshKeys.has(itemKey(item)));
  const hiddenGems = seededShuffle(gemPool, dailySeed ^ 0x9E3779B9).slice(0, 20);

  const highlyRated = unique([
    ...withType(ratedMovies.results, "movie"),
    ...withType(ratedSeries.results, "tv"),
  ])
    .sort((a, b) => b.vote_average - a.vote_average || b.vote_count - a.vote_count)
    .slice(0, 20);

  const heroCandidates = trendingItems.filter(item => item.backdrop_path && item.overview);
  const fallbackCandidates = [...freshItems, ...highlyRated].filter(item => item.backdrop_path && item.overview);
  const candidates = heroCandidates.length ? heroCandidates : fallbackCandidates;
  const featured = candidates[dailySeed % Math.max(candidates.length, 1)] || trendingItems[0] || freshItems[0] || highlyRated[0];
  const featuredType: MediaType = featured?.media_type === "tv" ? "tv" : "movie";

  return <>
    {featured && <Hero item={featured} type={featuredType} />}
    <div className="home-shell">
      <MediaRow
        eyebrow="Updated throughout the day"
        title="Trending today"
        items={trendingItems}
        type="movie"
      />

      {communityActivity.length > 0 && (
        <MediaRow
          eyebrow="Recent Jordflix activity"
          title="Jordflix viewers are watching"
          items={communityActivity}
          type="movie"
        />
      )}

      <PersonalizedRow />

      <MediaRow
        eyebrow="Recently released in your region"
        title="Fresh this month"
        items={freshItems}
        type="movie"
      />

      <MediaRow
        eyebrow="A different cut every day"
        title="Hidden gems today"
        items={hiddenGems}
        type="movie"
      />

      <MediaRow
        eyebrow="Evergreen favorites"
        title="Highly rated"
        items={highlyRated}
        type="movie"
      />
    </div>
  </>;
}
