import type { ScheduleEntry } from "../../types";

export type { ScheduleEntry };

const entries: ScheduleEntry[] = [];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function mondayOf(d: Date): Date {
  const day = (d.getDay() + 6) % 7;
  const out = new Date(d);
  out.setDate(d.getDate() - day);
  out.setHours(12, 0, 0, 0);
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(d.getDate() + n);
  return out;
}

// Planificación de ejemplo en la semana actual.
const monday = mondayOf(new Date());
const seed = (offset: number, start: string, end: string, title: string, room: string) => {
  entries.push({ id: `sc-${offset}-${start}`, date: toIso(addDays(monday, offset)), start, end, title, room });
};

seed(1, "10:00", "11:00", "Entrenamiento personal · María García", "Box CrossFit");
seed(1, "12:00", "13:00", "Entrenamiento personal · Sara Martínez", "Sala B");
seed(2, "18:30", "19:30", "Reserva gimnasio libre", "Sala B");
seed(3, "19:00", "20:00", "Revisión rutinas", "Box CrossFit");

export function getScheduleForDate(date: string): ScheduleEntry[] {
  return entries.filter((e) => e.date === date).sort((a, b) => a.start.localeCompare(b.start));
}

export function getAllScheduleEntries(): ScheduleEntry[] {
  return entries;
}

export function addScheduleEntry(entry: Omit<ScheduleEntry, "id">): void {
  entries.push({ id: `sc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...entry });
}

export function updateScheduleEntry(id: string, patch: Partial<Omit<ScheduleEntry, "id" | "date">>): void {
  const entry = entries.find((e) => e.id === id);
  if (entry) Object.assign(entry, patch);
}

export function deleteScheduleEntry(id: string): void {
  const idx = entries.findIndex((e) => e.id === id);
  if (idx !== -1) entries.splice(idx, 1);
}
