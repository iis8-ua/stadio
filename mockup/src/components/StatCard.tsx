import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: ReactNode;
  delay?: string;
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-stadio-gray dark:text-white/50">
          {label}
        </p>
        {icon && (
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">
        {value}
      </p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold">
          <span
            className={`inline-flex items-center gap-0.5 ${
              positive ? "text-stadio-green" : "text-stadio-red"
            }`}
          >
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {positive ? "+" : ""}
            {change}%
          </span>
          <span className="text-stadio-gray dark:text-white/40">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}
