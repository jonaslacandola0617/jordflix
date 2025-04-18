import { getMovie } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

function useMovie() {
  const params = useParams();
  const id = Number(params?.id);

  const { isLoading, data, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id),
  });

  return { isLoading, data, error };
}

export default useMovie;
