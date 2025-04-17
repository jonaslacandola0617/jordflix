import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MovieHomeCard from "@/features/home/MovieHomeCard";
import useLatest from "@/features/home/useLatest";

function LatestMovies() {
  const { data: latest } = useLatest();

  return (
    <>
      <h1 className="text-xl p-4">Latest Movies</h1>
      <Carousel opts={{ slidesToScroll: 2 }}>
        <CarouselContent>
          {latest?.map((movie) => (
            <CarouselItem className="basis-1/6">
              <MovieHomeCard movie={movie} />
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
