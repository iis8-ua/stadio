import type { Booking } from "../../types";
import { bookings as initialBookings } from "../../data/classes";

let list: Booking[] = [...initialBookings];

export function getBookings(): Booking[] {
  return list;
}

const DAY_KEY: Record<number, string> = { 0: "D", 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S" };

export function isClassBooked(classId: string, day: string): boolean {
  return list.some((b) => b.classId === classId && b.day === day && b.status === "confirmed");
}

export function getBookingForClass(classId: string, day: string): Booking | undefined {
  return list.find((b) => b.classId === classId && b.day === day && b.status === "confirmed");
}

export function addBooking(booking: Booking): void {
  list = [...list, booking];
}

export function cancelBooking(id: string): void {
  list = list.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b));
}

const MONTH_FULL = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];
const CLASS_POOL = ["Spinning", "Yoga", "HIIT", "Pilates", "Boxeo", "CrossFit", "Zumba"];
const TIME_POOL = ["17:30", "18:30", "19:00", "19:30", "20:00", "20:30"];
const TRAINERS: Record<string, string> = {
  Spinning: "Carlos",
  Yoga: "Marta",
  HIIT: "Diego",
  Pilates: "Marta",
  Boxeo: "Diego",
  CrossFit: "Diego",
  Zumba: "Sara",
};

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function getBookingsByMonth(monthIndex: number, year: number): Booking[] {
  const key = `${MONTH_FULL[monthIndex]} ${year}`;
  const existing = list.filter((b) => b.month === key);
  if (existing.length > 0) return existing;

  const rand = seededRandom(year * 853 + (monthIndex + 1) * 47);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const count = 6 + Math.floor(rand() * 4);
  const isFuture = year > 2026 || (year === 2026 && monthIndex > 8);
  const output: Booking[] = [];

  for (let i = 0; i < count; i++) {
    const name = CLASS_POOL[Math.floor(rand() * CLASS_POOL.length)];
    const day = 1 + Math.floor(rand() * daysInMonth);
    const time = TIME_POOL[Math.floor(rand() * TIME_POOL.length)];
    let status: Booking["status"] = isFuture ? "confirmed" : "past";
    if (i === count - 2) status = "cancelled";
    output.push({
      id: `gb-${year}-${monthIndex}-${i}`,
      classId: `gx-${i}`,
      className: name,
      day: DAY_KEY[new Date(year, monthIndex, day).getDay()],
      date: `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      time,
      trainer: TRAINERS[name],
      month: key,
      status,
    });
  }

  return output;
}