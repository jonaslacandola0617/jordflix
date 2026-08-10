import Image from "next/image";
import Link from "next/link";
import type { MediaItem, MediaType } from "@/lib/types";
import { image, titleOf, yearOf } from "@/lib/tmdb";

export default function Hero({ item, type }: { item: MediaItem; type: MediaType }) {
  const title = titleOf(item);
  return (
    <section className="hero">
      {item.backdrop_path && <Image className="hero-image" src={image(item.backdrop_path, "original")} alt="" fill priority sizes="100vw" />}
      <div className="hero-scrim" />
      <div className="hero-grid" />
      <div className="hero-content">
        <span className="hero-kicker"><i /> Featured tonight</span>
        <h1>{title}</h1>
        <div className="hero-meta"><span>{yearOf(item)}</span><span>★ {item.vote_average.toFixed(1)}</span><span>{type === "movie" ? "Film" : "Series"}</span></div>
        <p>{item.overview}</p>
        <div className="hero-actions"><Link className="button primary" href={`/title/${type}/${item.id}`}>▶ View title</Link><Link className="button ghost" href={`/${type === "movie" ? "movies" : "series"}`}>Browse {type === "movie" ? "movies" : "series"} →</Link></div>
      </div>
      <div className="hero-index" aria-hidden="true">01</div>
    </section>
  );
}
