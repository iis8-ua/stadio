import { Inbox, AlertCircle } from "lucide-react";

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-stadio-gray-light dark:bg-white/5">
        <Inbox size={26} className="text-stadio-gray dark:text-white/40" />
      </div>
      <p className="mt-4 text-sm font-bold text-stadio-black dark:text-white">{title}</p>
      {message && (
        <p className="mt-1 text-xs text-stadio-gray dark:text-white/50">{message}</p>
      )}
    </div>
  );
}

export function ErrorState({ title = "Ha ocurrido un error", message }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-100 dark:bg-red-950/50">
        <AlertCircle size={26} className="text-stadio-red" />
      </div>
      <p className="mt-4 text-sm font-bold text-stadio-black dark:text-white">{title}</p>
      {message && (
        <p className="mt-1 text-xs text-stadio-gray dark:text-white/50">{message}</p>
      )}
    </div>
  );
}
