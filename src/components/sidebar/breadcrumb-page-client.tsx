"use client";

import { usePathname } from "next/navigation";

function formatSegment(segment: string): string {
  if (!segment) {
    return "Dashboard";
  }

  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BreadcrumbPageClient() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const dashboardIndex = segments.indexOf("dashboard");
  const pageSegment =
    dashboardIndex >= 0 && dashboardIndex < segments.length - 1
      ? (segments[segments.length - 1] ?? "dashboard")
      : "dashboard";

  return (
    <p className="text-sm font-medium tracking-tight text-slate-700">
      {formatSegment(pageSegment)}
    </p>
  );
}
