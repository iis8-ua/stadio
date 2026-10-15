import { classTypes, classSessions } from "./classes";

export interface RevenueMonth {
  month: string;
  revenue: number;
  occupancy: number;
}

export const monthlyLabels = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export const MONTHS_FULL = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const WEEKDAY_LETTERS: Record<number, string> = { 0: "D", 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S" };

const REVENUE_BASE = [18600, 21000, 23200, 21800, 25400, 24300, 26200, 24580, 26800, 25900, 28700, 30100];
const OCC_BASE = [52, 58, 64, 60, 68, 66, 70, 71, 73, 72, 75, 78];

function buildYear(year: number): RevenueMonth[] {
  const revFactor = year === 2024 ? 0.78 : year === 2025 ? 0.9 : 1;
  const occDelta = year === 2024 ? -8 : year === 2025 ? -3 : 0;
  return REVENUE_BASE.map((r, i) => ({
    month: monthlyLabels[i],
    revenue: Math.round(r * revFactor),
    occupancy: Math.max(30, OCC_BASE[i] + occDelta),
  }));
}

export const revenueYears = [2024, 2025, 2026];

export const revenueMonthlyByYear: Record<number, RevenueMonth[]> = {
  2024: buildYear(2024),
  2025: buildYear(2025),
  2026: buildYear(2026),
};

export function filterMonthlyData(year: number, from: number, to: number): RevenueMonth[] {
  const data = revenueMonthlyByYear[year] ?? revenueMonthlyByYear[2026];
  return data.slice(from, Math.min(to, data.length - 1) + 1);
}

export interface UsersMonth {
  month: string;
  active: number;
  total: number;
}

const USER_ACTIVE_BASE = [780, 850, 920, 900, 1000, 980, 1080, 1105, 1120, 1085, 1140, 1160];
const USER_TOTAL_BASE = [1010, 1080, 1140, 1120, 1190, 1180, 1230, 1247, 1260, 1230, 1290, 1310];

function buildUsersYear(year: number): UsersMonth[] {
  const factor = year === 2024 ? 0.8 : year === 2025 ? 0.92 : 1;
  return monthlyLabels.map((m, i) => ({
    month: m,
    active: Math.round(USER_ACTIVE_BASE[i] * factor),
    total: Math.round(USER_TOTAL_BASE[i] * factor),
  }));
}

export const usersEvolutionByYear: Record<number, UsersMonth[]> = {
  2024: buildUsersYear(2024),
  2025: buildUsersYear(2025),
  2026: buildUsersYear(2026),
};

export function filterUsersData(year: number, from: number, to: number): UsersMonth[] {
  const data = usersEvolutionByYear[year] ?? usersEvolutionByYear[2026];
  return data.slice(from, Math.min(to, data.length - 1) + 1);
}

const PEAK_BASE = [120, 190, 140, 170, 210, 310, 340, 200];
const HOURS = ["07h", "09h", "11h", "13h", "15h", "17h", "19h", "21h"];
const WEEKDAY_MUL: Record<string, number> = { D: 0.45, L: 0.95, M: 1.05, X: 1.0, J: 1.02, V: 1.15, S: 0.75 };

export function filterPeakHoursForDate(year: number, month: number, day: number): Array<{ hour: string; traffic: number }> {
  const letter = WEEKDAY_LETTERS[new Date(year, month, day).getDay()] ?? "L";
  const yearFactor = year === 2024 ? 0.82 : year === 2025 ? 0.92 : 1;
  const weekdayMul = WEEKDAY_MUL[letter] ?? 1;
  return PEAK_BASE.map((t, i) => ({
    hour: HOURS[i],
    traffic: Math.max(10, Math.round(t * yearFactor * weekdayMul)),
  }));
}

const YEAR_FACTOR = (y: number): number => (y === 2024 ? 0.82 : y === 2025 ? 0.92 : 1);
const MONTH_JITTER = [0.92, 0.96, 1.0, 0.97, 1.05, 1.02, 1.06, 1.07, 1.08, 1.06, 1.09, 1.11];

const TYPE_BASE_OCC: Record<string, number> = (() => {
  const acc: Record<string, { sum: number; n: number }> = {};
  for (const s of classSessions) {
    const e = (acc[s.classTypeId] ??= { sum: 0, n: 0 });
    e.sum += s.booked / s.capacity;
    e.n += 1;
  }
  const out: Record<string, number> = {};
  for (const t of classTypes) {
    const e = acc[t.id];
    out[t.id] = e ? (e.sum / e.n) * 100 : 60;
  }
  return out;
})();

export function filterPopularClasses(year: number, from: number, to: number): Array<{ name: string; value: number }> {
  const yearFactor = YEAR_FACTOR(year);
  const monthsCovered = to - from + 1;
  return classTypes
    .map((t) => {
      const real = classSessions.filter((s) => {
        if (s.classTypeId !== t.id) return false;
        const [sy, smStr] = s.date.split("-").map(Number);
        const sm = smStr - 1;
        return sy === year && sm >= from && sm <= to;
      });
      let avg: number;
      if (real.length > 0) {
        avg = (real.reduce((acc, s) => acc + s.booked / s.capacity, 0) / real.length) * 100;
      } else {
        let sum = 0;
        for (let m = from; m <= to; m++) {
          sum += Math.max(5, Math.min(100, TYPE_BASE_OCC[t.id] * yearFactor * MONTH_JITTER[m]));
        }
        avg = sum / monthsCovered;
      }
      return { name: t.name, value: Math.round(avg) };
    })
    .sort((a, b) => b.value - a.value);
}

export function filterDailyEntries(year: number, month: number): Array<{ day: string; entries: number }> {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const factor = year === 2024 ? 0.82 : year === 2025 ? 0.92 : 1;
  return Array.from({ length: daysInMonth }, (_, i) => {
    const dow = new Date(year, month, i + 1).getDay();
    const weekendFactor = dow === 0 ? 0.35 : dow === 6 ? 0.6 : 1;
    const seed = ((year * 100 + (month + 1)) * 31 + i + 1) >>> 0;
    const jitter = 0.88 + ((seed % 24) / 100);
    return { day: String(i + 1), entries: Math.max(5, Math.round(155 * factor * weekendFactor * jitter)) };
  });
}

const INACTIVE_BASE = [230, 230, 220, 220, 190, 200, 150, 142, 140, 145, 150, 150];
const BOOKINGS_BASE = [580, 620, 680, 640, 720, 700, 750, 712, 760, 730, 780, 810];
const ACCESSES_BASE = [125, 132, 145, 138, 152, 148, 160, 155, 162, 158, 168, 175];

export interface StatMonth {
  revenue: number;
  bookings: number;
  activeUsers: number;
  accesses: number;
}

export function getStatMonth(year: number, month: number): StatMonth {
  const factor = year === 2024 ? 0.78 : year === 2025 ? 0.9 : 1;
  return {
    revenue: Math.round(REVENUE_BASE[month] * factor),
    bookings: Math.round(BOOKINGS_BASE[month] * factor),
    activeUsers: Math.round(USER_ACTIVE_BASE[month] * factor),
    accesses: Math.round(ACCESSES_BASE[month] * factor),
  };
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function filterDistribution(year: number, _from: number, to: number): Array<{ name: string; value: number; color: string }> {
  const factor = year === 2024 ? 0.82 : year === 2025 ? 0.92 : 1;
  const targetMonth = Math.min(to, 11);
  return [
    { name: "Activos", value: Math.round(USER_ACTIVE_BASE[targetMonth] * factor), color: "#16a34a" },
    { name: "Inactivos", value: Math.round(INACTIVE_BASE[targetMonth] * factor), color: "#8a8a8a" },
  ];
}

export interface RetentionMonth {
  month: string;
  retention: number;
}

const RETENTION_BASE = [68, 70, 72, 71, 74, 75, 76, 77, 78, 78, 79, 80];

function buildRetentionYear(year: number): RetentionMonth[] {
  const delta = year === 2024 ? -6 : year === 2025 ? -3 : 0;
  return monthlyLabels.map((m, i) => ({
    month: m,
    retention: Math.max(30, RETENTION_BASE[i] + delta),
  }));
}

export const retentionByYear: Record<number, RetentionMonth[]> = {
  2024: buildRetentionYear(2024),
  2025: buildRetentionYear(2025),
  2026: buildRetentionYear(2026),
};

export function filterRetentionData(year: number, from: number, to: number): RetentionMonth[] {
  const data = retentionByYear[year] ?? retentionByYear[2026];
  return data.slice(from, Math.min(to, data.length - 1) + 1);
}

export const coachResponses = [
  "¡Buen trabajo hoy, Israel! Mantén la constancia y verás resultados en pocas semanas. 💪",
  "Te veo con buen nivel en el press. Subimos 2,5 kg la próxima sesión.",
  "Recuerda descansar 2 minutos en las series pesadas para máximo rendimiento.",
];

export const chats = [
  { role: "coach", text: "¡Buenos días Israel! ¿Cómo te fue con la rutina de ayer?" },
  { role: "client", text: "¡Muy bien Carlos! Terminé todas las series y me siento fuerte." },
  { role: "coach", text: "¡Excelente! Hoy toca descanso activo. 20 min de cardio suave." },
  { role: "client", text: "Perfecto, lo haré por la tarde. 👍" },
];
