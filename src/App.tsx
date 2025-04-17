import { BrowserRouter, Routes, Route } from "react-router";

import Home from "@/pages/Home";
import Movies from "@/pages/Movies";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "./components/ui/app-layout";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="movies" element={<Movies />} />
            <Route path="movies/:id" element={<Movies />} />
            <Route path="series" element />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
