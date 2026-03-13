"use client";

import { RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "~/components/ui/button";

interface PortalResponse {
  url?: string;
  error?: string;
}

export default function CustomerPortalPage() {
  const [error, setError] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(true);

  const openPortal = useCallback(async () => {
    setError(null);
    setIsOpening(true);
    try {
      const response = await fetch("/api/auth/customer/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirect: false }),
      });

      if (!response.ok) {
        throw new Error("Portal request failed");
      }

      const data = (await response.json()) as PortalResponse;

      if (!data.url) {
        throw new Error(data.error ?? "No portal URL returned");
      }

      window.location.assign(data.url);
    } catch (portalError) {
      console.error("Failed to open customer portal:", portalError);
      setError("Could not open the billing portal. Please try again.");
      setIsOpening(false);
    }
  }, []);

  useEffect(() => {
    void openPortal();
  }, [openPortal]);

  return (
    <>
      <RedirectToSignIn />
      <SignedIn>
        <div className="space-y-6" data-page-shell>
          <section className="pro-page-hero" data-gsap="intro">
            <div className="space-y-3">
              <p className="pro-section-label">Billing</p>
              <h1 className="pro-page-title">Customer Portal</h1>
              <p className="pro-page-copy">
                Manage billing details, invoices, and plan information through your secure customer portal.
              </p>
            </div>
          </section>

          <div className="pro-surface flex min-h-75 flex-col items-center justify-center gap-3 p-8" data-gsap="card">
          {error ? (
            <>
              <p className="text-sm text-red-600" data-gsap="intro">{error}</p>
              <div className="flex items-center gap-2" data-gsap="card">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    void openPortal();
                  }}
                >
                  Try again
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">Back to dashboard</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              {isOpening && (
                <Loader2 className="h-6 w-6 animate-spin text-slate-500" data-gsap="intro" />
              )}
              <p className="text-sm text-slate-600" data-gsap="intro">Opening customer portal...</p>
            </>
          )}
          </div>
        </div>
      </SignedIn>
    </>
  );
}
