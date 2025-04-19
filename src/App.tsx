import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import Movie from "@/pages/Movie";
import AppLayout from "@/components/ui/app-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Search from "@/pages/Search";
import TvSeries from "@/pages/TvSeries";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="movies" element={<Movies />} />
              <Route path="movies/watch/:id" element={<Movie />} />
              <Route path="series" element={<TvSeries />} />
              <Route path="search" element={<Search />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
