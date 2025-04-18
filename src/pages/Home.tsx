import TopRatingCarousel from "@/features/home/TopRatingCarousel";
import TrendingMovies from "@/features/home/TrendingMovies";
import LatestMovies from "@/features/home/LatestMovies";
import Searchbar from "@/components/ui/searchbar";

function Home() {
  return (
    <>
      <TopRatingCarousel />
      <div className="xl:m-auto xl:max-w-[75%] py-4">
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
