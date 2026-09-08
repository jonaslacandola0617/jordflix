import { recommendations } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";

function validType(value: string | null): value is MediaType {
  return value === "movie" || value === "tv";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");

  if (!validType(type) || !id || !/^\d+$/.test(id)) {
    return Response.json({ results: [] }, { status: 400 });
  }

  try {
    const results = await recommendations(type, id);
    return Response.json({ results: results.slice(0, 20) }, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch {
    return Response.json({ results: [] }, { status: 200 });
  }
}
