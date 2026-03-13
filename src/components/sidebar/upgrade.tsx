"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";

type PolarCheckoutClient = {
  checkout: (input: { products: string[] }) => Promise<unknown>;
};

export default function Upgrade() {
  const upgrade = async () => {
    try {
      const polarCheckoutClient = authClient as unknown as PolarCheckoutClient;
      await polarCheckoutClient.checkout({
        products: [
          "66a07182-023a-4256-96a2-a33e853bf1ae",
          "69cb4b8f-c586-4af5-b0c7-cdcc6e4a17fd",
          "88359e70-4f7d-4bda-9001-01a3c5a8a584",
        ],
      });
      toast.success("Opening checkout...");
    } catch (error) {
      console.error("Failed to open checkout:", error);
      toast.error("Could not open checkout. Please try again.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="group relative ml-2 cursor-pointer overflow-hidden border-orange-400/50 bg-gradient-to-r from-orange-400/10 to-pink-500/10 text-orange-400 transition-all duration-300 hover:border-orange-500/70 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-orange-500/25"
      onClick={upgrade}
    >
      <div className="flex items-center gap-2">
        <Crown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        <span className="font-medium">Upgrade</span>
        <Sparkles className="h-3 w-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-orange-400/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Button>
  );
}