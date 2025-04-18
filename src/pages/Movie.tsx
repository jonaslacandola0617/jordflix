import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useMovie from "../features/movie/useMovie";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CardCarousel from "@/components/ui/cardcarousel";
import useRecommendations from "@/features/movie/useRecommendations";
import { CarouselItem } from "@/components/ui/carousel";
import DiscoverMovieCard from "@/features/home/DiscoverMovieCard";

function Movie() {
  const { isLoading, data: movie } = useMovie();
  const { data: recommendations } = useRecommendations();

  useEffect(() => {
    document.title = `Jordflix / ${movie?.title || "Playing now..."}`;
  }, [movie?.title]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movie]);

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
        <AspectRatio ratio={16 / 9} className="w-full">
          <iframe
            src={`https://vidsrc.me/embed/movie?tmdb=${movie?.id}`}
            className="object-contain w-full h-full rounded-2xl"
          ></iframe>
        </AspectRatio>
      </div>

      <div className="relative w-full py-18">
        <div className="max-w-[80%] lg:max-w-[75%] flex items-center justify-center gap-8 m-auto z-10 relative">
          <Card className="lg:h-80 lg:w-60 p-0 gap-0 overflow-hidden hidden lg:block">
            <CardHeader className="p-0">
              <AspectRatio ratio={9 / 12}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
                  alt=""
                  className="object-cover object-top w-full h-full"
                />
              </AspectRatio>
            </CardHeader>
          </Card>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <p className="text-left text-lg lg:text-2xl font-bold">
              {movie?.title}
            </p>
            <p className="flex items-center gap-2 text-left text-xs lg:text-sm opacity-90">
              {movie?.genres.map((genre) => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </p>
            <p className="text-left text-xs lg:text-sm opacity-90">
              {movie?.overview}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              {movie?.production_companies.map((company) => (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 lg:h-8 lg:w-8">
                    <AvatarImage
                      src={`https://image.tmdb.org/t/p/w500/${company.logo_path}`}
                      className="object-contain dark:bg-white"
                    />
                    <AvatarFallback className="text-[10px] lgtext-xs bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-800">
                      {company.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-left text-xs lg:text-sm opacity-90">
                    {company.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 -z-10">
          <AspectRatio ratio={18 / 9}>
            <img
              src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
              alt=""
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white to-white/70 dark:from-slate-950 dark:to-slate-950/70" />
          </AspectRatio>
        </div>
      </div>

      <div className="max-w-[75%] mx-auto ">
        <CardCarousel
          title="Recommendations"
          render={recommendations?.map((movie) => (
            <CarouselItem key={movie.id} className="basis-1/6">
              <DiscoverMovieCard movie={movie} />
            </CarouselItem>
          ))}
        />
      </div>
    </div>
  );
}

export default Movie;
