import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import EpisodePicker from "@/components/EpisodePicker";
import MediaRow from "@/components/MediaRow";
import PlaybackPlayer from "@/components/PlaybackPlayer";
import WatchProviders from "@/components/WatchProviders";
import { playbackEmbedSources, playbackUrl } from "@/lib/playback";
import { dateOf, defaultRegion, details, image, seasonDetails, titleOf, watchProviders, yearOf } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";

function isType(value: string): value is MediaType { return value === "movie" || value === "tv"; }
function trailerKey(videos: Awaited<ReturnType<typeof details>>["videos"]) { const all = videos?.results || []; return all.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official)?.key || all.find(v => v.site === "YouTube" && v.type === "Trailer")?.key || all.find(v => v.site === "YouTube")?.key; }
function positiveInt(value: string | undefined, fallback = 1) { const parsed = Number.parseInt(value || "", 10); return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback; }

export async function generateMetadata({ params }: { params: Promise<{ type: string; id: string }> }): Promise<Metadata> {
  const { type, id } = await params;
  if (!isType(type)) return {};
  try {
    const item = await details(type, id);
    const title = titleOf(item);
    const description = item.overview?.slice(0, 155) || `See details and regional streaming availability for ${title}.`;
    return {
      title,
      description,
      alternates: { canonical: `/title/${type}/${id}` },
      openGraph: { title, description, images: item.backdrop_path ? [image(item.backdrop_path, "original")] : [] },
      twitter: { card: "summary_large_image", title, description, images: item.backdrop_path ? [image(item.backdrop_path, "original")] : [] },
    };
  } catch { return {}; }
}

export default async function TitlePage({ params, searchParams }: { params: Promise<{ type: string; id: string }>; searchParams: Promise<{ season?: string; episode?: string }> }) {
  const { type, id } = await params;
  const query = await searchParams;
  if (!isType(type)) notFound();
  let item;
  try { item = await details(type, id); } catch { notFound(); }

  const providers = await watchProviders(type, id);
  const title = titleOf(item);
  const trailer = trailerKey(item.videos);

  const requestedSeason = positiveInt(query.season);
  const maxSeason = Math.max(1, item.number_of_seasons || 1);
  const selectedSeason = type === "tv" ? Math.min(requestedSeason, maxSeason) : 1;
  let seasonData = null;
  if (type === "tv") {
    try { seasonData = await seasonDetails(id, selectedSeason); } catch { seasonData = null; }
  }
  const maxEpisode = type === "tv" && seasonData?.episodes?.length
    ? Math.max(1, ...seasonData.episodes.map(episode => episode.episode_number))
    : 1;
  const selectedEpisode = type === "tv" ? Math.min(positiveInt(query.episode), maxEpisode) : 1;
  const episodeData = type === "tv" ? seasonData?.episodes?.find(episode => episode.episode_number === selectedEpisode) : undefined;

  const embedSources = playbackEmbedSources(type, id, selectedSeason, selectedEpisode);
  const hasEmbedSource = embedSources.some(source => source.configured && source.url);
  const source = playbackUrl(type, id);
  const playerPoster = episodeData?.still_path
    ? image(episodeData.still_path, "w780")
    : item.backdrop_path
      ? image(item.backdrop_path, "original")
      : item.poster_path
        ? image(item.poster_path, "w780")
        : null;
  const cast = item.credits?.cast?.slice(0, 8) || [];
  const facts = [
    type === "movie" && item.runtime ? `${item.runtime} min` : null,
    type === "tv" && item.number_of_seasons ? `${item.number_of_seasons} ${item.number_of_seasons === 1 ? "season" : "seasons"}` : null,
    type === "tv" && item.number_of_episodes ? `${item.number_of_episodes} episodes` : null,
    item.status || null,
  ].filter(Boolean) as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type === "movie" ? "Movie" : "TVSeries",
    name: title,
    description: item.overview,
    dateCreated: dateOf(item),
    image: item.poster_path ? image(item.poster_path, "w780") : undefined,
    aggregateRating: item.vote_count > 0 ? { "@type": "AggregateRating", ratingValue: item.vote_average, bestRating: 10, ratingCount: item.vote_count } : undefined,
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
    <BackButton fallback={type === "movie" ? "/movies" : "/series"} />
    <section className="detail-hero">
      {item.backdrop_path && <Image className="detail-backdrop" src={image(item.backdrop_path, "original")} alt="" fill priority sizes="100vw"/>}
      <div className="detail-scrim"/>
      <div className="detail-copy">
        <span className="eyebrow">{type === "movie" ? "Film" : "Series"} · {yearOf(item)}</span>
        <h1>{title}</h1>
        <div className="hero-meta"><span>★ {item.vote_average.toFixed(1)}</span>{item.genres?.slice(0, 3).map(g => <span key={g.id}>{g.name}</span>)}</div>
        {facts.length > 0 && <div className="detail-facts">{facts.map(fact => <span key={fact}>{fact}</span>)}</div>}
        <p>{item.overview}</p>
        {item.tagline && <p className="tagline"><em>“{item.tagline}”</em></p>}
        <div className="detail-actions"><a className="button primary" href="#watch">▶ Watch now</a></div>
      </div>
    </section>

    <div className="detail-grid">
      <div>
        {type === "tv" && <EpisodePicker id={id} season={selectedSeason} episode={selectedEpisode} maxSeason={maxSeason} maxEpisode={maxEpisode} episodeTitle={episodeData?.name} />}
        <PlaybackPlayer title={type === "tv" ? `${title} · S${selectedSeason}E${selectedEpisode}` : title} embedSources={embedSources} source={source} trailerKey={trailer} poster={playerPoster} />
        {(hasEmbedSource || source) && trailer ? <section className="trailer-section"><h2 className="subhead">Official trailer</h2><div className="trailer"><iframe src={`https://www.youtube-nocookie.com/embed/${trailer}`} title={`${title} official trailer`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy"/></div></section> : null}
        {!hasEmbedSource && !source && !trailer ? <div className="trailer-empty"><span className="eyebrow">Trailer</span><h2 className="subhead">No official trailer listed</h2></div> : null}
        {cast.length > 0 && <><h2 className="cast-heading">Top cast</h2><div className="cast-list">{cast.map(person => <span key={person.id}>{person.name}{person.character ? ` · ${person.character}` : ""}</span>)}</div></>}
      </div>
      <WatchProviders data={providers} region={defaultRegion}/>
    </div>
    {item.recommendations?.results?.length ? <div className="home-shell"><MediaRow eyebrow="If you liked this" title="Keep watching" items={item.recommendations.results} type={type}/></div> : null}
  </>;
}
