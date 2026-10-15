import type { ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-stadio-green-bg text-stadio-green dark:bg-green-950/50 dark:text-green-300",
  warning: "bg-stadio-amber-bg text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  error: "bg-red-100 text-stadio-red dark:bg-red-950/50 dark:text-red-300",
  info: "bg-stadio-blue-bg text-stadio-blue dark:bg-blue-950/50 dark:text-blue-300",
  neutral: "bg-stadio-gray-light text-stadio-gray-dark dark:bg-white/10 dark:text-white/60",
};

const dots: Record<BadgeVariant, string> = {
  success: "bg-stadio-green",
  warning: "bg-stadio-amber",
  error: "bg-stadio-red",
  info: "bg-stadio-blue",
  neutral: "bg-stadio-gray",
};

export function Badge({ children, variant = "neutral", dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[variant]}`} />}
      {children}
    </span>
  );
}
