import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2, RefreshCw } from "lucide-react";
import { Button } from "./Button";

/** Estado de carga (mientras se obtienen datos). */
export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-16 text-stadio-gray dark:text-white/50"
    >
      <Loader2 size={28} className="animate-spin text-stadio-red" aria-hidden />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

/** Estado de error cuando una operación falla, con opción de reintentar. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-stadio-red dark:bg-red-950/50 dark:text-red-300">
        <AlertTriangle size={24} aria-hidden />
      </span>
      <p className="max-w-md text-sm font-semibold text-stadio-black dark:text-white">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw size={15} /> Reintentar
        </Button>
      )}
    </div>
  );
}

/** Estado vacío cuando no existen datos que mostrar. */
export function EmptyState({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox size={28} className="text-stadio-gray dark:text-white/30" aria-hidden />
      <p className="text-sm text-stadio-gray dark:text-white/50">{message}</p>
      {children}
    </div>
  );
}
