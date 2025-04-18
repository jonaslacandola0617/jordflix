import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import useTopRated from "@/features/home/useTopRated";
import { ArrowBigUpDash } from "lucide-react";
import { useNavigate } from "react-router";

function TopRatingCarousel() {
  const { isLoading, data: topRated } = useTopRated();
  const navigate = useNavigate();

  function watchNow(id: number) {
    navigate(`/movies/watch/${id}`);
  }

  if (isLoading)
    return (
      <div className="w-full">
        <Skeleton className="w-full h-[720px]" />
      </div>
    );

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {topRated?.map((movie) => (
          <CarouselItem key={movie.id} className="px-0">
            <AspectRatio ratio={16 / 6}>
              <div className="relative w-full h-full">
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={`${movie.title} - ${movie.overview}`}
                  className="absolute object-cover w-full h-full -z-10"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-white dark:from-slate-950 to-80%"></div>
                <div className="w-full h-full flex flex-row justify-center items-center p-8 gap-8 backdrop-blur-xs">
                  <div className="w-1/8">
                    <AspectRatio ratio={9 / 14} className="drop-shadow-lg">
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        alt=""
                        className="absolute object-cover w-full h-full rounded-md"
                      />
                    </AspectRatio>
                  </div>
                  <div className="w-1/4 flex flex-col gap-3">
                    <p className="text-lg">{movie.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">
                        {new Date(movie.release_date)
                          .toDateString()
                          .replace(/^[A-Za-z]{3}/, "")}
                      </p>
                      <span>/</span>
                      <p className="text-sm flex gap-0.5 items-center">
                        <span>
                          {Number(movie.vote_average).toPrecision(2)}/10
                        </span>
                        <ArrowBigUpDash />
                      </p>
                    </div>
                    <p className="text-sm text-left mb-2">{movie.overview}</p>
                    <Button
                      onClick={() => watchNow(movie.id)}
                      className="animate-pulse hover:cursor-pointer"
                    >
                      <span>Watch Now</span>
                    </Button>
                  </div>
                </div>
              </div>
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default TopRatingCarousel;
