export interface OccupancyPoint {
  time: string;
  label: string;
  people: number;
}

export const aforoCurrent = {
  people: 142,
  capacity: 200,
  status: "Abierto" as const,
  closeTime: "22:00",
};

export const occupancyToday: OccupancyPoint[] = [
  { time: "07:00", label: "07:00", people: 45 },
  { time: "08:00", label: "08:00", people: 92 },
  { time: "09:00", label: "09:00", people: 64 },
  { time: "10:00", label: "10:00", people: 41 },
  { time: "11:00", label: "11:00", people: 36 },
  { time: "12:00", label: "12:00", people: 58 },
  { time: "13:00", label: "13:00", people: 82 },
  { time: "14:00", label: "14:00", people: 49 },
  { time: "15:00", label: "15:00", people: 38 },
  { time: "16:00", label: "16:00", people: 55 },
  { time: "17:00", label: "17:00", people: 96 },
  { time: "18:00", label: "18:00", people: 148 },
  { time: "19:00", label: "19:00", people: 142 },
];

export const occupancyForecast: OccupancyPoint[] = [
  { time: "20:00", label: "20:00", people: 118 },
  { time: "21:00", label: "21:00", people: 82 },
  { time: "22:00", label: "22:00", people: 28 },
];

export const nowTime = "19:30";

export const currentDayNumber = new Date().getDate();
export const currentMonthIndex = new Date().getMonth();
export const currentFullYear = new Date().getFullYear();

const baseHourly: OccupancyPoint[] = [
  { time: "07:00", label: "07:00", people: 45 },
  { time: "08:00", label: "08:00", people: 92 },
  { time: "09:00", label: "09:00", people: 64 },
  { time: "10:00", label: "10:00", people: 41 },
  { time: "11:00", label: "11:00", people: 36 },
  { time: "12:00", label: "12:00", people: 58 },
  { time: "13:00", label: "13:00", people: 82 },
  { time: "14:00", label: "14:00", people: 49 },
  { time: "15:00", label: "15:00", people: 38 },
  { time: "16:00", label: "16:00", people: 55 },
  { time: "17:00", label: "17:00", people: 96 },
  { time: "18:00", label: "18:00", people: 148 },
  { time: "19:00", label: "19:00", people: 142 },
  { time: "20:00", label: "20:00", people: 118 },
  { time: "21:00", label: "21:00", people: 82 },
  { time: "22:00", label: "22:00", people: 28 },
];

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function getOccupancyByDay(day: number, monthIndex: number, year: number): OccupancyPoint[] {
  if (day === currentDayNumber && monthIndex === currentMonthIndex && year === currentFullYear) return occupancyToday;
  const rand = seededRandom(day * 1000 + (monthIndex + 1) * 137 + year * 7);
  const weekday = new Date(year, monthIndex, day).getDay();
  const weekend = weekday === 0 || weekday === 6;
  return baseHourly.map((p) => {
    const factor = 0.82 + rand() * 0.36;
    const weekendFactor = weekend ? 0.55 : 1;
    const people = Math.max(8, Math.round((p.people * factor * weekendFactor) / 5) * 5);
    return { ...p, people };
  });
}

export function getOccupancyDayLabel(day: number, monthIndex: number, year: number): { weekday: string; date: string } {
  const d = new Date(year, monthIndex, day);
  const weekday = d.toLocaleDateString("es-ES", { weekday: "long" });
  const date = d.toLocaleDateString("es-ES", { day: "numeric", month: "long" });
  return { weekday, date };
}