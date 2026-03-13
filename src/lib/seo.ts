const PRODUCTION_FALLBACK_URL = "https://kritam-ai-image-editor-saas.vercel.app";
const DEVELOPMENT_FALLBACK_URL = "http://localhost:3050";

export function getBaseUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionDomain) {
    return `https://${productionDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl && process.env.NODE_ENV === "production") {
    return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_FALLBACK_URL;
  }

  return DEVELOPMENT_FALLBACK_URL;
}

export function absoluteUrl(pathname: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
