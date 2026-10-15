import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-stadio-red text-white hover:bg-red-700 focus-visible:ring-red-500/50 disabled:bg-red-300 dark:disabled:bg-red-900/50",
  secondary:
    "bg-stadio-gray-light text-stadio-black dark:bg-white/10 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15 focus-visible:ring-gray-400/50",
  ghost:
    "bg-transparent text-stadio-gray-dark dark:text-white/70 hover:bg-stadio-gray-light dark:hover:bg-white/10 focus-visible:ring-gray-400/40",
  danger:
    "bg-red-50 text-stadio-red hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60 focus-visible:ring-red-500/40",
  outline:
    "bg-transparent border border-gray-300 dark:border-white/20 text-stadio-black dark:text-white hover:bg-stadio-gray-light dark:hover:bg-white/10 focus-visible:ring-gray-400/40",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-sm gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
