import { useSyncExternalStore } from "react";
import { resolveGymClasses, classTypes, classSessions } from "./classes";
import { clients } from "./users";

export type AdminBookingStatus = "Confirmada" | "Pendiente" | "Finalizada" | "Cancelada";

export interface AdminBooking {
  id: string;
  clientId: string;
  clientName: string;
  classId: string;
  className: string;
  trainer: string;
  room: string;
  date: string;
  time: string;
  status: AdminBookingStatus;
}

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 31) + text.charCodeAt(i)) >>> 0;
  return h;
}

function dateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const MAX_BOOKINGS = 90;

function buildAdminBookings(): AdminBooking[] {
  const gymClasses = resolveGymClasses(classTypes, classSessions);
  const activeClients = clients.filter((c) => c.status === "active");

  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 60);
  const to = new Date(now);
  to.setDate(to.getDate() + 45);
  const fromKey = dateKey(from);
  const toKey = dateKey(to);
  const todayKey = dateKey(now);

  let pool = gymClasses.filter((c) => c.booked > 0 && c.date >= fromKey && c.date <= toKey);
  if (pool.length === 0) pool = gymClasses.filter((c) => c.booked > 0);
  pool = pool.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const out: AdminBooking[] = [];
  for (const gymClass of pool) {
    const rand = seededRandom(hash(gymClass.id));
    const count = Math.min(gymClass.booked, 8);
    const offset = Math.floor(rand() * activeClients.length);
    const step = 1 + Math.floor(rand() * (activeClients.length - 1));
    for (let i = 0; i < count; i++) {
      const client = activeClients[(offset + i * step) % activeClients.length];
      const roll = rand();
      const status: AdminBookingStatus =
        gymClass.date < todayKey
          ? roll < 0.12
            ? "Cancelada"
            : "Finalizada"
          : roll < 0.18
            ? "Pendiente"
            : "Confirmada";
      out.push({
        id: `${gymClass.id}-${client.id}-${i}`,
        clientId: client.id,
        clientName: client.name,
        classId: gymClass.id,
        className: gymClass.name,
        trainer: gymClass.trainer,
        room: gymClass.room,
        date: gymClass.date,
        time: gymClass.time,
        status,
      });
      if (out.length >= MAX_BOOKINGS) return out;
    }
  }
  return out;
}

let store: AdminBooking[] = buildAdminBookings();
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function getAdminBookings(): AdminBooking[] {
  return store;
}

export function getBookingById(id: string): AdminBooking | undefined {
  return store.find((b) => b.id === id);
}

export function subscribeAdminBookings(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateBookingStatus(id: string, status: AdminBookingStatus): void {
  store = store.map((b) => (b.id === id ? { ...b, status } : b));
  emit();
}

export function addAdminBooking(booking: AdminBooking): void {
  store = [booking, ...store];
  emit();
}

export function useAdminBookings(): AdminBooking[] {
  return useSyncExternalStore(subscribeAdminBookings, getAdminBookings, getAdminBookings);
}
