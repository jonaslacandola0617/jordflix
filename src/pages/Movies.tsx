import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Paginate from "@/components/ui/paginate";
import Sort from "@/components/ui/sort";
import DiscoverMovieCard from "@/features/home/DiscoverMovieCard";
import useMovies from "@/features/movies/useMovies";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import { useEffect } from "react";
import { useSearchParams } from "react-router";

export default function Movies() {
  const { isLoading, data: movies } = useMovies();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["movies"] });
  }, [searchParams, queryClient]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <div className="h-full max-w-[75%] flex flex-col gap-8 mx-auto">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <BreadcrumbLink href="/movies">Movies</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Sort />
      </div>

      <Paginate />

      <div className="grid grid-cols-6 gap-4">
        {movies?.map((movie) => (
          <DiscoverMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
