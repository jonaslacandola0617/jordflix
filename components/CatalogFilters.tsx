import Link from "next/link";
import type { TmdbCountry, TmdbGenre } from "@/lib/tmdb";

type Props = {
  basePath: string;
  sort: string;
  genre?: string;
  country?: string;
  genres: TmdbGenre[];
  countries: TmdbCountry[];
};

export default function CatalogFilters({ basePath, sort, genre = "", country = "", genres, countries }: Props) {
  const hasFilters = Boolean(genre || country);

  return (
    <form className="catalog-filter-form" action={basePath} method="get">
      <input type="hidden" name="sort" value={sort} />
      <label className="catalog-select">
        <span>Genre</span>
        <select name="genre" defaultValue={genre} aria-label="Filter by genre">
          <option value="">All genres</option>
          {genres.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <label className="catalog-select">
        <span>Country</span>
        <select name="country" defaultValue={country} aria-label="Filter by country of origin">
          <option value="">All countries</option>
          {countries.map(item => <option key={item.iso_3166_1} value={item.iso_3166_1}>{item.english_name}</option>)}
        </select>
      </label>
      <button className="catalog-apply" type="submit">Apply</button>
      {hasFilters && <Link className="catalog-clear" href={{ pathname: basePath, query: { sort } }}>Clear</Link>}
    </form>
  );
}
