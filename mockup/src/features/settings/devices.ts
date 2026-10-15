import { useSyncExternalStore } from "react";

/** Dispositivo (torno/lector NFC) con su token de Sanctum (RF-80). */
export interface Device {
  id: string;
  name: string;
  location: string;
  active: boolean;
  lastConnection: string;
  /** Vista parcial del token; el token completo solo se muestra al crearlo. */
  tokenPreview?: string;
}

const STORAGE_KEY = "stadio.devices";

function defaultDevices(): Device[] {
  return [
    { id: "dev-1", name: "Torno entrada principal", location: "Recepción", active: true, lastConnection: "Hoy · 10:32" },
    { id: "dev-2", name: "Torno sala de clases", location: "Planta 1", active: true, lastConnection: "Hoy · 09:15" },
    { id: "dev-3", name: "Lector vestuario", location: "Vestuarios", active: false, lastConnection: "12 Ago 2026" },
  ];
}

function readStored(): Device[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Device[]) : null;
  } catch {
    return null;
  }
}

let devices: Device[] = readStored() ?? defaultDevices();
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function subscribeDevices(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDevices(): Device[] {
  return devices;
}

export function useDevices(): Device[] {
  return useSyncExternalStore(subscribeDevices, getDevices, getDevices);
}

/** Genera un token simulado para el dispositivo. */
function generateToken(): string {
  const chars = "abcdef0123456789";
  let out = "";
  for (let i = 0; i < 24; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `dev_${out}`;
}

/**
 * Registra un dispositivo y devuelve su token (que solo se muestra una vez).
 * El token se guarda hasheado en el backend (aquí solo se conserva una vista parcial).
 */
export function addDevice(name: string, location: string): string {
  const token = generateToken();
  devices = [
    ...devices,
    {
      id: `dev-${Date.now()}`,
      name: name.trim(),
      location: location.trim() || "—",
      active: true,
      lastConnection: "Nunca",
      tokenPreview: `${token.slice(0, 8)}…${token.slice(-4)}`,
    },
  ];
  persist();
  emit();
  return token;
}

/** Revoca (elimina) un dispositivo y su token. */
export function revokeDevice(id: string): void {
  devices = devices.filter((d) => d.id !== id);
  persist();
  emit();
}
