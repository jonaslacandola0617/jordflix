import type { Metadata } from "next";
import Link from "next/link";
import CatalogFilters from "@/components/CatalogFilters";
import CompactPagination from "@/components/CompactPagination";
import MediaCard from "@/components/MediaCard";
import Pagination from "@/components/Pagination";
import { countries, discover, genres } from "@/lib/tmdb";

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

export default async function MoviesPage({ searchParams }: { searchParams: Promise<Query> }) {
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
    discover("movie", page, config.sort, filterExtra),
    genres("movie"),
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
        <span className="eyebrow">Cinema · available in your region</span>
        <h1 className="page-title">Movies</h1>
        <p className="page-intro">Browse films with a current online provider listing instead of digging through an endless catalog of titles you cannot actually find.</p>
      </header>

      <div className="catalog-controls">
        <nav className="filter-pills catalog-sort-row" aria-label="Sort movies">
          {Object.entries(sorts).map(([key, value]) => (
            <Link
              key={key}
              className={`pill ${activeSort === key ? "active" : ""}`}
              href={{ pathname: "/movies", query: { sort: key, genre: activeGenre || undefined, country: activeCountry || undefined } }}
            >
              {value.label}
            </Link>
          ))}
          <span className="pill informational">Streaming · free · ad-supported</span>
        </nav>

        <div className="catalog-discovery-strip">
          <CatalogFilters basePath="/movies" sort={activeSort} genre={activeGenre} country={activeCountry} genres={genreOptions} countries={countryOptions} />
          <CompactPagination page={page} totalPages={data.total_pages} basePath="/movies" query={persistentQuery} />
        </div>
      </div>

      {data.results.length ? <section className="catalog">{data.results.map(item => <MediaCard key={item.id} item={item} type="movie" />)}</section> : <p className="empty">No movies match these filters.</p>}
      <Pagination page={page} totalPages={data.total_pages} basePath="/movies" query={persistentQuery} />
    </div>
  );
}
