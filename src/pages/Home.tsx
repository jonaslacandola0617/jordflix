import TopRatingCarousel from "@/features/home/TopRatingCarousel";
import TrendingMovies from "@/features/home/TrendingMovies";
import LatestMovies from "@/features/home/LatestMovies";
import Searchbar from "@/components/ui/searchbar";

function Home() {
  return (
    <>
      <TopRatingCarousel />
      <div className="max-w-[80%] m-auto py-4 xl:max-w-[75%]">
        <div className="w-1/2 m-auto flex items-center gap-4">
          <Searchbar />
        </div>
        <LatestMovies />
        <TrendingMovies />
      </div>
    </>
  );
}

export default Home;
