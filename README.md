# Jordflix 2.0

Jordflix is a premium movie and TV discovery experience powered by TMDB, rebuilt from the original Vite prototype with a server-rendered Next.js foundation.

## What changed

- Complete Movies and TV Series experiences
- Responsive cinematic UI for mobile, tablet, and desktop
- Server-side TMDB access so credentials are not shipped to browsers
- Regional provider-aware discovery (`flatrate`, `free`, and ad-supported availability)
- Per-title provider panels with rent/buy options when available
- Official trailer playback via privacy-enhanced YouTube embeds
- Dynamic title metadata, canonical URLs, Open Graph/Twitter metadata, JSON-LD, robots.txt, and sitemap.xml
- No dependency on unofficial streaming mirrors or their advertising layers

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add either a TMDB v4 Read Access Token (`TMDB_API_TOKEN`) or v3 key (`TMDB_API_KEY`). The v4 token is preferred.
3. Set `DEFAULT_REGION=PH` (or another ISO country code) for provider availability.
4. Set `NEXT_PUBLIC_SITE_URL` to the final production domain.
5. Run `npm install` and `npm run dev`.

> Security: the old public repository tracked a TMDB key in `.env`. Rotate that credential in TMDB before deploying Jordflix 2.0.

## Vercel deployment

Jordflix 2.0 is a Next.js application. In Vercel, use the Next.js Framework Preset (or automatic framework detection) and make the TMDB environment variables available to both Preview and Production deployments. A branch preview is the recommended place to verify the rebuild before merging it into `main`.

## Playback architecture

Jordflix 2.0 deliberately does not embed unofficial streaming mirrors. The provider panel uses TMDB/JustWatch availability and sends viewers toward legitimate services. If you later have licensed/self-hosted playback, add a provider adapter and expose only authorized sources through the title page.

Data attribution: This product uses the TMDB API but is not endorsed or certified by TMDB. Streaming provider availability is supplied through TMDB's JustWatch-backed watch-provider data.
