import Image from "next/image";
import Link from "next/link";
import type { MediaItem, MediaType } from "@/lib/types";
import { dateOf, image, titleOf, yearOf } from "@/lib/tmdb";

export default function MediaCard({ item, type }: { item: MediaItem; type: MediaType }) {
  const resolvedType = item.media_type === "tv" || item.media_type === "movie" ? item.media_type : type;
  const title = titleOf(item);
  return (
    <Link className="media-card" href={`/title/${resolvedType}/${item.id}`} aria-label={`${title}, ${yearOf(item)}`}>
      <div className="poster-wrap">
        {item.poster_path ? <Image src={image(item.poster_path, "w500")} alt={`${title} poster`} fill sizes="(max-width: 640px) 42vw, (max-width: 1100px) 22vw, 15vw" /> : <div className="poster-fallback">J</div>}
        <div className="card-overlay"><span className="play-chip">▶</span><span>View title</span></div>
      </div>
      <div className="card-copy">
        <h3>{title}</h3>
        <div><span>{dateOf(item) ? yearOf(item) : "Coming soon"}</span><span className="rating">★ {item.vote_average ? item.vote_average.toFixed(1) : "NR"}</span></div>
      </div>
    </Link>
  );
}
