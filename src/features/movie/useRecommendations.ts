import { getRecommendations } from "@/services/apiMovies";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

function useRecommendations() {
  const params = useParams();
  const id = Number(params?.id);

  const { isLoading, data, error } = useQuery({
    queryKey: ["similar", id],
    queryFn: () => getRecommendations(id),
  });

  return { isLoading, data, error };
}

export default useRecommendations;
