import type { Metadata } from "next";
import Link from "next/link";
import MediaCard from "@/components/MediaCard";
import Pagination from "@/components/Pagination";
import { discover } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "TV Series",
  description: "Discover TV series with current streaming-provider availability in your region.",
};

const sorts = {
  popular: { label: "Popular", sort: "popularity.desc", extra: {} },
  rated: { label: "Top rated", sort: "vote_average.desc", extra: { "vote_count.gte": 200 } },
  recent: { label: "Recently aired", sort: "first_air_date.desc", extra: {} },
} as const;

type SortKey = keyof typeof sorts;

function pageNumber(value?: string) {
  const parsed = Number.parseInt(value || "1", 10);
  return Number.isFinite(parsed) ? Math.min(500, Math.max(1, parsed)) : 1;
}

export default async function SeriesPage({ searchParams }: { searchParams: Promise<{ page?: string; sort?: string }> }) {
  const params = await searchParams;
  const page = pageNumber(params.page);
  const activeSort: SortKey = params.sort && params.sort in sorts ? params.sort as SortKey : "popular";
  const config = sorts[activeSort];
  const data = await discover("tv", page, config.sort, config.extra);

  return (
    <div className="page-shell">
      <header className="page-hero">
        <span className="eyebrow">Television · streaming in your region</span>
        <h1 className="page-title">Series</h1>
        <p className="page-intro">Discover series with regional provider availability, rich title details, official trailers, cast information, season counts, and recommendations.</p>
      </header>
      <nav className="filter-pills" aria-label="Sort TV series">
        {Object.entries(sorts).map(([key, value]) => (
          <Link key={key} className={`pill ${activeSort === key ? "active" : ""}`} href={{ pathname: "/series", query: { sort: key } }}>{value.label}</Link>
        ))}
        <span className="pill informational">Streaming · free · ad-supported</span>
      </nav>
      {data.results.length ? <section className="catalog">{data.results.map(item => <MediaCard key={item.id} item={item} type="tv" />)}</section> : <p className="empty">No series were returned for this page.</p>}
      <Pagination page={page} totalPages={data.total_pages} basePath="/series" query={{ sort: activeSort }} />
    </div>
  );
}
