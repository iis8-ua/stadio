import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface FieldProps {
  label?: string;
  children: ReactNode;
}

export function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
          {label}
        </span>
      )}
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-stadio-black dark:text-white placeholder:text-stadio-gray focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-400";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputBase} ${props.className ?? ""}`}>
      {props.children}
    </select>
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
) {
  return (
    <textarea
      {...props}
      className={`${inputBase} ${props.className ?? ""}`}
    />
  );
}
