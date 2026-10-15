import { Button } from "./Button";

interface ConfirmProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function Confirmation({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  danger,
}: ConfirmProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-hidden />
      <div className="relative w-[min(92vw,400px)] rounded-2xl bg-white dark:bg-stadio-gray-dark/90 p-6 shadow-xl">
        <h3 className="text-base font-bold text-stadio-black dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-stadio-gray-dark dark:text-white/60">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
