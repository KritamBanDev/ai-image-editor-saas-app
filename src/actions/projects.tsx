"use server";

import { z } from "zod";
import { headers } from "next/headers";

import { db } from "~/server/db";
import { auth } from "~/lib/auth";

const createProjectSchema = z.object({
  imageUrl: z.string().url(),
  imageKitId: z.string().min(1),
  filePath: z.string().min(1),
  name: z.string().trim().min(1).max(120).optional(),
});

type CreateProjectData = z.infer<typeof createProjectSchema>;

const deleteProjectSchema = z.object({
  projectId: z.string().min(1),
});

async function getRequiredUserId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function createProject(data: CreateProjectData) {
  try {
    const userId = await getRequiredUserId();
    const parsed = createProjectSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false as const, error: "Invalid project data" };
    }

    const project = await db.project.create({
      data: {
        name: parsed.data.name ?? "Untitled Project",
        imageUrl: parsed.data.imageUrl,
        imageKitId: parsed.data.imageKitId,
        filePath: parsed.data.filePath,
        userId,
      },
    });

    return { success: true, project };
  } catch (error) {
    console.error("Project creation error:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function getUserProjects() {
  try {
    const userId = await getRequiredUserId();

    const projects = await db.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, projects };
  } catch (error) {
    console.error("Projects fetch error:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function deductCredits(
  creditsToDeduct: number,
  operation?: string,
) {
  try {
    // Input validation - prevent negative numbers or invalid inputs
    if (
      !creditsToDeduct ||
      creditsToDeduct <= 0 ||
      !Number.isInteger(creditsToDeduct)
    ) {
      return { success: false, error: "Invalid credit amount" };
    }

    const userId = await getRequiredUserId();

    // Atomic deduction prevents race conditions from concurrent requests.
    const updateResult = await db.user.updateMany({
      where: {
        id: userId,
        credit: { gte: creditsToDeduct },
      },
      data: {
        credit: { decrement: creditsToDeduct },
      },
    });

    if (updateResult.count === 0) {
      return { success: false, error: "Insufficient credits" };
    }

    const updatedUser = await db.user.findUnique({
      where: { id: userId },
      select: { credit: true },
    });

    return { success: true, remainingCredits: updatedUser?.credit ?? 0 };
  } catch (error) {
    console.error(
      `Credit deduction error${operation ? ` for ${operation}` : ""}:`,
      error,
    );
    return { success: false, error: "Failed to deduct credits" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const userId = await getRequiredUserId();
    const parsed = deleteProjectSchema.safeParse({ projectId });

    if (!parsed.success) {
      return { success: false as const, error: "Invalid project ID" };
    }

    const deleted = await db.project.deleteMany({
      where: {
        id: parsed.data.projectId,
        userId,
      },
    });

    if (deleted.count === 0) {
      return {
        success: false as const,
        error: "Project not found or unauthorized",
      };
    }

    return { success: true as const, projectId: parsed.data.projectId };
  } catch (error) {
    console.error("Project deletion error:", error);
    return { success: false as const, error: "Failed to delete project" };
  }
}