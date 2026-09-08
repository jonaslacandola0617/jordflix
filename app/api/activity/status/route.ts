import { activityHealth } from "@/lib/activity";

export async function GET() {
  const status = await activityHealth();
  return Response.json(status, {
    status: status.reachable ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
