import type { Metadata } from "next";
import Link from "next/link";
import BurnTitle from "@/components/BurnTitle";
import CatalogFilters from "@/components/CatalogFilters";
import CompactPagination from "@/components/CompactPagination";
import MediaCard from "@/components/MediaCard";
import Pagination from "@/components/Pagination";
import { countries, discover, genres } from "@/lib/tmdb";

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
type Query = { page?: string; sort?: string; genre?: string; country?: string };

function pageNumber(value?: string) {
  const parsed = Number.parseInt(value || "1", 10);
  return Number.isFinite(parsed) ? Math.min(500, Math.max(1, parsed)) : 1;
}

function genreId(value?: string) {
  return value && /^\d+$/.test(value) ? value : "";
}

function countryCode(value?: string) {
  return value && /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : "";
}

export default async function SeriesPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams;
  const page = pageNumber(params.page);
  const activeSort: SortKey = params.sort && params.sort in sorts ? params.sort as SortKey : "popular";
  const activeGenre = genreId(params.genre);
  const activeCountry = countryCode(params.country);
  const config = sorts[activeSort];
  const filterExtra = {
    ...config.extra,
    with_genres: activeGenre || undefined,
    with_origin_country: activeCountry || undefined,
  };

  const [data, genreOptions, countryOptions] = await Promise.all([
    discover("tv", page, config.sort, filterExtra),
    genres("tv"),
    countries(),
  ]);

  const persistentQuery = {
    sort: activeSort,
    genre: activeGenre || undefined,
    country: activeCountry || undefined,
  };

  return (
    <div className="page-shell">
      <header className="page-hero">
        <span className="eyebrow">Television · streaming in your region</span>
        <h1 className="page-title burn-title"><BurnTitle text="Series" /></h1>
        <p className="page-intro">Discover series with regional provider availability, rich title details, official trailers, cast information, season counts, and recommendations.</p>
      </header>

      <div className="catalog-controls">
        <nav className="filter-pills catalog-sort-row" aria-label="Sort TV series">
          {Object.entries(sorts).map(([key, value]) => (
            <Link
              key={key}
              className={`pill ${activeSort === key ? "active" : ""}`}
              href={{ pathname: "/series", query: { sort: key, genre: activeGenre || undefined, country: activeCountry || undefined } }}
            >
              {value.label}
            </Link>
          ))}
          <span className="pill informational">Streaming · free · ad-supported</span>
        </nav>

        <div className="catalog-discovery-strip">
          <CatalogFilters basePath="/series" sort={activeSort} genre={activeGenre} country={activeCountry} genres={genreOptions} countries={countryOptions} />
          <CompactPagination page={page} totalPages={data.total_pages} basePath="/series" query={persistentQuery} />
        </div>
      </div>

      {data.results.length ? <section className="catalog">{data.results.map(item => <MediaCard key={item.id} item={item} type="tv" />)}</section> : <p className="empty">No series match these filters.</p>}
      <Pagination page={page} totalPages={data.total_pages} basePath="/series" query={persistentQuery} />
    </div>
  );
}
