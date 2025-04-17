import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Paginate from "@/components/ui/paginate";
import DiscoverMovieCard from "@/features/home/DiscoverMovieCard";
import useMovies from "@/features/movies/useMovies";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

export default function Movies() {
  const { data: movies } = useMovies();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const page = searchParams.get("page");

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["movies"] });
  }, [page, queryClient]);

  return (
    <div className="h-full max-w-[75%] flex flex-col gap-8 py-20 mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/movies">Movies</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-6 gap-4">
        {movies?.map((movie) => (
          <DiscoverMovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <Paginate />
    </div>
  );
}
