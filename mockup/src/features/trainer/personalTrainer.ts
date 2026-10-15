/**
 * Relación cliente ↔ entrenador personal (en memoria).
 *
 * Estados posibles de un cliente:
 *  - Sin contratar: no está en el store (o requested = false).
 *  - Solicitado:    requested = true y sin trainerId (pendiente de asignar por el admin).
 *  - Asignado:      requested = true y con trainerId.
 */

import type { PersonalTrainerInfo } from "../../types";

export type { PersonalTrainerInfo };

/**
 * Relación cliente ↔ entrenador personal (en memoria).
 *
 * Estados posibles de un cliente:
 *  - Sin contratar: no está en el store (o requested = false).
 *  - Solicitado:    requested = true y sin trainerId (pendiente de asignar por el admin).
 *  - Asignado:      requested = true y con trainerId.
 */

/** Entrenador personal que tiene la sesión iniciada en el portal de entrenador. */
export const CURRENT_TRAINER_ID = "emp1";

const store = new Map<string, PersonalTrainerInfo>();

// Datos de ejemplo para que el admin/entrenador tengan contenido.
store.set("c2", { requested: true, trainerId: "emp1", since: "01 Sep 2026" });
store.set("c4", { requested: true, trainerId: "emp1", since: "15 Ago 2026" });
store.set("c3", { requested: true });

function todayLabel(): string {
  const d = new Date();
  const s = d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getPersonalTrainerInfo(clientId: string): PersonalTrainerInfo {
  return store.get(clientId) ?? { requested: false };
}

export function isPersonalTrainerRequested(clientId: string): boolean {
  return getPersonalTrainerInfo(clientId).requested;
}

export function getAssignedTrainerId(clientId: string): string | undefined {
  return getPersonalTrainerInfo(clientId).trainerId;
}

/** El cliente contrata el entrenador personal. */
export function requestPersonalTrainer(clientId: string): void {
  store.set(clientId, { requested: true });
}

/** El cliente se da de baja (o cancela la solicitud). */
export function cancelPersonalTrainer(clientId: string): void {
  store.delete(clientId);
}

/** El admin asigna un entrenador concreto al cliente. */
export function assignPersonalTrainer(clientId: string, trainerId: string): void {
  store.set(clientId, { requested: true, trainerId, since: todayLabel() });
}

/** El admin quita el entrenador pero mantiene la solicitud (queda pendiente). */
export function removePersonalTrainer(clientId: string): void {
  const info = store.get(clientId);
  if (info?.requested) {
    store.set(clientId, { requested: true });
  } else {
    store.delete(clientId);
  }
}

/** ¿Está este cliente asignado a algún entrenador personal? */
export function hasPersonalTrainer(clientId: string): boolean {
  return Boolean(getAssignedTrainerId(clientId));
}
