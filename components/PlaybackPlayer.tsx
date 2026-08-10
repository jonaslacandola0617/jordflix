import Image from "next/image";

type Props = {
  title: string;
  source: string | null;
  trailerKey?: string;
  poster?: string | null;
};

export default function PlaybackPlayer({ title, source, trailerKey, poster }: Props) {
  const isHls = source ? /\.m3u8(?:$|\?)/i.test(source) : false;

  return (
    <section className="playback-section" id="watch" aria-labelledby="watch-heading">
      <div className="playback-heading">
        <div>
          <span className="eyebrow">Jordflix player</span>
          <h2 className="subhead" id="watch-heading">Watch {title}</h2>
        </div>
        <span className={`playback-status ${source ? "ready" : "trailer-only"}`}>
          {source ? "Playback source ready" : trailerKey ? "Trailer mode" : "No source configured"}
        </span>
      </div>

      <div className="player-shell">
        {source ? (
          <video
            className="video-player"
            controls
            playsInline
            preload="metadata"
            poster={poster || undefined}
          >
            <source src={source} type={isHls ? "application/vnd.apple.mpegurl" : undefined} />
            Your browser could not play this video source.
          </video>
        ) : trailerKey ? (
          <iframe
            className="video-player trailer-player"
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?rel=0`}
            title={`${title} official trailer`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : poster ? (
          <div className="player-placeholder">
            <Image src={poster} alt="" fill sizes="(max-width: 900px) 100vw, 70vw" />
            <div className="player-placeholder-scrim" />
            <div className="player-placeholder-copy">
              <strong>Player ready for your media.</strong>
              <span>Configure an authorized MP4 or browser-compatible HLS source to start playback here.</span>
            </div>
          </div>
        ) : (
          <div className="player-placeholder plain">
            <div className="player-placeholder-copy">
              <strong>Player ready for your media.</strong>
              <span>Configure an authorized playback source for this title.</span>
            </div>
          </div>
        )}
      </div>

      {source && isHls && (
        <p className="player-note">HLS playback depends on browser support. MP4 works most consistently across desktop and mobile browsers.</p>
      )}
      {!source && trailerKey && (
        <p className="player-note">Showing the official trailer because no self-hosted playback source is configured for this title.</p>
      )}
    </section>
  );
}
