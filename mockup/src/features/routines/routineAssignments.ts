import type { RoutineAssignment } from "../../types";

/**
 * Planificación de rutinas del entrenador por días (en memoria).
 * Cada cliente tiene una rutina asignada a cada fecha concreta.
 */
const list: RoutineAssignment[] = [];

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

// Datos de ejemplo: rutinas repartidas en la semana actual y la anterior.
const monday = mondayOf(new Date());
const seed = (clientId: string, offset: number, routineId: string, routineName: string) => {
  list.push({ id: `as-${clientId}-${offset}`, clientId, routineId, routineName, date: toIso(addDays(monday, offset)) });
};

seed("c1", 0, "tr-w1", "Pecho + Tríceps");
seed("c1", 2, "tr-w3", "Pierna + Core");
seed("c1", 4, "tr-w2", "Espalda + Bíceps");
seed("c1", -3, "tr-w5", "Full Body");

seed("c2", 1, "tr-w5", "Full Body");
seed("c2", 3, "tr-w4", "Push Pull Legs");

seed("c4", 0, "tr-w6", "Fuerza 5x5");
seed("c4", 2, "tr-w1", "Pecho + Tríceps");

export function getScheduleForClient(clientId: string): RoutineAssignment[] {
  return list.filter((a) => a.clientId === clientId).sort((a, b) => a.date.localeCompare(b.date));
}

export function getRoutineForDate(clientId: string, date: string): RoutineAssignment | undefined {
  return list.find((a) => a.clientId === clientId && a.date === date);
}

/** Asigna (o reemplaza) la rutina de un día concreto. */
export function setRoutineForDate(clientId: string, date: string, routineId: string, routineName: string): void {
  const existing = getRoutineForDate(clientId, date);
  if (existing) {
    existing.routineId = routineId;
    existing.routineName = routineName;
    return;
  }
  list.push({ id: `as-${clientId}-${date}`, clientId, routineId, routineName, date });
}

export function clearRoutineForDate(clientId: string, date: string): void {
  const idx = list.findIndex((a) => a.clientId === clientId && a.date === date);
  if (idx !== -1) list.splice(idx, 1);
}

/** Rutina activa del cliente: la de hoy, si no la última pasada, si no la próxima. */
export function getClientActiveEntry(clientId: string): RoutineAssignment | undefined {
  const schedule = getScheduleForClient(clientId);
  if (schedule.length === 0) return undefined;
  const today = toIso(new Date());
  const todayEntry = schedule.find((a) => a.date === today);
  if (todayEntry) return todayEntry;
  const past = [...schedule].reverse().find((a) => a.date < today);
  if (past) return past;
  return schedule.find((a) => a.date > today);
}
