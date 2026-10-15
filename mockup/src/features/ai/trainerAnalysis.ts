import type { Client, GymClass } from "../../types";
import { classTypes, classSessions, resolveGymClasses } from "../../data/classes";
import { clients } from "../../data/users";
import { findEmployeeById, getShiftForDate } from "../../data/employees";
import { getAllScheduleEntries } from "../schedule/trainerSchedule";
import { getTrainerRoutines } from "../routines/trainerRoutines";
import { getScheduleForClient } from "../routines/routineAssignments";
import { CURRENT_TRAINER_ID, getAssignedTrainerId } from "../trainer/personalTrainer";

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

/** Clases colectivas que imparte el entrenador (según sus classIds). */
export function getMyGroupClasses(): GymClass[] {
  const trainer = findEmployeeById(CURRENT_TRAINER_ID);
  const names = classTypes.filter((t) => trainer?.classIds.includes(t.id)).map((t) => t.name);
  return resolveGymClasses(classTypes, classSessions).filter((c) => names.includes(c.name));
}

export function getMyClients(): Client[] {
  return clients.filter((c) => getAssignedTrainerId(c.id) === CURRENT_TRAINER_ID);
}

export interface OccupancyType {
  name: string;
  pct: number;
  booked: number;
  capacity: number;
}

export interface TrainerClassAnalysis {
  totalClasses: number;
  avgOccupancy: number;
  byType: OccupancyType[];
  best: OccupancyType | null;
  worst: OccupancyType | null;
  finding: string;
  tips: string[];
}

