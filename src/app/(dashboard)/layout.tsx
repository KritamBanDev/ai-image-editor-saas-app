import type { Metadata } from "next";
import type { ReactNode } from "react";

import Link from "next/link";
import { Home } from "lucide-react";
import { Providers } from "~/components/providers";
import BreadcrumbPageClient from "~/components/sidebar/breadcrumb-page-client";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your projects and AI image editing workflows in Lumen Studio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Providers>
      <SidebarProvider>
        <div data-page-shell className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="relative overflow-hidden bg-linear-to-br from-white/72 via-cyan-50/35 to-amber-50/18">
            <div className="pointer-events-none absolute inset-0 pro-muted-grid opacity-40" />
            <div className="pointer-events-none absolute -top-20 -right-16 h-60 w-60 rounded-full bg-cyan-300/25 blur-3xl" data-gsap="float" />
            <div className="pointer-events-none absolute bottom-10 -left-20 h-60 w-60 rounded-full bg-amber-300/20 blur-3xl" data-gsap="float" />
            <header className="sticky top-0 z-20 border-b border-white/60 bg-white/65 px-3 py-3 backdrop-blur-xl md:px-4" data-gsap="nav">
              <div className="pro-surface flex min-h-14 items-center gap-2 px-3 py-2 shadow-sm">
                <SidebarTrigger className="h-8 w-8" />
                <div className="min-w-0 flex-1">
                  <BreadcrumbPageClient />
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 active:scale-[0.98] cursor-pointer"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </div>
            </header>
            <main className="relative p-4 md:p-6" data-gsap="intro">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
