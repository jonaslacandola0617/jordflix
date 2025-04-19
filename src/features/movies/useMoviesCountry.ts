import { getMoviesByCountry } from "@/services/apiMovies";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

function useMoviesCountry(country: string) {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const sortBy = searchParams.get("sortBy");

  const { isLoading, data, error } = useQuery({
    queryKey: ["movies", page, sortBy, country],
    queryFn: () => getMoviesByCountry(page || 1, sortBy || "", country || ""),
  });

  usePrefetchQuery({
    queryKey: ["movies", page + 1, sortBy, country],
    queryFn: () => getMoviesByCountry(page + 1, sortBy || "", country || ""),
  });

  return { isLoading, data, error };
}

export default useMoviesCountry;
