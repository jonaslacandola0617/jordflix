import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useTopRated from "@/features/home/useTopRated";
import { useNavigate } from "react-router";

function TopCarousel() {
  const { data: topRated } = useTopRated();
  const navigate = useNavigate();

  function watchNow(id: number) {
    navigate(`/movies/${id}`);
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {topRated?.map((movie) => (
          <CarouselItem>
            <AspectRatio ratio={16 / 6}>
              <div className="relative w-full h-full">
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={`${movie.title} - ${movie.overview}`}
                  className="absolute object-cover w-full h-full -z-10"
                />
                <div className="absolute w-full h-full bg-gradient-to-t from-slate-950 to-80%"></div>
                <div className="w-full h-full flex flex-row justify-center items-center p-8 gap-8 backdrop-blur-xs">
                  <div className="w-1/8">
                    <AspectRatio ratio={9 / 14} className="drop-shadow-lg">
                      <img
                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                        alt=""
                        className="absolute object-cover w-full h-full rounded-md"
                      />
                    </AspectRatio>
                  </div>
                  <div className="w-1/4 flex flex-col gap-4">
                    <p className="text-lg text-slate-50">{movie.title}</p>
                    <p className="text-sm text-left text-slate-50">
                      {movie.overview}
                    </p>
                    <Button
                      onClick={() => watchNow(movie.id)}
                      className="animate-pulse"
                    >
                      Watch Now
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

export default TopCarousel;
