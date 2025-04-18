import CardCarousel from "@/components/ui/cardcarousel";
import { CarouselItem } from "@/components/ui/carousel";
import DiscoverMovieCard from "@/features/home/DiscoverMovieCard";
import useLatest from "@/features/home/useLatest";

function LatestMovies() {
  const { data: latest } = useLatest();

  return (
    <CardCarousel
      title="Latest Movies"
      render={latest?.map((movie) => (
        <CarouselItem key={movie.id} className="basis-1/6">
          <DiscoverMovieCard movie={movie} />
        </CarouselItem>
      ))}
    />
  );
}

export default LatestMovies;
