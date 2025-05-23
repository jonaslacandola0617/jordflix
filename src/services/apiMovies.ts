import { IGenre, IDiscoverMovie, IDetailMovie } from "@/lib/types";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

export function withLatestQuery(query: string) {
  const date = new Date();
  // date.setMonth(date.getMonth() - 1);
  date.setDate(1);

  const maximum = date.toISOString().split("T")[0];

  return query + `&primary_release_date.lte=${maximum}`;
}

const defaultQueries =
  "include_adult=false&include_video=false&language=en-US&vote_count.gte=100";
const queries = withLatestQuery(defaultQueries);

export async function getMovies(page = 1, sortBy = "") {
  const res = await fetch(
    `${apiUrl}/discover/movie?${queries}&sort_by=${sortBy}&page=${page}&api_key=${apiKey}`
  );
  const { results: movies }: { results: IDiscoverMovie[] } = await res.json();

  return movies;
}

export async function getMovie(id: number) {
  const res = await fetch(`${apiUrl}/movie/${id}?api_key=${apiKey}`);

  const movie: IDetailMovie = await res.json();

  return movie;
}

export async function getLatestMovies() {
  const additional = "sort_by=popularity.desc";

  const res = await fetch(
    `${apiUrl}/discover/movie?${queries}&${additional}&api_key=${apiKey}`
  );
  const { results: latest }: { results: IDiscoverMovie[] } = await res.json();

  return latest;
}

export async function getTopRatedMovies() {
  const additional =
    "sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200";

  const res = await fetch(
    `${apiUrl}/discover/movie?${queries}&${additional}&api_key=${apiKey}`
  );
  const { results: topRated }: { results: IDiscoverMovie[] } = await res.json();

  return topRated;
}

export async function getTrendingMovies() {
  const res = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}`);
  const { results: trending }: { results: IDiscoverMovie[] } = await res.json();

  return trending;
}

export async function getRecommendations(id: number) {
  const res = await fetch(
    `${apiUrl}/movie/${id}/recommendations?api_key=${apiKey}`
  );
  const { results: recommendations }: { results: IDiscoverMovie[] } =
    await res.json();

  return recommendations;
}

export async function findMovie(query: string, page = 1) {
  const res = await fetch(
    `${apiUrl}/search/movie?${defaultQueries}&query=${query}&page=${page}&api_key=${apiKey}`
  );

  const { results }: { results: IDiscoverMovie[] } = await res.json();

  return results;
}

export async function getMoviesByGenre(page = 1, sortBy = "", genreId: number) {
  const res = await fetch(
    `${apiUrl}/discover/movie?${queries}&sort_by=${sortBy}&page=${page}&with_genres=${genreId}&api_key=${apiKey}`
  );
  const { results: movies }: { results: IDiscoverMovie[] } = await res.json();

  return movies;
}

export async function getMoviesByCountry(page = 1, sortBy = "", country = "") {
  const res = await fetch(
    `${apiUrl}/discover/movie?${queries}&sort_by=${sortBy}&page=${page}&with_origin_country=${country}&api_key=${apiKey}`
  );
  const { results: movies }: { results: IDiscoverMovie[] } = await res.json();

  return movies;
}

export async function getMovieGenres() {
  const res = await fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}`);
  const { genres }: { genres: IGenre[] } = await res.json();

  return genres;
}
