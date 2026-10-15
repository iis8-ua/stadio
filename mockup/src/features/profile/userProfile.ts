import { useSyncExternalStore } from "react";
import { findEmployeeById } from "../../data/employees";
import { users } from "../../data/users";
import { CURRENT_TRAINER_ID } from "../trainer/personalTrainer";

export type EditableRole = "trainer" | "admin";

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  sex: string;
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
  /** Foto de perfil (data URL). Si no existe, se muestran las iniciales. */
  avatar?: string;
}

const STORAGE_KEY = "stadio.userProfiles";

function defaultProfiles(): Record<EditableRole, UserProfileData> {
  const trainer = findEmployeeById(CURRENT_TRAINER_ID);
  const admin = users.find((u) => u.role === "admin");
  return {
    trainer: {
      name: trainer?.name ?? "Entrenador",
      email: trainer?.email ?? "",
      phone: trainer?.phone ?? "",
      sex: trainer?.sex ?? "Hombre",
      birthDate: trainer?.birthDate ?? "",
      address: trainer?.address ?? "",
      city: trainer?.city ?? "",
      postalCode: trainer?.postalCode ?? "",
    },
    admin: {
      name: admin?.name ?? "Administrador",
      email: admin?.email ?? "",
      phone: "+34 965 000 000",
      sex: "Mujer",
      birthDate: "18/06/1987",
      address: "Avenida Maisonnave 24",
      city: "Alicante",
      postalCode: "03001",
    },
  };
}

function readStored(): Record<EditableRole, UserProfileData> {
  const base = defaultProfiles();
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Record<EditableRole, UserProfileData>>;
    return {
      trainer: { ...base.trainer, ...parsed.trainer },
      admin: { ...base.admin, ...parsed.admin },
    };
  } catch {
    return base;
  }
}

let profiles: Record<EditableRole, UserProfileData> = readStored();
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function persist(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function subscribeUserProfiles(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getProfiles(): Record<EditableRole, UserProfileData> {
  return profiles;
}

export function updateUserProfile(role: EditableRole, patch: Partial<UserProfileData>): void {
  profiles = { ...profiles, [role]: { ...profiles[role], ...patch } };
  persist();
  emit();
}

/** Perfil editable (entrenador o administrador) reactivo a los cambios (RF-08). */
export function useUserProfile(role: EditableRole): UserProfileData {
  return useSyncExternalStore(
    subscribeUserProfiles,
    () => profiles[role],
    () => profiles[role]
  );
}
