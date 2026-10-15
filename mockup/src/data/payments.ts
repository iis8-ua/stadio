import type { AccessMethod, AccessRecord, Payment } from "../types";

export const payments: Payment[] = [
  { id: "p6", month: "Agosto 2026", status: "Pagada", date: "01/08/2026" },
  { id: "p5", month: "Julio 2026", status: "Pagada", date: "01/07/2026" },
  { id: "p4", month: "Junio 2026", status: "Pendiente", date: undefined },
  { id: "p3", month: "Mayo 2026", status: "Pagada", date: "01/05/2026" },
  { id: "p2", month: "Abril 2026", status: "Pagada", date: "01/04/2026" },
  { id: "p1", month: "Marzo 2026", status: "Pagada", date: "01/03/2026" },
];

export const accessRecords: AccessRecord[] = [
  { id: "a1", day: "Viernes", date: "21 Agosto", entry: "10:32", exit: "12:08", method: "Pulsera NFC" },
  { id: "a2", day: "Miércoles", date: "19 Agosto", entry: "18:00", exit: "20:15", method: "Pulsera NFC" },
  { id: "a3", day: "Martes", date: "18 Agosto", entry: "09:10", exit: undefined, method: "Pulsera NFC" },
  { id: "a4", day: "Lunes", date: "17 Agosto", entry: "15:45", exit: "17:30", method: "Pulsera NFC" },
  { id: "a5", day: "Viernes", date: "14 Agosto", entry: "08:20", exit: "09:55", method: "Pulsera NFC" },
  { id: "a6", day: "Jueves", date: "13 Agosto", entry: "18:40", exit: "19:55", method: "Pulsera NFC" },
  { id: "a7", day: "Martes", date: "11 Agosto", entry: "10:00", exit: "11:45", method: "Pulsera NFC" },
  { id: "a8", day: "Sábado", date: "8 Agosto", entry: "11:30", exit: "13:00", method: "Pulsera NFC" },
  { id: "a9", day: "Viernes", date: "7 Agosto", entry: "09:00", exit: "10:20", method: "Pulsera NFC" },
  { id: "a10", day: "Lunes", date: "3 Agosto", entry: "16:00", exit: "17:50", method: "Pulsera NFC" },
  { id: "a11", day: "Sábado", date: "1 Agosto", entry: "12:15", exit: "14:00", method: "Pulsera NFC" },
  { id: "a12", day: "Viernes", date: "31 Julio", entry: "18:30", exit: "20:00", method: "Pulsera NFC" },
];

export interface AccessRecordItem extends AccessRecord {
  dayNum: number;
  month: string;
  year: number;
}

const MONTH_NAMES_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const WEEKDAY_ES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function getAccessRecordsByMonth(monthIndex: number, year: number): AccessRecordItem[] {
  if (monthIndex === 7 && year === 2026) {
    return accessRecords.map((a) => ({
      ...a,
      dayNum: Number.parseInt(a.date, 10) || 0,
      month: "Agosto",
      year: 2026,
    }));
  }
  const rand = seededRandom(year * 379 + (monthIndex + 1) * 61);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const count = 10 + Math.floor(rand() * 5);
  const records: AccessRecordItem[] = [];
  for (let i = 0; i < count; i++) {
    const day = 1 + Math.floor(rand() * daysInMonth);
    const d = new Date(year, monthIndex, day);
    const startMin = (7 + Math.floor(rand() * 12)) * 60 + [0, 15, 30, 45][Math.floor(rand() * 4)];
    const duration = 45 + Math.floor(rand() * 4) * 30;
    const endMin = startMin + duration;
    const fmt = (m: number) =>
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const hasExit = rand() > 0.15;
    // El acceso es solo con pulsera NFC en el torno; se deja el campo
    // por si en el futuro se incorpora otro método.
    const method: AccessMethod = "Pulsera NFC";
    records.push({
      id: `ac-${year}-${monthIndex}-${i}`,
      day: WEEKDAY_ES[d.getDay()],
      date: `${day} ${MONTH_NAMES_ES[monthIndex]}`,
      entry: fmt(startMin),
      exit: hasExit ? fmt(endMin) : undefined,
      method,
      dayNum: day,
      month: MONTH_NAMES_ES[monthIndex],
      year,
    });
  }
  return records.sort((a, b) => b.dayNum - a.dayNum);
}
