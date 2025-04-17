import TopRatingCarousel from "@/features/home/TopRatingCarousel";
import TrendingMovies from "@/features/home/TrendingMovies";
import LatestMovies from "@/features/home/LatestMovies";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function Home() {
  return (
    <>
      <TopRatingCarousel />
      <div className="xl:m-auto xl:max-w-[75%] py-4">
        <div className="w-1/2 m-auto flex items-center gap-4">
          <Search size={42} />
          <Input
            type="text"
            className="p-6"
            placeholder="Search your favorite movie or tv series"
          />
          <Button variant="default" className="p-6">
            Search Movie/Series
          </Button>
        </div>
        <LatestMovies />
        <TrendingMovies />
      </div>
    </>
  );
}

export default Home;
