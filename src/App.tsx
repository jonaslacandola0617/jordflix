import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Movies from "./pages/Movies";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route path="series" element />
      </Routes>
    </BrowserRouter>
  );
}
