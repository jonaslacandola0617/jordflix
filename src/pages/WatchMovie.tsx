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
import { Card, CardHeader } from "@/components/ui/card";

function WatchMovie() {
  const { isLoading, data: movie } = useMovie();

  useEffect(() => {
    document.title = `Jordflix / ${movie?.title || "Playing now..."}`;
  }, [movie?.title]);

  return (
    <div className="relative w-full h-full">
      <div className="max-w-[75%] flex flex-col gap-8 mt-18 mx-auto">
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
            className="object-contain w-full h-full rounded-2xl"
          ></iframe>
        </AspectRatio>
      </div>

      <div className="relative w-full py-18">
        <div className="max-w-[75%] flex items-center justify-center gap-8 m-auto z-10 relative">
          <Card className="h-80 w-60 p-0 gap-0 overflow-hidden">
            <CardHeader className="p-0">
              <AspectRatio ratio={9 / 12}>
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </CardHeader>
          </Card>
          <div className="w-1/2 flex flex-col gap-4">
            <p className="text-left text-2xl font-bold">{movie?.title}</p>
            <p className="text-left text-sm opacity-90">{movie?.overview}</p>
          </div>
        </div>

        {/* Background image with dark overlay */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
            alt=""
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-950/70" />
        </div>
      </div>
    </div>
  );
}

export default WatchMovie;
