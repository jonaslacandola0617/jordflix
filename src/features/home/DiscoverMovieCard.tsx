import { IDiscoverMovie } from "@/lib/types";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";
import { useNavigate } from "react-router";

type DiscoverMovieCardProp = {
  movie: IDiscoverMovie;
};

function DiscoverMovieCard({ movie }: DiscoverMovieCardProp) {
  const navigate = useNavigate();

  function watch() {
    navigate(`/movies/watch/${movie.id}`);
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <Card
          className="min-h-96 p-0 gap-0 overflow-hidden hover:cursor-pointer"
          onClick={() => watch()}
        >
          <CardHeader className="p-0">
            <AspectRatio ratio={9 / 12}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt=""
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          </CardHeader>
          <TooltipTrigger>
            <CardContent className="px-4 py-2">
              <p className="text-left text-sm line-clamp-1">{movie.title}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between px-4">
              <p className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <span>{Number(movie.vote_average).toPrecision(2)}/10</span>
                {movie.vote_average >= 5.5 ? (
                  <ArrowBigUpDash size={22} />
                ) : (
                  <ArrowBigDownDash size={22} />
                )}
              </p>
            </CardFooter>
          </TooltipTrigger>
        </Card>
        <TooltipContent className="w-64 max-w-full p-2 ">
          <p className="text-xs text-center mb-4">{movie.overview}</p>
          <p className="text-xs text-center">
            Released on {new Date(movie.release_date).toDateString()}, gaining{" "}
            {Number(movie.popularity).toFixed()} views on TMDB
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default DiscoverMovieCard;
