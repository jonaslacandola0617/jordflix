import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="series" element />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
