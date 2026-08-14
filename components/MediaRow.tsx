import Link from "next/link";
import type { MediaItem, MediaType } from "@/lib/types";
import MediaCard from "@/components/MediaCard";
import MediaRail from "@/components/MediaRail";

export default function MediaRow({ eyebrow, title, items, type, href }: { eyebrow?: string; title: string; items: MediaItem[]; type: MediaType; href?: string }) {
  if (!items.length) return null;
  return (
    <section className="media-section">
      <div className="section-head"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{href && <Link href={href}>Explore all <span>↗</span></Link>}</div>
      <MediaRail label={title}>
        {items.map((item) => <MediaCard key={`${item.media_type || type}-${item.id}`} item={item} type={type} />)}
      </MediaRail>
    </section>
  );
}
