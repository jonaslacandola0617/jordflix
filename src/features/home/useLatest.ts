import { getLatestMovies } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";

function useLatest() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["latest-movies"],
    queryFn: getLatestMovies,
  });

  return { isLoading, data, error };
}

export default useLatest;
