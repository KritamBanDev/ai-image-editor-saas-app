import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "~/lib/utils";

export const APP_NAME = "Lumen Studio";

type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  href: string;
  size?: LogoSize;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
};

const sizeConfig: Record<LogoSize, { wrapper: string; icon: string; text: string }> = {
  sm: {
    wrapper: "h-8 w-8 rounded-lg",
    icon: "h-4 w-4",
    text: "text-lg",
  },
  md: {
    wrapper: "h-10 w-10 rounded-xl",
    icon: "h-5 w-5",
    text: "text-xl",
  },
  lg: {
    wrapper: "h-12 w-12 rounded-xl",
    icon: "h-6 w-6",
    text: "text-2xl",
  },
};

export function Logo({
  href,
  size = "md",
  className,
  textClassName,
  iconClassName,
}: LogoProps) {
  const config = sizeConfig[size];

  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg",
          config.wrapper,
          iconClassName,
        )}
      >
        <Sparkles className={config.icon} />
      </span>
      <span
        className={cn(
          "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-transparent",
          config.text,
          textClassName,
        )}
      >
        {APP_NAME}
      </span>
    </Link>
  );
}
