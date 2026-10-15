import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue>({ notify: () => {} });

export function useToast() {
  return useContext(ToastContext);
}
