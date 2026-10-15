import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { ToastContext } from "./useToast";
import type { ToastType } from "./useToast";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastCounter = 0;

const styles: Record<ToastType, { icon: ReactNode; ring: string; text: string }> = {
  success: { icon: <CheckCircle2 size={20} className="text-stadio-green" />, ring: "ring-green-500/30", text: "text-stadio-black dark:text-white" },
  error: { icon: <X size={20} className="text-stadio-red" />, ring: "ring-red-500/30", text: "text-stadio-black dark:text-white" },
  warning: { icon: <AlertTriangle size={20} className="text-stadio-amber" />, ring: "ring-amber-500/30", text: "text-stadio-black dark:text-white" },
  info: { icon: <Info size={20} className="text-stadio-blue" />, ring: "ring-blue-500/30", text: "text-stadio-black dark:text-white" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastCounter;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2" role="status" aria-live="polite">
        {toasts.map((t) => {
          const s = styles[t.type];
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl bg-white dark:bg-stadio-black/95 px-4 py-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 animate-[slidein_.25s_ease] max-w-xs"
            >
              {s.icon}
              <span className={`text-sm font-medium ${s.text}`}>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
