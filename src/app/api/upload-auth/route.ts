import { getUploadAuthParams } from "@imagekit/next/server";

import { env } from "~/env";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !env.IMAGEKIT_PRIVATE_KEY ||
      !env.IMAGEKIT_PUBLIC_KEY ||
      !env.IMAGEKIT_URL_ENDPOINT
    ) {
      return Response.json(
        {
          error:
            "Image uploads are not configured. Set IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, and IMAGEKIT_URL_ENDPOINT.",
        },
        { status: 503 },
      );
    }

    const { token, expire, signature } = getUploadAuthParams({
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      // expire: 30 * 60, // Optional: 30 minutes expiry (default is 1 hour)
    });

    return Response.json({
      token,
      expire,
      signature,
      publicKey: env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (error) {
    console.error("Upload auth error:", error);
    return Response.json(
      { error: "Failed to generate upload credentials" },
      { status: 500 },
    );
  }
}