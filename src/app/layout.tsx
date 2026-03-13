import "~/styles/globals.css";

import { type Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import { APP_NAME } from "~/components/brand/logo";
import { GsapRuntime } from "~/components/animations/gsap-runtime";
import { getBaseUrl } from "~/lib/seo";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Lumen Studio is an AI image editing platform for creators and teams. Remove backgrounds, upscale images, and export studio-quality visuals in minutes.",
  keywords: [
    "AI image editor",
    "background remover",
    "image upscaler",
    "AI photo editing",
    "SaaS image editor",
    "Lumen Studio",
  ],
  category: "technology",
  applicationName: APP_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: APP_NAME,
    title: `${APP_NAME} | AI Image Editing Platform`,
    description:
      "Remove backgrounds, enhance image quality, and produce launch-ready visuals with AI-powered workflows.",
    images: [
      {
        url: "/favicon.ico",
        width: 512,
        height: 512,
        alt: `${APP_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | AI Image Editing Platform`,
    description:
      "Professional AI image editing for creators and teams. Fast workflows, clean outputs, and production-ready results.",
    images: ["/favicon.ico"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning>
        <GsapRuntime />
        {children}
        <Toaster
          closeButton
          richColors
          position="top-right"
          toastOptions={{
            duration: 3200,
            className: "shadow-xl",
          }}
        />
      </body>
    </html>
  );
}