import { findMovie } from "@/services/apiMovies";
import { usePrefetchQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

function useFindMovie() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const page = Number(searchParams.get("page"));

  const { isLoading, data, error } = useQuery({
    queryKey: ["find", query, page],
    queryFn: () => findMovie(query || "", page || 1),
  });

  usePrefetchQuery({
    queryKey: ["find", query, page + 1],
    queryFn: () => findMovie(query || "", page + 1),
  });

  return { isLoading, data, error };
}

export default useFindMovie;
