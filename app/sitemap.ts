import type { MetadataRoute } from "next";
import { discover } from "@/lib/tmdb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [movies, series] = await Promise.all([
    discover("movie", 1, "popularity.desc"),
    discover("tv", 1, "popularity.desc"),
  ]);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/movies`, changeFrequency: "daily", priority: .9 },
    { url: `${base}/series`, changeFrequency: "daily", priority: .9 },
    ...movies.results.slice(0, 20).map(item => ({ url: `${base}/title/movie/${item.id}`, changeFrequency: "weekly" as const, priority: .7 })),
    ...series.results.slice(0, 20).map(item => ({ url: `${base}/title/tv/${item.id}`, changeFrequency: "weekly" as const, priority: .7 })),
  ];
}
