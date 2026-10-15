import type { Workout } from "../../types";
import { currentWorkout } from "../../data/workouts";

let list: Workout[] = [currentWorkout];
let activeRoutineId: string = currentWorkout.id;

export function getClientRoutines(): Workout[] {
  return list;
}

export function getActiveRoutine(): Workout {
  return list.find((w) => w.id === activeRoutineId) ?? list[0];
}

export function setActiveRoutine(id: string): void {
  const exists = list.some((w) => w.id === id);
  if (exists) activeRoutineId = id;
}

export function addClientRoutine(workout: Workout): void {
  list = [...list, workout];
  activeRoutineId = workout.id;
}

export function updateClientRoutine(id: string, workout: Workout): void {
  list = list.map((w) => (w.id === id ? { ...workout, id } : w));
  activeRoutineId = id;
}

export function deleteClientRoutine(id: string): void {
  const remaining = list.filter((w) => w.id !== id);
  if (remaining.length === 0) {
    list = [currentWorkout];
    activeRoutineId = currentWorkout.id;
    return;
  }
  list = remaining;
  if (activeRoutineId === id) activeRoutineId = remaining[0].id;
}