import type { Metadata } from "next";
import Link from "next/link";
import MediaCard from "@/components/MediaCard";
import Pagination from "@/components/Pagination";
import { discover } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Movies",
  description: "Browse movies with current streaming-provider availability in your region.",
};

const sorts = {
  popular: { label: "Popular", sort: "popularity.desc", extra: {} },
  rated: { label: "Top rated", sort: "vote_average.desc", extra: { "vote_count.gte": 300 } },
  recent: { label: "Recently released", sort: "primary_release_date.desc", extra: {} },
} as const;

type SortKey = keyof typeof sorts;

function pageNumber(value?: string) {
  const parsed = Number.parseInt(value || "1", 10);
  return Number.isFinite(parsed) ? Math.min(500, Math.max(1, parsed)) : 1;
}

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ page?: string; sort?: string }> }) {
  const params = await searchParams;
  const page = pageNumber(params.page);
  const activeSort: SortKey = params.sort && params.sort in sorts ? params.sort as SortKey : "popular";
  const config = sorts[activeSort];
  const data = await discover("movie", page, config.sort, config.extra);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <span className="eyebrow">Cinema · available in your region</span>
        <h1 className="page-title">Movies</h1>
        <p className="page-intro">Browse films with a current online provider listing instead of digging through an endless catalog of titles you cannot actually find.</p>
      </header>
      <nav className="filter-pills" aria-label="Sort movies">
        {Object.entries(sorts).map(([key, value]) => (
          <Link key={key} className={`pill ${activeSort === key ? "active" : ""}`} href={{ pathname: "/movies", query: { sort: key } }}>{value.label}</Link>
        ))}
        <span className="pill informational">Streaming · free · ad-supported</span>
      </nav>
      {data.results.length ? <section className="catalog">{data.results.map(item => <MediaCard key={item.id} item={item} type="movie" />)}</section> : <p className="empty">No movies were returned for this page.</p>}
      <Pagination page={page} totalPages={data.total_pages} basePath="/movies" query={{ sort: activeSort }} />
    </div>
  );
}
