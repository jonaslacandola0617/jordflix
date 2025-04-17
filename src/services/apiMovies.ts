import { IGenre, IDiscoverMovie } from "@/lib/types";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

export function withLatestQuery(query: string) {
  const date = new Date();
  // date.setMonth(date.getMonth() - 1);
  date.setDate(1);

  const maximum = date.toISOString().split("T")[0];

  return query + `&primary_release_date.lte=${maximum}`;
}

const defaultQueries = "include_adult=false&include_video=false&language=en-US";
const queries = withLatestQuery(defaultQueries);

export async function getMovies() {
  const res = await fetch(
    `${apiUrl}/discover/movie?${queries}&api_key=${apiKey}`
  );
  const { results: movies }: { results: IDiscoverMovie[] } = await res.json();

  return movies;
}

export async function getMovie(id: number) {
  const res = await fetch(`${apiUrl}/movie?api_key=${id}`);

  const movie = await res.json();

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
  const res = await fetch(`${apiUrl}/trending/movie/week?api_key=${apiKey}`);
  const { results: trending }: { results: IDiscoverMovie[] } = await res.json();

  return trending;
}

export async function getMovieGenres() {
  const res = await fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}`);
  const { genres }: { genres: IGenre } = await res.json();

  return genres;
}
