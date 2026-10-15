import { useSyncExternalStore } from "react";
import { currentClient } from "../../data/users";

export interface BankAccount {
  holder: string;
  iban: string;
  /** El cliente autoriza el cobro automático de la cuota. */
  autoCharge: boolean;
}

export interface ClientProfileData {
  name: string;
  email: string;
  phone: string;
  sex: "Hombre" | "Mujer";
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
  weight: number;
  targetWeight: number;
  goal: string;
  frequency: string;
  /** Foto de perfil (data URL). Si no existe, se muestran las iniciales. */
  avatar?: string;
  /** ¿Ha verificado el cliente su correo electrónico? (RF-97) */
  emailVerified: boolean;
  bankAccount?: BankAccount;
}

const STORAGE_KEY = "stadio.clientProfile";

function defaultProfile(): ClientProfileData {
  return {
    name: currentClient.name,
    email: currentClient.email,
    phone: currentClient.phone,
    sex: "Hombre",
    birthDate: "15/03/1995",
    address: "Calle Mayor 24",
    city: "Madrid",
    postalCode: "28013",
    weight: 75.4,
    targetWeight: 72,
    goal: currentClient.goal,
    frequency: currentClient.frequency,
    emailVerified: false,
    bankAccount: {
      holder: currentClient.name,
      iban: "ES9121000418450200051332",
      autoCharge: true,
    },
  };
}

function readStored(): ClientProfileData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...defaultProfile(), ...(JSON.parse(raw) as Partial<ClientProfileData>) };
  } catch {
    return null;
  }
}

let profile: ClientProfileData = readStored() ?? defaultProfile();
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function subscribeClientProfile(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getClientProfile(): ClientProfileData {
  return profile;
}

export function updateClientProfile(data: Partial<ClientProfileData>): void {
  profile = { ...profile, ...data };
  persist();
  emit();
}

/** Perfil del cliente reactivo a los cambios (RF-08). */
export function useClientProfile(): ClientProfileData {
  return useSyncExternalStore(subscribeClientProfile, getClientProfile, getClientProfile);
}

/** Oculta el IBAN dejando visibles solo los últimos dígitos. */
export function maskIban(iban: string): string {
  const clean = iban.replace(/\s+/g, "").toUpperCase();
  if (clean.length <= 4) return clean;
  const groups = "**** **** **** **** ****";
  return `${groups} ${clean.slice(-4)}`;
}

/** Valida de forma básica el formato de un IBAN. */
export function isValidIban(iban: string): boolean {
  const clean = iban.replace(/\s+/g, "").toUpperCase();
  return /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(clean);
}

/** ¿Ha verificado el cliente su correo electrónico? (RF-97) */
export function isEmailVerified(): boolean {
  return Boolean(profile.emailVerified);
}

/** Marca el correo del cliente como verificado (RF-97). */
export function verifyClientEmail(): void {
  updateClientProfile({ emailVerified: true });
}

/** ¿Tiene el cliente una cuenta bancaria configurada? (RF-57) */
export function hasBankAccount(): boolean {
  return Boolean(profile.bankAccount?.iban);
}

/** ¿Está activo el cobro automático? (RF-57) */
export function isAutoChargeEnabled(): boolean {
  return Boolean(profile.bankAccount?.iban && profile.bankAccount.autoCharge);
}
