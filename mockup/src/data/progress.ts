export const PROGRESS_YEARS = [2024, 2025, 2026];

export const MONTHS_FULL = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const MONTHS_FLAT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function benchSeries(year: number, from: number, to: number): { label: string; kg: number }[] {
  const out = [];
  for (let m = from; m <= to; m++) {
    const monthsFrom = (year - 2024) * 12 + m - 8;
    const kg = Math.round(40 + monthsFrom * 2.08);
    out.push({ label: MONTHS_FLAT[m], kg });
  }
  return out;
}

/** Carga base por ejercicio (datos de ejemplo). */
const EXERCISE_BASE: Record<string, number> = {
  "Press banca": 40,
  "Press inclinado": 30,
  "Sentadilla": 70,
  "Peso muerto rumano": 60,
  "Press militar": 25,
  "Remo con barra": 45,
  "Dominadas": 5,
};

export const PROGRESS_EXERCISES = Object.keys(EXERCISE_BASE);

/** Evolución de carga de un ejercicio concreto. */
export function exerciseLoadSeries(
  name: string,
  year: number,
  from: number,
  to: number
): { label: string; kg: number }[] {
  const base = EXERCISE_BASE[name] ?? 40;
  const out = [];
  for (let m = from; m <= to; m++) {
    const monthsFrom = (year - 2024) * 12 + m - 8;
    const kg = Math.max(0, Math.round((base + monthsFrom * 2.08) * 10) / 10);
    out.push({ label: MONTHS_FLAT[m], kg });
  }
  return out;
}

export function bodyWeightSeries(year: number, from: number, to: number, currentWeight: number): { label: string; kg: number }[] {
  const initial = 80;
  const total = (2026 - 2024) * 12 + 8 - 3;
  const out = [];
  for (let m = from; m <= to; m++) {
    const elapsed = (year - 2024) * 12 + m - 3;
    const kg = Math.round((initial - (initial - currentWeight) * (elapsed / total)) * 10) / 10;
    out.push({ label: MONTHS_FLAT[m], kg });
  }
  return out;
}

export function volumeMonthlySeries(year: number, from: number, to: number): { label: string; kg: number }[] {
  const out = [];
  for (let m = from; m <= to; m++) {
    const monthsFrom = (year - 2024) * 12 + m - 8;
    const base = 5200 + 40 * monthsFrom;
    const jitter = seeded(year * 131 + m * 17)() * 500;
    const kg = Math.round((base + jitter) / 50) * 50;
    out.push({ label: MONTHS_FLAT[m], kg });
  }
  return out;
}

export function volumeWeeklySeries(year: number, from: number, to: number): { label: string; kg: number }[] {
  const out = [];
  for (let m = from; m <= to; m++) {
    const monthsFrom = (year - 2024) * 12 + m - 8;
    const monthBase = 5200 + 40 * monthsFrom;
    const days = new Date(year, m + 1, 0).getDate();
    let week = 1;
    for (let d = 1; d <= days; d += 7) {
      const rand = seeded(year * 977 + m * 41 + week)();
      const factor = 0.85 + rand * 0.3;
      const kg = Math.round(((monthBase / 2.2) * factor) / 50) * 50;
      const s = new Date(year, m, d).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
      out.push({ label: s.charAt(0).toUpperCase() + s.slice(1), kg });
      week++;
    }
  }
  return out;
}