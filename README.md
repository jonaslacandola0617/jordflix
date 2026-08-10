# Jordflix 2.0

Jordflix is a premium movie and TV discovery experience powered by TMDB, rebuilt from the original Vite prototype with a server-rendered Next.js foundation.

## What changed

- Complete Movies and TV Series experiences
- Responsive cinematic UI for mobile, tablet, and desktop
- Larger readability-focused typography for body copy, metadata, provider information, cards, and mobile UI
- Server-side TMDB access so credentials are not shipped to browsers
- Regional provider-aware discovery (`flatrate`, `free`, and ad-supported availability)
- Per-title provider panels with rent/buy options when available
- In-app Jordflix playback theater with self-hosted iframe embeds plus optional MP4/HLS playback
- TV season/episode selector backed by TMDB season metadata
- Official trailer fallback when no custom playback source is enabled
- Dynamic title metadata, canonical URLs, Open Graph/Twitter metadata, JSON-LD, robots.txt, and sitemap.xml

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add either a TMDB v4 Read Access Token (`TMDB_API_TOKEN`) or v3 key (`TMDB_API_KEY`). The v4 token is preferred.
3. Set `DEFAULT_REGION=PH` (or another ISO country code) for provider availability.
4. Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
5. Replace the temporary `player.sample` host in the playback embed templates when your self-hosted player is ready.
6. Run `npm install` and `npm run dev`.

> Security: the old public repository tracked a TMDB key in `.env`. Rotate that credential in TMDB before deploying Jordflix 2.0.

## Vercel deployment

Jordflix 2.0 is a Next.js application. In Vercel, use the Next.js Framework Preset (or automatic framework detection) and make the TMDB environment variables available to both Preview and Production deployments.

## Playback architecture

Jordflix supports a self-hosted embed structure similar to the original project's player workflow, but the host is completely configurable.

Movie example:

```text
https://player.sample/embed/movie/533535
```

TV example:

```text
https://player.sample/embed/tv/79744/1/1
```

Configure those patterns with:

```env
PLAYBACK_MOVIE_EMBED_TEMPLATE=https://player.sample/embed/movie/{id}
PLAYBACK_TV_EMBED_TEMPLATE=https://player.sample/embed/tv/{id}/{season}/{episode}
```

On movie pages Jordflix substitutes the TMDB ID automatically. On TV pages the season and episode selector updates the embed URL using TMDB season metadata.

A direct media route is still available if you want to host MP4/HLS files instead:

```env
PLAYBACK_URL_TEMPLATE=https://media.example.com/library/{type}/{id}/video.mp4
```

For iframe playback, the self-hosted player server must allow the Jordflix origin to embed it. If the player refuses to render in-frame, check its `Content-Security-Policy` / `frame-ancestors` and `X-Frame-Options` response headers. Jordflix also exposes an `Open player` link beneath the iframe for easier debugging.

The playback hooks are intended for media you own, host, license, or otherwise have permission to stream.

Data attribution: This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming provider availability is supplied through TMDB's JustWatch-backed watch-provider data.
