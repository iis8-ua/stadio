import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-stadio-gray-dark/40 border border-gray-100 dark:border-white/10 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-1">
      <div>
        <h3 className="text-sm font-bold text-stadio-black dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-stadio-gray dark:text-white/50 mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = "", ...rest }: CardProps) {
  return (
    <div className={`p-5 ${className}`} {...rest}>
      {children}
    </div>
  );
}
