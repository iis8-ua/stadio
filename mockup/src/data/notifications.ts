import { buildPendingClients } from "./fees";
import { payments } from "./payments";
import { MONTHS_FULL } from "./analytics";
import { formatFee, getGymSettings } from "../features/settings/gymSettings";

export type NotificationType = "info" | "warning" | "success" | "error";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  detail: string;
  type: NotificationType;
  time: string;
  read: boolean;
}

/**
 * Notificaciones comunes a todos los tipos de usuario.
 */
export const notifications: AppNotification[] = [
  {
    id: "n1",
    title: "Recordatorio de cuota pendiente",
    description: "3 clientes tienen la cuota pendiente este mes.",
    detail:
      "Javier López, Ana Ruiz y Lucía Navarro mantienen la cuota de septiembre pendiente. Puedes enviarles un recordatorio desde la sección de Cuotas o revisar el estado de cada cobro.",
    type: "warning",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "n2",
    title: "Aviso de clase completa",
    description: "La clase de Spinning de las 19:00 está al 100%.",
    detail:
      "La sesión de Spinning de hoy a las 19:00 ha alcanzado su aforo máximo (24/24 plazas), por lo que no admite más reservas.",
    type: "info",
    time: "Hace 25 min",
    read: false,
  },
  {
    id: "n3",
    title: "Nuevo acceso sin salida",
    description: "Ana Ruiz entró a las 18:40 y no registra salida.",
    detail:
      "Ana Ruiz registró su entrada a las 18:40 y todavía no ha marcado su salida. Si el gimnasio ya está cerrado, revisa el acceso para evitar incidencias de aforo.",
    type: "warning",
    time: "Hace 1 h",
    read: false,
  },
  {
    id: "n4",
    title: "Incidencia en instalaciones",
    description: "Cinta 4 de la sala cardio en mantenimiento.",
    detail:
      "La cinta 4 de la sala de cardio está fuera de servicio desde esta mañana. El equipo técnico tiene previsto repararla en las próximas 24 horas.",
    type: "error",
    time: "Hace 3 h",
    read: true,
  },
  {
    id: "n5",
    title: "Reserva confirmada",
    description: "Plaza confirmada para la clase de HIIT del jueves.",
    detail:
      "La reserva para la clase de HIIT del jueves a las 18:00 con Carlos está confirmada. Recuerda llegar 10 minutos antes para preparar el material.",
    type: "success",
    time: "Hace 1 día",
    read: true,
  },
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();

/** Aviso de cuota próxima a vencer para el propio cliente. */
function quotaDueNotification(): AppNotification | null {
  const pending = payments.find((p) => p.status === "Pendiente");
  if (!pending) return null;
  return {
    id: "quota-due",
    title: "Cuota próxima a vencer",
    description: `Tu cuota de ${pending.month} está pendiente de pago.`,
    detail: `Tu cuota mensual de ${pending.month} (${formatFee()}) está próxima a vencer y todavía no se ha registrado el pago. Puedes pagarla desde la sección de Cuotas para evitar recargos.`,
    type: "warning",
    time: "Hoy",
    read: false,
  };
}

/** Aviso de cuotas pendientes para el administrador, calculado desde los datos reales. */
function quotaPendingNotification(): AppNotification | null {
  const pending = buildPendingClients(CURRENT_YEAR, CURRENT_MONTH);
  if (pending.length === 0) return null;
  const names = pending.slice(0, 3).map((p) => p.name).join(", ");
  const extra = pending.length > 3 ? " y otros" : "";
  return {
    id: "quota-pending",
    title: "Recordatorio de cuota pendiente",
    description: `${pending.length} ${pending.length === 1 ? "cliente tiene" : "clientes tienen"} la cuota pendiente este mes.`,
    detail: `${names}${extra} mantienen la cuota de ${MONTHS_FULL[CURRENT_MONTH]} ${CURRENT_YEAR} pendiente. Puedes enviarles un recordatorio o marcar la cuota como pagada desde la sección de Cuotas.`,
    type: "warning",
    time: "Hoy",
    read: false,
  };
}

/**
 * Notificaciones adaptadas al rol. La cuota pendiente se genera a partir de
 * los datos reales de pagos (cliente) y de cuotas (administrador).
 */
export function buildNotifications(role: string | null): AppNotification[] {
  const { notifications: prefs } = getGymSettings();
  // Respeta la configuración de notificaciones (RF-82).
  const rest = notifications.filter((n) => {
    if (n.id === "n1") return false;
    if (n.id === "n2" && !prefs.classReminder) return false;
    if (n.id === "n5" && !prefs.classReminder) return false;
    return true;
  });
  if (role === "client") {
    const quota = prefs.quotaReminder ? quotaDueNotification() : null;
    return quota ? [quota, ...rest] : rest;
  }
  if (role === "admin") {
    const quota = prefs.quotaReminder ? quotaPendingNotification() : null;
    return quota ? [quota, ...rest] : rest;
  }
  return rest;
}
