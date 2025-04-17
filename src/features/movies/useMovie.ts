import { getMovie } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

function useMovie() {
  const params = useParams();
  const { isLoading, data, error } = useQuery({
    queryKey: [`movie-${params?.id}`],
    queryFn: () => getMovie(Number(params?.id)),
  });

  return { isLoading, data, error };
}

export default useMovie;
