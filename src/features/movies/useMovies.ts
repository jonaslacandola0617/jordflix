import { getMovies } from "@/services/apiMovies";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

function useMovies() {
  const [searchParams] = useSearchParams();

  const { isLoading, data, error } = useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies(Number(searchParams.get("page")) || 1),
  });

  usePrefetchQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies(Number(searchParams.get("page")) + 1),
  });

  return { isLoading, data, error };
}

export default useMovies;
