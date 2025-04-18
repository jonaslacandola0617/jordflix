import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import Movie from "@/pages/Movie";
import AppLayout from "@/components/ui/app-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="movies" element={<Movies />} />
            <Route path="movies/watch/:id" element={<Movie />} />
            <Route path="series" element />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
