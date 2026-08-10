export type MediaType = "movie" | "tv";

export interface Genre { id: number; name: string }
export interface Provider { provider_id: number; provider_name: string; logo_path: string; display_priority: number }

export interface MediaItem {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
}

export interface MediaDetails extends MediaItem {
  genres: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  tagline?: string;
  status?: string;
  videos?: { results: { id: string; key: string; name: string; site: string; type: string; official: boolean }[] };
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] };
  recommendations?: { results: MediaItem[] };
}

export interface ProviderRegion {
  link?: string;
  flatrate?: Provider[];
  free?: Provider[];
  ads?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}
