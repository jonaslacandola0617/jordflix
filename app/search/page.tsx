import type { Metadata } from "next";
import MediaCard from "@/components/MediaCard";
import Pagination from "@/components/Pagination";
import { searchMulti } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

function pageNumber(value?: string) {
  const parsed = Number.parseInt(value || "1", 10);
  return Number.isFinite(parsed) ? Math.min(500, Math.max(1, parsed)) : 1;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = "", page: rawPage } = await searchParams;
  const query = q.trim();
  const page = pageNumber(rawPage);
  const data = query ? await searchMulti(query, page) : null;

  return (
    <div className="page-shell">
      <header className="page-hero"><span className="eyebrow">Search Jordflix</span><h1 className="page-title">Find it.</h1><p className="page-intro">Search movies and series, then check where each title is currently available in your region.</p></header>
      <form className="search-form" action="/search"><input autoFocus name="q" defaultValue={q} placeholder="Movie or series" aria-label="Search movies and TV series"/><button aria-label="Submit search">→</button></form>
      {data?.results.length ? <><section className="catalog">{data.results.map(item => <MediaCard key={`${item.media_type}-${item.id}`} item={item} type={(item.media_type || "movie") as "movie" | "tv"}/>)}</section><Pagination page={page} totalPages={data.total_pages} basePath="/search" query={{ q: query }} /></> : query ? <p className="empty">Nothing matched “{query}”. Try another title.</p> : <p className="empty">Search movies and series across TMDB.</p>}
    </div>
  );
}
