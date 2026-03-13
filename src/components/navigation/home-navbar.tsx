"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Logo } from "~/components/brand/logo";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { authClient } from "~/lib/auth-client";

type HomeNavbarProps = {
  isAuthenticated?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

function getInitials(name?: string | null, email?: string | null) {
  if (name?.trim()) {
    const parts = name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2);

    if (parts.length > 0) {
      return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
    }
  }

  return (email?.[0] ?? "U").toUpperCase();
}

export function HomeNavbar({ isAuthenticated, user }: HomeNavbarProps) {
  const [isAuthed, setIsAuthed] = useState(Boolean(isAuthenticated));
  const [currentUser, setCurrentUser] = useState<HomeNavbarProps["user"]>(user);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const session = await authClient.getSession();
        if (!active) {
          return;
        }

        const nextUser = session?.data?.user;
        setIsAuthed(Boolean(nextUser));
        setCurrentUser(
          nextUser
            ? {
                name: nextUser.name,
                email: nextUser.email,
                image: nextUser.image,
              }
            : undefined,
        );
      } catch {
        if (!active) {
          return;
        }
        setIsAuthed(false);
        setCurrentUser(undefined);
      }
    };

    void loadSession();

    return () => {
      active = false;
    };
  }, []);

  const logoHref = isAuthed ? "/dashboard" : "/";
  const initials = getInitials(currentUser?.name, currentUser?.email);

  return (
    <nav
      data-gsap="nav"
      className="sticky top-0 z-50 border-b border-slate-200/55 bg-white/85 backdrop-blur-xl supports-backdrop-filter:bg-white/75"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo href={logoHref} size="sm" />

          <div className="hidden items-center space-x-8 md:flex" data-gsap="intro">
            <Link
              href="#features"
              className="text-slate-700 transition-colors hover:text-cyan-700"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-slate-700 transition-colors hover:text-cyan-700"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-slate-700 transition-colors hover:text-cyan-700"
            >
              Reviews
            </Link>
          </div>

          {isAuthed ? (
            <div className="flex items-center gap-2 sm:gap-3" data-gsap="intro">
              <Button asChild size="sm" className="cursor-pointer gap-2 px-3 sm:px-4">
                <Link href="/dashboard">
                  <span className="hidden sm:inline">Go to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <details className="group relative">
                <summary className="list-none">
                  <span className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600">
                    {currentUser?.image ? (
                      <Image
                        src={currentUser.image}
                        alt={currentUser.name ?? "User avatar"}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </span>
                </summary>

                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-2 py-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {currentUser?.name ?? "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">{currentUser?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="block rounded-md px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block rounded-md px-2 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      Profile Settings
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <SignOutButton variant="menu-item" />
                  </div>
                </div>
              </details>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3" data-gsap="intro">
              <Button asChild variant="ghost" size="sm" className="hidden cursor-pointer sm:inline-flex">
                <Link href="/auth/sign-in">
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm" className="cursor-pointer gap-2 px-3 sm:px-4">
                <Link href="/auth/sign-up">
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
