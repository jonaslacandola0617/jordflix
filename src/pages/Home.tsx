import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TopCarousel from "@/features/home/TopCarousel";
import useLatest from "@/features/home/useLatest";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";

function Home() {
  const { data: latest } = useLatest();

  return (
    <>
      <TopCarousel />
      <div className="xl:m-auto xl:max-w-[75%] py-4">
        <Carousel opts={{ slidesToScroll: 2 }}>
          <CarouselContent>
            {latest?.map((movie) => (
              <CarouselItem className="basis-1/6">
                <Card className="min-h-96 p-0 gap-0 overflow-hidden">
                  <CardHeader className="p-0">
                    <AspectRatio ratio={9 / 12}>
                      <img
                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </CardHeader>
                  <CardContent className="px-4 py-2">
                    <p className="text-sm line-clamp-1">{movie.title}</p>
                  </CardContent>
                  <CardFooter className="px-4">
                    <p className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <span>
                        {Number(movie.vote_average).toPrecision(2)}/10
                      </span>
                      {movie.vote_average >= 5.5 ? (
                        <ArrowBigUpDash size={22} />
                      ) : (
                        <ArrowBigDownDash size={22} />
                      )}
                    </p>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious size="lg" variant="default" />
          <CarouselNext size="lg" variant="default" />
        </Carousel>
      </div>
    </>
  );
}

export default Home;
