import useTrending from "@/features/home/useTrending";
import DiscoverMovieCard from "@/features/home/DiscoverMovieCard";

function TrendingMovies() {
  const { data: trending } = useTrending();

  return (
    <>
      <h1 className="text-lg xl:text-xl p-4">Trending Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
        {trending?.map((movie) => {
          const maximum = new Date().toISOString().split("T")[0];

          if (new Date(movie.release_date) < new Date(maximum))
            return <DiscoverMovieCard key={movie.id} movie={movie} />;
          else return;
        })}
      </div>
    </>
  );
}

export default TrendingMovies;
