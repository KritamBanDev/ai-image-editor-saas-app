"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import {
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Users,
  Calendar,
  TrendingUp,
  Camera,
  Star,
  ArrowRight,
  Plus,
  Trash2,
} from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";
import { deleteProject, getUserProjects } from "~/actions/projects";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { Image as ImageKitImage } from "@imagekit/next";
import { env } from "~/env";
import { toast } from "sonner";
import { ConfirmModal } from "~/components/ui/confirm-modal";

interface Project {
  id: string;
  name: string | null;
  imageUrl: string;
  imageKitId: string;
  filePath: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserStats {
  totalProjects: number;
  thisMonth: number;
  thisWeek: number;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalProjects: 0,
    thisMonth: 0,
    thisWeek: 0,
  });
  const [user, setUser] = useState<{ name?: string; createdAt?: string | Date } | null>(null);
  const router = useRouter();

  const buildStats = (projects: Project[]): UserStats => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalProjects: projects.length,
      thisMonth: projects.filter((project) => new Date(project.createdAt) >= thisMonth)
        .length,
      thisWeek: projects.filter((project) => new Date(project.createdAt) >= thisWeek)
        .length,
    };
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setUser(session.data.user);
        }

        // Fetch user projects
        const projectsResult = await getUserProjects();
        if (projectsResult.success && projectsResult.projects) {
          const projects = projectsResult.projects;
          setUserProjects(projects);
          setUserStats(buildStats(projects));
        }
      } catch (error) {
        console.error("Dashboard initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeDashboard();
  }, []);

  const requestDeleteProject = (project: Project) => {
    setProjectToDelete(project);
  };

  const cancelDelete = () => {
    if (isDeleting) {
      return;
    }

    setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!projectToDelete || isDeleting) {
      return;
    }

    const target = projectToDelete;
    setIsDeleting(true);
    setProjectToDelete(null);

    const previousProjects = userProjects;
    const nextProjects = previousProjects.filter((project) => project.id !== target.id);

    setUserProjects(nextProjects);
    setUserStats(buildStats(nextProjects));

    const result = await deleteProject(target.id);

    if (!result.success) {
      setUserProjects(previousProjects);
      setUserStats(buildStats(previousProjects));
      toast.error(result.error ?? "Failed to delete project");
      setIsDeleting(false);
      return;
    }

    toast.success("Project deleted successfully");
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-6" data-page-shell>
          <section className="pro-page-hero" data-gsap="intro">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="pro-section-label">Overview</p>
                <h1 className="pro-page-title">
                  Welcome back{user?.name ? `, ${user.name}` : ""}.
                </h1>
                <p className="pro-page-copy">
                  Track activity, jump into active work, and keep your image pipeline moving without leaving the dashboard.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px] lg:max-w-[420px]">
                <div className="pro-stat-tile">
                  <p className="pro-stat-label">Projects</p>
                  <p className="pro-stat-value mt-1">{userStats.totalProjects}</p>
                </div>
                <div className="pro-stat-tile">
                  <p className="pro-stat-label">This month</p>
                  <p className="pro-stat-value mt-1">{userStats.thisMonth}</p>
                </div>
                <div className="pro-stat-tile">
                  <p className="pro-stat-label">This week</p>
                  <p className="pro-stat-value mt-1">{userStats.thisWeek}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden pro-panel shadow-sm" data-gsap="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <ImageIcon className="text-primary h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-primary text-2xl font-bold">
                  {userStats.totalProjects}
                </div>
                <p className="text-muted-foreground text-xs">
                  All your creations
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden pro-panel shadow-sm" data-gsap="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {userStats.thisMonth}
                </div>
                <p className="text-muted-foreground text-xs">
                  Projects created
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden pro-panel shadow-sm" data-gsap="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {userStats.thisWeek}
                </div>
                <p className="text-muted-foreground text-xs">Recent activity</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden pro-panel shadow-sm" data-gsap="card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Member Since
                </CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {user?.createdAt
                    ? new Date(user.createdAt as string | number | Date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </div>
                <p className="text-muted-foreground text-xs">Account created</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="pro-surface overflow-hidden" data-gsap="card">
            <CardHeader>
              <div className="space-y-1">
                <p className="pro-section-label">Actions</p>
                <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary h-5 w-5" />
                Quick Actions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Button
                  onClick={() => router.push("/dashboard/create")}
                  className="group h-auto flex-col gap-2 bg-linear-to-br from-sky-500 to-cyan-600 p-6 hover:from-sky-600 hover:to-cyan-700"
                >
                  <Camera className="h-8 w-8 transition-transform group-hover:scale-110" />
                  <div className="text-center">
                    <div className="font-semibold">Create New Project</div>
                    <div className="text-xs opacity-80">
                      Upload and edit images with AI
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/dashboard/projects")}
                  variant="outline"
                  className="group h-auto flex-col gap-2 border-slate-200 bg-white/70 p-6 hover:bg-slate-50"
                >
                  <ImageIcon className="h-8 w-8 transition-transform group-hover:scale-110" />
                  <div className="text-center">
                    <div className="font-semibold">View All Projects</div>
                    <div className="text-xs opacity-70">
                      Browse your image library
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => router.push("/dashboard/settings")}
                  variant="outline"
                  className="group h-auto flex-col gap-2 border-slate-200 bg-white/70 p-6 hover:bg-slate-50"
                >
                  <Users className="h-8 w-8 transition-transform group-hover:scale-110" />
                  <div className="text-center">
                    <div className="font-semibold">Account Settings</div>
                    <div className="text-xs opacity-70">
                      Manage your profile
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card className="pro-surface overflow-hidden" data-gsap="card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <p className="pro-section-label">Library</p>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="text-primary h-5 w-5" />
                  Recent Projects
                </CardTitle>
              </div>
              {userProjects.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/projects")}
                  className="text-primary hover:text-primary/80"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {userProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative mb-4">
                    <div className="border-muted bg-muted/20 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed">
                      <ImageIcon className="text-muted-foreground h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    No projects yet
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Start creating amazing images with AI tools
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard/create")}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Project
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {userProjects.slice(0, 8).map((project) => (
                    <div
                      key={project.id}
                      className="group relative cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md"
                      onClick={() => router.push("/dashboard/create")}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 h-7 w-7 p-0 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          requestDeleteProject(project);
                        }}
                        aria-label="Delete project"
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>

                      <div className="aspect-square overflow-hidden">
                        <ImageKitImage
                          urlEndpoint={env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                          src={project.filePath}
                          alt={project.name ?? "Project"}
                          width={200}
                          height={200}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          transformation={[
                            {
                              width: 200,
                              height: 200,
                              crop: "maintain_ratio",
                              quality: 85,
                            },
                          ]}
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="truncate text-sm font-medium">
                          {project.name ?? "Untitled Project"}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <ConfirmModal
            open={Boolean(projectToDelete)}
            title="Are you sure?"
            description={`This will permanently delete ${projectToDelete?.name ?? "this project"}. This action cannot be undone.`}
            confirmText="Delete Project"
            isProcessing={isDeleting}
            onCancel={cancelDelete}
            onConfirm={() => {
              void confirmDelete();
            }}
          />
        </div>
      </SignedIn>
    </>
  );
}