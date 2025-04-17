import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Navbar from "@/components/ui/Navbar";
import useLatest from "@/features/home/useLatest";

function Home() {
  const { data: latest } = useLatest();

  return (
    <div>
      <Navbar />
      <Carousel>
        <CarouselContent>
          {latest?.map((movie) => (
            <CarouselItem>
              <AspectRatio ratio={16 / 9}>
                <img
                  src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  className="object-contain"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default Home;
