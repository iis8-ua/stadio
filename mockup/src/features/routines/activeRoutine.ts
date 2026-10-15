import type { Workout } from "../../types";
import { currentClient } from "../../data/users";
import { getActiveRoutine, getClientRoutines } from "./clientRoutines";
import { getClientActiveEntry } from "./routineAssignments";
import { getTrainerRoutine } from "./trainerRoutines";

/**
 * Id de la rutina seleccionada actualmente por el cliente (asignada o propia).
 * Permite que la vista de la rutina y la de entrenamiento usen la misma.
 */
let selectedRoutineId: string | null = null;

export function setSelectedRoutineId(id: string | null): void {
  selectedRoutineId = id;
}

export function getSelectedRoutine(): Workout | undefined {
  if (!selectedRoutineId) return undefined;
  return getTrainerRoutine(selectedRoutineId) ?? getClientRoutines().find((w) => w.id === selectedRoutineId);
}

export interface ClientAssignedRoutine {
  date: string;
  routine: Workout;
}

/** Rutina actualmente asignada al cliente (o null si no tiene ninguna). */
export function getClientAssignedRoutine(clientId: string = currentClient.id): ClientAssignedRoutine | null {
  const entry = getClientActiveEntry(clientId);
  if (!entry) return null;
  const routine = getTrainerRoutine(entry.routineId);
  if (!routine) return null;
  return { date: entry.date, routine };
}

/** Rutina activa efectiva: la seleccionada, si no la asignada, si no la propia del cliente. */
export function getEffectiveActiveRoutine(clientId: string = currentClient.id): Workout {
  const selected = getSelectedRoutine();
  if (selected) return selected;
  const assigned = getClientAssignedRoutine(clientId);
  if (assigned) return assigned.routine;
  return getActiveRoutine();
}
