import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "~/components/providers";
import { ImageIcon, Zap, Target } from "lucide-react";
import Link from "next/link";
import { Logo } from "~/components/brand/logo";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create your Lumen Studio account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen" data-page-shell>
        {/* Left Side - Branding */}
        <div
          className="relative hidden overflow-hidden bg-linear-to-br from-slate-900 via-cyan-950 to-slate-800 lg:flex lg:w-1/2"
          data-gsap="card"
        >
          <div className="bg-grid-white/[0.1] absolute inset-0 bg-size-[30px_30px]" />
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
            {/* Logo */}
            <Logo
              href="/"
              size="lg"
              className="mb-12"
              iconClassName="border border-blue-400/30 bg-blue-500/20"
              textClassName="bg-none text-blue-50"
            />

            {/* Hero Content */}
            <div className="max-w-md" data-gsap="intro">
              <p className="mb-4 text-[11px] font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                Creative Ops Platform
              </p>
              <h1 className="mb-6 text-4xl leading-tight font-bold text-blue-50 xl:text-5xl">
                Transform raw images into launch-ready assets.
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-blue-100/90">
                Join teams using AI to clean, enhance, and ship production visuals in one controlled workflow.
              </p>

              {/* Feature List */}
              <div className="space-y-4">
                {[
                  {
                    icon: ImageIcon,
                    text: "AI Background Removal",
                    color:
                      "bg-emerald-500/20 border-emerald-400/30 text-emerald-300",
                  },
                  {
                    icon: Zap,
                    text: "Lightning Fast Processing",
                    color: "bg-amber-500/20 border-amber-400/30 text-amber-300",
                  },
                  {
                    icon: Target,
                    text: "Professional Quality Results",
                    color:
                      "bg-purple-500/20 border-purple-400/30 text-purple-300",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3" data-gsap="card">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border backdrop-blur-sm ${feature.color}`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-blue-100">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8" data-gsap="intro">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200">10K+</div>
                <div className="text-sm text-blue-300/70">Images Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-200">2.5K+</div>
                <div className="text-sm text-blue-300/70">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-300">4.8★</div>
                <div className="text-sm text-blue-300/70">Rating</div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" data-gsap="float" />
          <div className="absolute right-32 bottom-20 h-24 w-24 rounded-full bg-amber-400/15 blur-2xl" data-gsap="float" />
          <div className="absolute top-1/2 right-10 h-16 w-16 rounded-full bg-emerald-400/20 blur-xl" data-gsap="float" />
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex flex-1 flex-col justify-center bg-linear-to-br from-slate-50 to-cyan-50/40 px-6 py-12 lg:px-8" data-gsap="intro">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 text-center lg:hidden">
              <Logo href="/" size="md" />
            </div>

            {/* Auth Form Container */}
            <div className="pro-page-hero p-5 sm:p-6" data-gsap="card">{children}</div>

            {/* Footer Link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Back to{" "}
              <Link
                href="/"
                className="font-medium text-blue-600 transition-colors hover:text-blue-500"
              >
                homepage
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Providers>
  );
}