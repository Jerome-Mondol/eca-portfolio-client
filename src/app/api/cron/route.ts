/**
 * Cron ping for the frontend — point an external scheduler at
 * `https://<your-domain>/api/cron` to keep the deploy awake.
 *
 * The API has the same endpoint at `/api/cron`; schedule both, because they
 * can be idle independently.
 *
 * Answers 200 with the body `ok` and does no work: no auth, no database, no
 * upstream fetch. `force-dynamic` matters here — without it the route is
 * evaluated once at build time and the scheduler gets a frozen response, so a
 * dead deploy keeps returning 200.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return new Response("ok", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/** Some schedulers probe with HEAD before enabling an alert. */
export function HEAD() {
  return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
}
