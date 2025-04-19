import { getMoviesByGenre } from "@/services/apiMovies";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

function useMoviesGenre(genreId: number) {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const sortBy = searchParams.get("sortBy");

  const { isLoading, data, error } = useQuery({
    queryKey: ["movies", page, sortBy, genreId],
    queryFn: () => getMoviesByGenre(page || 1, sortBy || "", genreId || 0),
  });

  usePrefetchQuery({
    queryKey: ["movies", page + 1, sortBy, genreId],
    queryFn: () => getMoviesByGenre(page + 1, sortBy || "", genreId || 0),
  });

  return { isLoading, data, error };
}

export default useMoviesGenre;