export function getTrainerClassAnalysis(): TrainerClassAnalysis {
  const gymClasses = getMyGroupClasses();
  const map = new Map<string, { booked: number; capacity: number }>();
  for (const c of gymClasses) {
    const entry = map.get(c.name) ?? { booked: 0, capacity: 0 };
    entry.booked += c.booked;
    entry.capacity += c.capacity;
    map.set(c.name, entry);
  }

  const byType: OccupancyType[] = [...map.entries()]
    .map(([name, v]) => ({
      name,
      booked: v.booked,
      capacity: v.capacity,
      pct: v.capacity > 0 ? Math.round((v.booked / v.capacity) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct);

  const totalBooked = gymClasses.reduce((a, c) => a + c.booked, 0);
  const totalCapacity = gymClasses.reduce((a, c) => a + c.capacity, 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
  const best = byType[0] ?? null;
  const worst = byType.length > 1 ? byType[byType.length - 1] : null;

  const finding =
    avgOccupancy >= 80
      ? `Tus clases colectivas están muy solicitadas (${avgOccupancy}% de ocupación media).`
      : avgOccupancy >= 60
        ? `La ocupación media de tus clases es del ${avgOccupancy}%, con margen de mejora.`
        : `La ocupación media de tus clases es baja (${avgOccupancy}%). Conviene reforzar la captación.`;

  const tips: string[] = [
    worst
      ? `Impulsa la clase con menor ocupación (${worst.name}, ${worst.pct}%) con recordatorios y promociones.`
      : "Revisa la ocupación por tipo de clase.",
    best
      ? `Aprovecha el tirón de ${best.name} (${best.pct}%) para atraer nuevos socios.`
      : "Mantén el nivel de las clases más demandadas.",
    "Pide feedback a los asistentes para ajustar intensidad y horarios.",
  ];

  return { totalClasses: gymClasses.length, avgOccupancy, byType, best, worst, finding, tips };
}

export interface PersonalTrainingAnalysis {
  totalSessions: number;
  clientsTrained: number;
  byClient: { name: string; count: number }[];
  finding: string;
  tips: string[];
}

export function getPersonalTrainingAnalysis(): PersonalTrainingAnalysis {
  const entries = getAllScheduleEntries().filter((e) => e.title.startsWith("Entrenamiento personal"));
  const byClientMap = new Map<string, number>();
  for (const e of entries) {
    const name = e.title.replace("Entrenamiento personal · ", "");
    byClientMap.set(name, (byClientMap.get(name) ?? 0) + 1);
  }
  const byClient = [...byClientMap.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const totalSessions = entries.length;
  const clientsTrained = byClient.length;

  const finding =
    totalSessions > 0
      ? `Tienes ${totalSessions} entrenamientos personales planificados repartidos entre ${clientsTrained} ${clientsTrained === 1 ? "cliente" : "clientes"}.`
      : "No hay entrenamientos personales planificados esta semana.";

  const tips: string[] = [
    "Registra las cargas de cada sesión personal para poder ajustar el progreso semana a semana.",
    "Combina el trabajo personal con la rutina asignada en el calendario para evitar solapes.",
    totalSessions >= 4
      ? "Con esta carga, reserva huecos de descanso y recuperación entre sesiones personales."
      : "Puedes ampliar la cartera con nuevos clientes para completar tu semana.",
  ];

  return { totalSessions, clientsTrained, byClient, finding, tips };
}

export interface TrainerClientsAnalysis {
  total: number;
  avgProgress: number;
  top: Client | null;
  lowest: Client | null;
  goals: { goal: string; count: number }[];
  finding: string;
  tips: string[];
}

export function getTrainerClientsAnalysis(): TrainerClientsAnalysis {
  const myClients = getMyClients();
  const total = myClients.length;
  const avgProgress = total > 0 ? Math.round(myClients.reduce((a, c) => a + c.progress, 0) / total) : 0;

  const sorted = [...myClients].sort((a, b) => b.progress - a.progress);
  const top = sorted[0] ?? null;
  const lowest = total > 1 ? sorted[sorted.length - 1] : null;

  const goalMap = new Map<string, number>();
  for (const c of myClients) goalMap.set(c.goal, (goalMap.get(c.goal) ?? 0) + 1);
  const goals = [...goalMap.entries()].map(([goal, count]) => ({ goal, count })).sort((a, b) => b.count - a.count);

  const finding =
    total > 0
      ? `Gestionas ${total} clientes con un progreso medio del ${avgProgress}%.`
      : "Todavía no tienes clientes asignados.";

  const tips: string[] = [
    lowest
      ? `Presta especial atención a ${lowest.name} (${lowest.progress}%): revisa su rutina y adherencia.`
      : "Mantén un seguimiento periódico de cada cliente.",
    top
      ? `El caso de ${top.name} (${top.progress}%) puede servir de ejemplo para motivar a los demás.`
      : "Documenta los buenos resultados para motivar al grupo.",
    "Ajusta las rutinas cada semana según el calendario para mantener la progresión.",
  ];

  return { total, avgProgress, top, lowest, goals, finding, tips };
}

export interface ClientCoaching {
  client: Client;
  target: number;
  completed: number;
  assigned: number;
  adherencePct: number;
  rhythm: "bueno" | "irregular" | "bajo";
  daysSinceLast: number | null;
  findings: string[];
  recommendations: string[];
}

function daysSinceLastWorkout(last: string): number | null {
  const t = last.trim().toLowerCase();
  if (t === "hoy") return 0;
  if (t === "ayer") return 1;
  const match = t.match(/hace\s+(\d+)\s+d/);
  if (match) return Number(match[1]);
  return null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Analiza el ritmo de cada cliente y propone cambios en su entrenamiento. */
export function getClientCoaching(): ClientCoaching[] {
  const monday = mondayOf(new Date());
  const weekSet = new Set(Array.from({ length: 7 }, (_, i) => toIso(addDays(monday, i))));

  return getMyClients().map((c) => {
    const target = parseInt(c.frequency, 10) || 0;
    const assigned = getScheduleForClient(c.id).filter((a) => weekSet.has(a.date)).length;
    const daysSinceLast = daysSinceLastWorkout(c.lastWorkout);

    // Sesiones completadas estimadas a partir del progreso del cliente.
    const factor = clamp(0.3 + (c.progress / 100) * 0.8, 0, 1);
    const completed = target > 0 ? Math.min(target, Math.round(target * factor)) : 0;
    const adherencePct = target > 0 ? Math.round((completed / target) * 100) : 0;

    const rhythm: ClientCoaching["rhythm"] =
      adherencePct >= 80 && (daysSinceLast === null || daysSinceLast <= 2)
        ? "bueno"
        : adherencePct >= 55
          ? "irregular"
          : "bajo";

    const findings: string[] = [
      `Completadas ${completed}/${target} sesiones esta semana (${adherencePct}%).`,
    ];
    if (daysSinceLast !== null) {
      findings.push(
        daysSinceLast === 0
          ? "Ha entrenado hoy."
          : `Última sesión hace ${daysSinceLast} ${daysSinceLast === 1 ? "día" : "días"}.`
      );
    }
    const missing = Math.max(0, target - assigned);
    if (missing > 0) {
      findings.push(`Calendario: faltan ${missing} ${missing === 1 ? "sesión" : "sesiones"} por asignar.`);
    }

    const recommendations: string[] = [];

    if (c.goal === "Pérdida de grasa") {
      recommendations.push("Refuerza el trabajo cardiovascular y acorta los descansos entre series.");
    } else if (c.goal === "Fuerza" || c.goal === "Hipertrofia") {
      recommendations.push("Aplica progresión de cargas y prioriza los básicos con series de 4-8 repeticiones.");
    } else if (c.goal === "Resistencia") {
      recommendations.push("Alterna series largas con intervalos para mejorar la capacidad aeróbica.");
    } else {
      recommendations.push("Mantén un trabajo equilibrado de fuerza y movilidad.");
    }

    if (rhythm === "bajo") {
      recommendations.push("Ritmo bajo: reduce el volumen por sesión y fija objetivos semanales realistas.");
    } else if (rhythm === "irregular") {
      recommendations.push("Ritmo irregular: insiste en la constancia antes de subir cargas.");
    }

    if (c.progress < 50) {
      recommendations.push(`Progreso por debajo de la media (${c.progress}%): simplifica la rutina y ajusta el volumen.`);
    } else if (c.progress >= 75) {
      recommendations.push(`Buen progreso (${c.progress}%): introduce variaciones para evitar el estancamiento.`);
    }

    const weightDelta = c.weight - c.targetWeight;
    if (Math.abs(weightDelta) >= 3) {
      recommendations.push(
        weightDelta > 0
          ? `Está a ${weightDelta.toLocaleString("es-ES")} kg del objetivo: ajusta volumen y cuida la recuperación.`
          : `Está ${Math.abs(weightDelta).toLocaleString("es-ES")} kg por debajo del objetivo: refuerza el trabajo de fuerza.`
      );
    }

    return { client: c, target, completed, assigned, adherencePct, rhythm, daysSinceLast, findings, recommendations };
  });
}

export interface CoachingSummary {
  total: number;
  avgAdherence: number;
  goodCount: number;
}

export function getCoachingSummary(coaching: ClientCoaching[]): CoachingSummary {
  const total = coaching.length;
  const avgAdherence = total > 0 ? Math.round(coaching.reduce((a, c) => a + c.adherencePct, 0) / total) : 0;
  const goodCount = coaching.filter((c) => c.rhythm === "bueno").length;
  return { total, avgAdherence, goodCount };
}

export interface TrainerReport {
  totalClients: number;
  totalClasses: number;
  avgOccupancy: number;
  routines: number;
  personalSessions: number;
  isWithinShift: boolean;
  verdict: string;
}

export function getTrainerReport(): TrainerReport {
  const classAnalysis = getTrainerClassAnalysis();
  const personal = getPersonalTrainingAnalysis();
  const myClients = getMyClients();
  const routines = getTrainerRoutines().length;

  // ¿Las actividades de hoy caben dentro del turno asignado?
  const trainer = findEmployeeById(CURRENT_TRAINER_ID);
  const today = toIso(new Date());
  const shift = getShiftForDate(trainer, today);
  const todayEntries = getAllScheduleEntries().filter((e) => e.date === today);
  const isWithinShift =
    !shift || todayEntries.every((e) => e.start >= shift.from && e.end <= shift.to);

  const verdict = `Gestionas ${myClients.length} clientes y ${classAnalysis.totalClasses} clases colectivas con una ocupación media del ${classAnalysis.avgOccupancy}% y ${personal.totalSessions} sesiones personales.`;

  return {
    totalClients: myClients.length,
    totalClasses: classAnalysis.totalClasses,
    avgOccupancy: classAnalysis.avgOccupancy,
    routines,
    personalSessions: personal.totalSessions,
    isWithinShift,
    verdict,
  };
}

/** Semana actual como rango de fechas (para etiquetas). */
export function currentWeekRange(): { from: string; to: string } {
  const monday = mondayOf(new Date());
  return { from: toIso(monday), to: toIso(addDays(monday, 6)) };
}
