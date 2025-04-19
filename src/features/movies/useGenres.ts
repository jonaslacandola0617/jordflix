import { getMovieGenres } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";

function useGenres() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["movie-genres"],
    queryFn: () => getMovieGenres(),
  });

  return { isLoading, data, error };
}

export default useGenres;
