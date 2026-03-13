import { UserButton } from "@daveyplate/better-auth-ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";
import Credits from "./credits";
import SidebarMenuItems from "./sidebar-menu-items";
import { User, Settings, Home } from "lucide-react";
import Upgrade from "./upgrade";
import MobileSidebarClose from "./mobile-sidebar-close";
import { Logo } from "~/components/brand/logo";
import Link from "next/link";
import { SignOutButton } from "~/components/auth/sign-out-button";

export async function AppSidebar() {
  return (
    <Sidebar
      data-gsap="nav"
      className="border-r-0 bg-linear-to-b from-white/95 via-white/92 to-cyan-50/55 shadow-lg"
    >
      <SidebarContent className="px-3">
        <MobileSidebarClose />
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary mt-6 mb-6 flex flex-col items-start justify-start px-2">
            <Logo href="/dashboard" size="sm" className="mb-1" textClassName="text-2xl tracking-tight" />
            <span className="pro-section-label mt-2">Creative Ops</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 rounded-2xl border border-white/70 bg-white/60 p-2 shadow-sm backdrop-blur-sm" data-gsap="intro">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/70 bg-white/72 p-3 backdrop-blur-sm" data-gsap="intro">
        <div className="mb-3 flex w-full items-center justify-center gap-2 text-xs">
          <Credits />
          <Upgrade />
        </div>
        <UserButton
          variant="outline"
          className="border-muted-foreground/20 hover:border-primary/50 w-full transition-colors"
          disableDefaultLinks={true}
          additionalLinks={[
            {
              label: "Customer Portal",
              href: "/dashboard/customer-portal",
              icon: <User className="h-4 w-4" />,
            },
            {
              label: "Settings",
              href: "/dashboard/settings",
              icon: <Settings className="h-4 w-4" />,
            },
          ]}
        />
        <div className="mt-2 flex w-full gap-2">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <SignOutButton className="flex-1 justify-center" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}