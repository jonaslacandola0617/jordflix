import { getLatestMovies } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";

function useLatest() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["latestMovies"],
    queryFn: getLatestMovies,
  });

  return { isLoading, data, error };
}

export default useLatest;
