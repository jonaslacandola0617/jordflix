# Jordflix 2.0

Jordflix is a premium movie and TV discovery experience powered by TMDB, rebuilt from the original Vite prototype with a server-rendered Next.js foundation.

## What changed

- Complete Movies and TV Series experiences
- Responsive cinematic UI for mobile, tablet, and desktop
- Larger readability-focused typography for body copy, metadata, provider information, cards, and mobile UI
- Server-side TMDB access so credentials are not shipped to browsers
- Regional provider-aware discovery (`flatrate`, `free`, and ad-supported availability)
- Per-title provider panels with rent/buy options when available
- In-app Jordflix playback theater for authorized/self-hosted MP4 or browser-compatible HLS sources
- Official trailer fallback via privacy-enhanced YouTube embeds when no playback source is configured
- Dynamic title metadata, canonical URLs, Open Graph/Twitter metadata, JSON-LD, robots.txt, and sitemap.xml
- No dependency on unofficial streaming mirrors or their advertising layers

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add either a TMDB v4 Read Access Token (`TMDB_API_TOKEN`) or v3 key (`TMDB_API_KEY`). The v4 token is preferred.
3. Set `DEFAULT_REGION=PH` (or another ISO country code) for provider availability.
4. Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
5. Optionally set `PLAYBACK_URL_TEMPLATE` if you have your own authorized/self-hosted media source.
6. Run `npm install` and `npm run dev`.

> Security: the old public repository tracked a TMDB key in `.env`. Rotate that credential in TMDB before deploying Jordflix 2.0.

## Vercel deployment

Jordflix 2.0 is a Next.js application. In Vercel, use the Next.js Framework Preset (or automatic framework detection) and make the TMDB environment variables available to both Preview and Production deployments. A branch preview is the recommended place to verify the rebuild before merging it into `main`.

## Playback architecture

Each title page contains a Jordflix playback theater. If `PLAYBACK_URL_TEMPLATE` is configured, Jordflix resolves a title-specific media URL by replacing these placeholders:

- `{type}` → `movie` or `tv`
- `{id}` → the TMDB title ID
- `{tmdbId}` → the same TMDB title ID

Example:

```env
PLAYBACK_URL_TEMPLATE=https://media.example.com/library/{type}/{id}/video.mp4
```

The browser receives that resolved URL and plays it with native video controls, including fullscreen where supported. MP4 is the most broadly compatible option; browser-compatible HLS (`.m3u8`) can also be used. If no media source is configured, the player falls back to the official TMDB-listed YouTube trailer when one exists.

This playback hook is intended for media you own, host, license, or otherwise have permission to stream. Jordflix does not embed unofficial streaming mirrors.

Data attribution: This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming provider availability is supplied through TMDB's JustWatch-backed watch-provider data.
