import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DiscoverMovieCard from "@/features/home/DiscoverMovieCard";
import useLatest from "@/features/home/useLatest";

function LatestMovies() {
  const { data: latest } = useLatest();

  return (
    <>
      <h1 className="text-xl p-4">Latest Movies</h1>
      <Carousel opts={{ slidesToScroll: 2 }} className="mb-4">
        <CarouselContent>
          {latest?.map((movie) => (
            <CarouselItem key={movie.id} className="basis-1/6">
              <DiscoverMovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size="lg" variant="default" />
        <CarouselNext size="lg" variant="default" />
      </Carousel>
    </>
  );
}

export default LatestMovies;
