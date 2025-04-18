import { getMovies } from "@/services/apiMovies";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

function useMovies() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const sortBy = searchParams.get("sortBy");

  const { isLoading, data, error } = useQuery({
    queryKey: ["movies", page, sortBy],
    queryFn: () => getMovies(page || 1, sortBy || ""),
  });

  usePrefetchQuery({
    queryKey: ["movies", page + 1, sortBy],
    queryFn: () => getMovies(page + 1, sortBy || ""),
  });

  return { isLoading, data, error };
}

export default useMovies;
