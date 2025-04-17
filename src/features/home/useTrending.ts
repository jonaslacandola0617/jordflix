import { getTrendingMovies } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";

function useTrending() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: getTrendingMovies,
  });

  return { isLoading, data, error };
}

export default useTrending;
