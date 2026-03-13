"use client";

import {
  RedirectToSignIn,
  SecuritySettingsCards,
  SignedIn,
} from "@daveyplate/better-auth-ui";
import { AccountSettingsCards } from "@daveyplate/better-auth-ui";
import { Loader2 } from "lucide-react";
import { authClient } from "~/lib/auth-client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkSession = async () => {
      try {
        await authClient.getSession();
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-8" data-page-shell>
          <section className="pro-page-hero" data-gsap="intro">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="pro-section-label">Preferences</p>
                <h1 className="pro-page-title">Account Settings</h1>
                <p className="pro-page-copy">
                  Manage identity, security, and account preferences inside the same polished workspace as the rest of your app.
                </p>
              </div>
              <div className="pro-stat-tile max-w-xs">
                <p className="pro-stat-label">Workspace area</p>
                <p className="pro-stat-value mt-1 text-lg">Security and profile</p>
              </div>
            </div>
          </section>

          <div className="flex flex-col items-center justify-center gap-6" data-gsap="card">
            <AccountSettingsCards className="pro-surface w-full max-w-2xl" />
            <SecuritySettingsCards className="pro-surface w-full max-w-2xl" />
          </div>
        </div>
      </SignedIn>
    </>
  );
}