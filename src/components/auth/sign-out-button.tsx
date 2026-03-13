"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "~/lib/auth-client";
import { cn } from "~/lib/utils";

interface SignOutButtonProps {
  className?: string;
  /** Render as a full styled button (default) or a plain menu item link-style */
  variant?: "button" | "menu-item";
}

export function SignOutButton({ className, variant = "button" }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
        onError: () => {
          setLoading(false);
        },
      },
    });
  };

  if (variant === "menu-item") {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60",
          className,
        )}
      >
        <LogOut className="h-4 w-4" />
        {loading ? "Signing out…" : "Sign Out"}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300 active:scale-[0.98] disabled:opacity-60 cursor-pointer",
        className,
      )}
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
