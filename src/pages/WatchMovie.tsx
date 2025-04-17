import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useMovie from "../features/movies/useMovie";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function WatchMovie() {
  const { isLoading, data: movie } = useMovie();

  useEffect(() => {
    document.title = `Jordflix / ${movie?.title || "Playing now..."}`;
  }, [movie?.title]);

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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/movies/watch/${movie?.id}`}>
              {isLoading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                movie?.title
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AspectRatio ratio={20 / 9} className="w-full h-full">
        <iframe
          src={`https://vidsrc.me/embed/movie?tmdb=${movie?.id}`}
          className="object-contain w-full h-full"
        ></iframe>
      </AspectRatio>
      <AspectRatio className="absolute top-0">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.cover_path}`}
          alt=""
        />
      </AspectRatio>
    </div>
  );
}

export default WatchMovie;
