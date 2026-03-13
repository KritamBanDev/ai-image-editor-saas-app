import { type NextRequest, NextResponse } from "next/server";

import { env } from "~/env";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const filename = request.nextUrl.searchParams.get("filename") ?? "download.jpg";

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // SSRF protection: only proxy requests to the configured ImageKit CDN endpoint.
  // This prevents the route from being used as an open proxy.
  const allowedBase = env.IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, "");
  if (!allowedBase || !url.startsWith(allowedBase)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { cache: "no-store" });
  } catch {
    return NextResponse.json({ error: "Failed to reach CDN" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `CDN returned ${upstream.status}` },
      { status: 502 },
    );
  }

  const contentType = upstream.headers.get("Content-Type") ?? "image/jpeg";
  const buffer = await upstream.arrayBuffer();

  // Sanitise filename to prevent header injection (allow word chars, hyphens, dots, spaces).
  const safeFilename = filename.replace(/[^\w\-. ]/g, "_");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Cache-Control": "no-cache",
    },
  });
}
