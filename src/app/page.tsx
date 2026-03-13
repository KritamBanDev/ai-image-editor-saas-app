import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Sparkles,
  Zap,
  Star,
  ImageIcon,
  Scissors,
  Expand,
  Target,
  Download,
  CheckCircle2,
  Play,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { APP_NAME, Logo } from "~/components/brand/logo";
import { HomeNavbar } from "~/components/navigation/home-navbar";
import { absoluteUrl } from "~/lib/seo";

export const metadata: Metadata = {
  title: "AI Image Editor for Teams",
  description:
    "Edit images with AI in minutes. Remove backgrounds, upscale assets, and deliver studio-quality visuals with Lumen Studio.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${APP_NAME} | AI Image Editor for Teams`,
    description:
      "Create launch-ready visuals with AI-powered background removal, upscaling, and object-focused cropping.",
    url: "/",
    images: [
      {
        url: "/favicon.ico",
        width: 512,
        height: 512,
        alt: `${APP_NAME} logo mark`,
      },
    ],
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_NAME,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    description:
      "AI image editing platform for creators and teams. Remove backgrounds, upscale images, and export production-ready assets.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free plan available",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2500",
    },
  };

  const features = [
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "AI Background Removal",
      description:
        "Remove backgrounds instantly with advanced AI technology. Perfect for product photos and portraits.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: <Expand className="h-8 w-8" />,
      title: "Smart Upscaling",
      description:
        "Enhance image quality and resolution without losing clarity using cutting-edge AI algorithms.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Object-Focused Cropping",
      description:
        "Intelligently crop images around specific objects with AI-powered detection and framing.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description:
        "Process images in seconds, not minutes. Our optimized AI infrastructure delivers results instantly.",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Graphic Designer",
      content:
        "This tool has revolutionized my workflow. Background removal that used to take hours now takes seconds!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "E-commerce Owner",
      content:
        "Perfect for product photography. The AI upscaling feature makes my images look professional.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Content Creator",
      content:
        "The object cropping feature is incredible. It knows exactly what I want to focus on.",
      rating: 5,
    },
  ];

  const pricingFeatures = [
    "AI Background Removal",
    "Smart Image Upscaling",
    "Object-Focused Cropping",
    "High-Quality Downloads",
    "Fast Processing",
    "Cloud Storage",
  ];

  const operatingPillars = [
    { label: "Avg turnaround", value: "3.2s" },
    { label: "Weekly exports", value: "42K" },
    { label: "Active teams", value: "2.5K" },
  ];

  const trustedBy = [
    "Northstar Commerce",
    "Studio Current",
    "Pixel Foundry",
    "Arc Retail",
    "Mono Supply",
  ];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div
        className="min-h-screen bg-linear-to-br from-slate-50 via-cyan-50/35 to-amber-50/20"
        data-page-shell
      >
        <HomeNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 sm:py-14" data-gsap="hero">
        <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" data-gsap="float" />
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-orange-200/45 blur-3xl" data-gsap="float" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="pro-page-hero relative z-10" data-gsap="intro">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/60 bg-cyan-100/60 px-4 py-2 text-xs font-semibold tracking-wide text-cyan-900 uppercase">
              <Sparkles className="h-4 w-4" />
              Enterprise AI Editing Platform
            </div>

            <h1 className="text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              The visual production system for fast-moving teams.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              {APP_NAME} turns raw assets into launch-ready visuals with AI-assisted
              cleanup, upscale, and composition tools built for design, ecommerce,
              and growth teams that cannot afford slow handoff cycles.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 w-full cursor-pointer gap-2 px-7 text-base sm:w-auto"
              >
                <Link href="/dashboard">
                  <Play className="h-5 w-5" />
                  Start Editing Free
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full cursor-pointer gap-2 border-slate-300 bg-white/80 px-7 text-base hover:bg-slate-100 sm:w-auto"
              >
                <Link href="#features">
                  <ImageIcon className="h-5 w-5" />
                  Explore Features
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                SOC-ready infrastructure
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                99.9% uptime
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                No credit card required
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {operatingPillars.map((pillar) => (
                <div key={pillar.label} className="pro-stat-tile">
                  <p className="pro-stat-label">{pillar.label}</p>
                  <p className="pro-stat-value mt-1">{pillar.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10" data-gsap="card">
            <div className="pro-page-hero p-4 sm:p-5">
              <div className="pro-muted-grid rounded-[22px] border border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-cyan-50/70 p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-700">
                    Live Production Snapshot
                  </p>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Operational
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase">
                      Images Processed
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">10K+</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase">
                      Active Teams
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">2.5K+</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase">
                      Avg. Processing
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">3.2s</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase">
                      Satisfaction
                    </p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">4.8/5</p>
                  </div>
                </div>

                <div className="mt-5 rounded-lg border border-cyan-200/90 bg-cyan-50 p-3 text-sm text-cyan-900">
                  Teams using {APP_NAME} report up to 65% faster image delivery
                  cycles across design and marketing operations.
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white/85 p-4">
                    <p className="pro-stat-label">Workflow mix</p>
                    <div className="mt-3 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between gap-3">
                        <span>Background cleanup</span>
                        <span className="font-semibold text-slate-900">42%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Upscale and sharpen</span>
                        <span className="font-semibold text-slate-900">33%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>Object framing</span>
                        <span className="font-semibold text-slate-900">25%</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-slate-100">
                    <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
                      Quality controls
                    </p>
                    <ul className="mt-3 space-y-3 text-sm text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Consistent output framing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Download-ready export states
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Review-friendly asset organization
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8" data-gsap="reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pro-surface flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="pro-section-label">Trusted by teams shipping daily</p>
              <p className="mt-1 text-sm text-slate-600">
                Product, marketplace, and content teams use {APP_NAME} to keep visual throughput high without sacrificing polish.
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0">
              {trustedBy.map((brand) => (
                <span
                  key={brand}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white/65 py-20 sm:py-28" data-gsap="reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="pro-section-label justify-center">Capabilities</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Production-grade AI tools for every asset handoff.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A single workspace for cleanup, enhancement, framing, and delivery.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-white/80 bg-white/85 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                data-gsap="card"
              >
                <CardContent className="p-6">
                  <div
                    className={`${feature.bgColor} mb-4 inline-flex items-center justify-center rounded-2xl p-3 ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-cyan-400 via-sky-500 to-amber-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50/80 py-20 sm:py-28" data-gsap="reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="pro-page-hero" data-gsap="card">
              <p className="pro-section-label">How It Works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A cleaner workflow from upload to export.
              </h2>
              <p className="mt-4 pro-page-copy">
                Replace scattered tools and manual cleanup loops with one fast workspace that handles preparation, refinement, and delivery.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Bring assets in",
                description:
                  "Upload raw images once and centralize every iteration inside a single workspace.",
              },
              {
                step: "02",
                title: "Refine with AI",
                description:
                  "Apply cleanup, upscale, and intelligent framing without slowing down the review loop.",
              },
              {
                step: "03",
                title: "Ship final output",
                description:
                  "Export ready-to-use visuals for storefronts, campaigns, and product libraries.",
              },
            ].map((item, index) => (
              <div key={index} className="pro-surface p-5" data-gsap="card">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 to-cyan-600 text-sm font-bold text-white shadow-lg">
                    {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-white/75 py-20 sm:py-28" data-gsap="reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="pro-section-label justify-center">Customer Signals</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Teams trust the output because the workflow stays predictable.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              See what our users are saying about {APP_NAME}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative border-slate-200 bg-white/70 backdrop-blur-sm"
                data-gsap="card"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: Number(testimonial.rating) }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-slate-600 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-linear-to-br from-slate-50 to-cyan-50/45 py-20 sm:py-28" data-gsap="reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="pro-section-label justify-center">Pricing</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Start with a fast workspace. Scale as your volume grows.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              No credit card required. Begin transforming your images instantly.
            </p>
          </div>

          <div className="mx-auto max-w-lg">
            <Card className="relative overflow-hidden border-2 border-cyan-300 bg-white/70 backdrop-blur-sm" data-gsap="card">
              <div className="absolute top-0 right-0 bg-linear-to-r from-blue-500 to-purple-600 px-4 py-1 text-sm font-medium text-white">
                Free to Start
              </div>
              <CardContent className="p-8">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Free Plan
                  </h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-slate-800">
                      $0
                    </span>
                    <span className="ml-2 text-slate-600">to start</span>
                  </div>
                  <p className="mt-2 text-slate-600">
                    Try all features with free credits
                  </p>
                </div>

                <ul className="mb-8 space-y-4">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full cursor-pointer gap-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  size="lg"
                >
                  <Link href="/dashboard">
                    <Sparkles className="h-4 w-4" />
                    Try It Free Now
                  </Link>
                </Button>

                <p className="mt-4 text-center text-xs text-slate-500">
                  Includes 10 free credits • No credit card required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28" data-gsap="reveal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pro-page-hero mx-auto max-w-4xl text-center">
            <p className="pro-section-label justify-center">Ready to Launch</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Ready to Transform Your Images?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Join thousands of creators using AI to enhance their visual
              content
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="cursor-pointer gap-2 bg-linear-to-r from-blue-500 to-purple-600 px-8 py-6 text-base hover:from-blue-600 hover:to-purple-700"
              >
                <Link href="/dashboard">
                  <Sparkles className="h-5 w-5" />
                  Try It Free Now
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="cursor-pointer gap-2 border-slate-300 px-8 py-6 text-base text-slate-700 hover:bg-slate-100"
              >
                <Link href="/dashboard">
                  <Download className="h-5 w-5" />
                  View Examples
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="md:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <Logo href="/" size="sm" />
                </div>
                <p className="max-w-md text-slate-600">
                  Professional image editing powered by artificial intelligence.
                  Transform your images with cutting-edge AI technology.
                </p>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-slate-800">Product</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>
                    <Link
                      href="#features"
                      className="transition-colors hover:text-blue-600"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="transition-colors hover:text-blue-600"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="transition-colors hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-slate-800">Support</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li>
                    <Link
                      href="/dashboard/settings"
                      className="transition-colors hover:text-blue-600"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="mailto:support@lumenstudio.app"
                      className="transition-colors hover:text-blue-600"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth/sign-in"
                      className="transition-colors hover:text-blue-600"
                    >
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
              <p>
                &copy; {new Date().getFullYear()} {APP_NAME}. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}