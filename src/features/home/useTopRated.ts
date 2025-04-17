import { getTopRatedMovies } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";

function useTopRated() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: getTopRatedMovies,
  });

  return { isLoading, data, error };
}

export default useTopRated;
