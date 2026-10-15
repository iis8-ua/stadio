/**
 * Configuración del gimnasio (RF-78, RF-79, RF-82).
 *
 * Store en memoria que actúa como fuente de verdad para las funcionalidades
 * que consumen la configuración: chatbot (RF-77), cuotas (RF-79) y aforo
 * (capacidad y horario).
 */

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface Holiday {
  id: string;
  date: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface NotificationPrefs {
  quotaReminder: boolean;
  classReminder: boolean;
  weeklySummary: boolean;
  channelEmail: boolean;
  channelPush: boolean;
}

export interface GymSettings {
  name: string;
  city: string;
  address: string;
  phone: string;
  /** Capacidad máxima del recinto (personas). */
  capacity: number;
  /** Importe de la cuota mensual (€). */
  membershipFee: number;
  /** Día del mes en que se realiza el cobro. */
  billingDay: number;
  /** Horario semanal. Índice 0 = Lunes … 6 = Domingo. */
  week: DayHours[];
  holidays: Holiday[];
  notifications: NotificationPrefs;
}

const DEFAULT_WEEK: DayHours[] = [
  { open: "06:00", close: "22:00", closed: false },
  { open: "06:00", close: "22:00", closed: false },
  { open: "06:00", close: "22:00", closed: false },
  { open: "06:00", close: "22:00", closed: false },
  { open: "06:00", close: "22:00", closed: false },
  { open: "08:00", close: "21:00", closed: false },
  { open: "09:00", close: "20:00", closed: false },
];

let settings: GymSettings = {
  name: "STADIO Fitness Club",
  city: "Alicante",
  address: "Avenida Maisonnave 24",
  phone: "+34 965 000 000",
  capacity: 200,
  membershipFee: 55,
  billingDay: 1,
  week: DEFAULT_WEEK.map((d) => ({ ...d })),
  holidays: [{ id: "h-2026-01-01", date: "2026-01-01", open: "10:00", close: "14:00", closed: false }],
  notifications: {
    quotaReminder: true,
    classReminder: true,
    weeklySummary: false,
    channelEmail: true,
    channelPush: true,
  },
};

export function getGymSettings(): GymSettings {
  return settings;
}

export function updateGymSettings(patch: Partial<GymSettings>): void {
  settings = { ...settings, ...patch };
}

/** Horario del día actual (0 = Lunes … 6 = Domingo). */
export function getTodayHours(): DayHours {
  const idx = (new Date().getDay() + 6) % 7;
  return settings.week[idx] ?? settings.week[0];
}

/** Horario efectivo de una fecha ISO, teniendo en cuenta festivos. */
export function getHoursForDate(dateIso: string): DayHours {
  const holiday = settings.holidays.find((h) => h.date === dateIso);
  if (holiday) return { open: holiday.open, close: holiday.close, closed: holiday.closed };
  const idx = (new Date(`${dateIso}T12:00:00`).getDay() + 6) % 7;
  return settings.week[idx] ?? settings.week[0];
}

/** Importe de la cuota formateado (p. ej. "55 €"). */
export function formatFee(amount: number = settings.membershipFee): string {
  return `${amount.toLocaleString("es-ES")} €`;
}
