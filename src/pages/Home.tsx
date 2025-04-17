import TopRatingCarousel from "@/features/home/TopRatingCarousel";
import TrendingMovies from "@/features/home/TrendingMovies";
import LatestMovies from "@/features/home/TrendingMovies";

function Home() {
  return (
    <>
      <TopRatingCarousel />
      <div className="xl:m-auto xl:max-w-[75%] py-4">
        <LatestMovies />
        <TrendingMovies />
      </div>
    </>
  );
}

export default Home;
