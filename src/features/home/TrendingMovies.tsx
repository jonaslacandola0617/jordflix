import useTrending from "@/features/home/useTrending";
import MovieHomeCard from "@/features/home/MovieHomeCard";

function TrendingMovies() {
  const { data: trending } = useTrending();

  return (
    <>
      <h1 className="text-xl p-4">Trending Movies</h1>
      <div className="grid grid-cols-6 gap-4">
        {trending?.map((movie) => {
          const maximum = new Date().toISOString().split("T")[0];

          if (new Date(movie.release_date) < new Date(maximum))
            return <MovieHomeCard movie={movie} />;
          else return;
        })}
      </div>
    </>
  );
}

export default TrendingMovies;
