import { useEffect, useRef, useState } from "react";
import { Bell, Check, Info, AlertTriangle, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Badge } from "./Badge";
import { notifications as defaultNotifications } from "../data/notifications";
import type { AppNotification, NotificationType } from "../data/notifications";

const typeStyles: Record<NotificationType, string> = {
  info: "bg-stadio-blue-bg text-stadio-blue dark:bg-blue-950/50 dark:text-blue-300",
  warning: "bg-stadio-amber-bg text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  success: "bg-stadio-green-bg text-stadio-green dark:bg-green-950/50 dark:text-green-300",
  error: "bg-red-100 text-stadio-red dark:bg-red-950/50 dark:text-red-300",
};

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,
};

const typeLabels: Record<NotificationType, { label: string; variant: "info" | "warning" | "success" | "error" }> = {
  info: { label: "Información", variant: "info" },
  warning: { label: "Aviso", variant: "warning" },
  success: { label: "Éxito", variant: "success" },
  error: { label: "Incidencia", variant: "error" },
};

interface NotificationBellProps {
  notifications?: AppNotification[];
}

export function NotificationBell({ notifications = defaultNotifications }: NotificationBellProps) {
  const [items, setItems] = useState<AppNotification[]>(notifications);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setSelectedId(null);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSelectedId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const unread = items.filter((n) => !n.read).length;
  const selected = items.find((n) => n.id === selectedId) ?? null;

  const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const openNotification = (id: string) => {
    setSelectedId(id);
    markRead(id);
  };

  const togglePanel = () => {
    setOpen((o) => {
      if (o) setSelectedId(null);
      return !o;
    });
  };

  const SelectedIcon = selected ? typeIcons[selected.type] : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={togglePanel}
        className="relative rounded-lg p-2 text-stadio-gray-dark dark:text-white/70 hover:bg-stadio-gray-light dark:hover:bg-white/10"
        aria-label="Notificaciones"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-stadio-red px-1 text-[10px] font-bold leading-none text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-white/10 dark:bg-stadio-black">
          {selected && SelectedIcon ? (
            <div>
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg p-1 text-stadio-gray-dark hover:bg-stadio-gray-light dark:text-white/60 dark:hover:bg-white/10"
                  aria-label="Volver al listado"
                >
                  <ArrowLeft size={18} />
                </button>
                <p className="text-sm font-bold text-stadio-black dark:text-white">Detalles</p>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${typeStyles[selected.type]}`}>
                    <SelectedIcon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{selected.title}</p>
                    <p className="mt-0.5 text-[11px] font-semibold text-stadio-gray dark:text-white/40">{selected.time}</p>
                  </div>
                </div>

                <Badge variant={typeLabels[selected.type].variant}>{typeLabels[selected.type].label}</Badge>

                <p className="text-sm leading-relaxed text-stadio-gray-dark dark:text-white/70">{selected.detail}</p>

                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="w-full rounded-lg bg-stadio-gray-light py-2 text-xs font-bold text-stadio-black transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  Volver al listado
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/10">
                <p className="text-sm font-bold text-stadio-black dark:text-white">Notificaciones</p>
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stadio-red hover:underline"
                  >
                    <Check size={13} /> Marcar todas
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-stadio-gray dark:text-white/50">
                    No tienes notificaciones.
                  </p>
                ) : (
                  items.map((n) => {
                    const Icon = typeIcons[n.type];
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => openNotification(n.id)}
                        className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-stadio-gray-light/60 dark:border-white/5 dark:hover:bg-white/5 ${
                          n.read ? "" : "bg-stadio-red/[0.03] dark:bg-white/[0.03]"
                        }`}
                      >
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${typeStyles[n.type]}`}>
                          <Icon size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-bold text-stadio-black dark:text-white">{n.title}</span>
                            {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-stadio-red" />}
                          </span>
                          <span className="mt-0.5 block text-xs text-stadio-gray dark:text-white/50">{n.description}</span>
                          <span className="mt-1 block text-[11px] font-semibold text-stadio-gray dark:text-white/40">{n.time}</span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
