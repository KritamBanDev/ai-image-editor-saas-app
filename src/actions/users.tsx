"use server";

import { headers } from "next/headers";

import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export default async function getUserCredits(): Promise<number> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return 0;
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { credit: true },
    });

    return user?.credit ?? 0;
  } catch (error) {
    console.error("Failed to fetch user credits:", error);
    return 0;
  }
}
