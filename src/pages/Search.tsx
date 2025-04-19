import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Paginate from "@/components/ui/paginate";
import Searchbar from "@/components/ui/searchbar";
import DiscoverMovieCard from "@/features/home/DiscoverMovieCard";
import useFindMovie from "@/features/movies/useFindMovie";
import { Loader } from "lucide-react";
import { useSearchParams } from "react-router";

function Search() {
  const [searchParams] = useSearchParams();
  const { isLoading, data: results } = useFindMovie();

  const query = searchParams.get("query");

  return (
    <div className="max-w-[75%] mx-auto">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/search">Search</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <p>{query}</p>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="w-1/2 ml-auto flex items-center gap-4">
          <Searchbar />
        </div>
      </div>
      <div className={results?.length ? "grid grid-cols-6 gap-4 py-8" : ""}>
        {results?.length
          ? results.map((movie) => (
              <DiscoverMovieCard key={movie.id} movie={movie} />
            ))
          : !isLoading && (
              <p className="p-4 text-sm text-slate-400 dark:text-slate-600">
                That series or movie isn’t here—maybe try another name?
              </p>
            )}
      </div>
      {Boolean(results?.length) && (
        <div className="w-full flex justify-center pb-8">
          <Paginate />
        </div>
      )}
    </div>
  );
}

export default Search;
