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
import useMoviesCountry from "@/features/movies/useMoviesCountry";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router";

function MoviesCountry() {
  const params = useParams();
  const country = params.country || "";

  const { isLoading, data: movies } = useMoviesCountry(country);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["movies"] });
  }, [searchParams, queryClient]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <div className="h-full max-w-[80%] flex flex-col gap-4 mx-auto xl:max-w-[75%]">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/movies">Movies</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {isLoading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <BreadcrumbItem>
                <p>{country}</p>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <Sort />
      </div>

      <Paginate />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
        {movies?.map((movie) => (
          <DiscoverMovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MoviesCountry;
