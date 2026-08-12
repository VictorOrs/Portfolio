const CDN = "https://cdn.sanity.io";
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

/**
 * Serves a Sanity asset from our own origin.
 *
 * CSS `mask-image` is fetched in CORS mode — the browser attaches an `Origin`
 * header even same-origin — and Sanity's CDN answers 403 to any request that
 * carries one. A `rewrite` forwards the header and fails the same way, so the
 * fetch has to happen server-side, where no `Origin` is sent.
 *
 * Only this project's images are proxied; anything else is a 404.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = new URL(`${CDN}/${path.join("/")}`);

  if (target.origin !== CDN || !target.pathname.startsWith(`/images/${PROJECT_ID}/`)) {
    return new Response(null, { status: 404 });
  }

  const upstream = await fetch(target, { next: { revalidate: 31536000 } });
  if (!upstream.ok) return new Response(null, { status: upstream.status });

  return new Response(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/octet-stream",
      // Sanity asset urls are content-hashed, so they never change in place.
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
