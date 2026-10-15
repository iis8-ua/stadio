import type { Workout } from "../../types";
import { workouts as seedWorkouts } from "../../data/workouts";
import { CURRENT_TRAINER_ID } from "../trainer/personalTrainer";

/**
 * Biblioteca de rutinas del entrenador (en memoria).
 * Se siembra a partir de las rutinas de ejemplo, con ids propios ("tr-…")
 * para no chocar con las rutinas propias del cliente.
 */
let list: Workout[] = seedWorkouts.map((w) => ({
  ...w,
  id: `tr-${w.id}`,
  trainerId: CURRENT_TRAINER_ID,
}));

export function getTrainerRoutines(): Workout[] {
  return list;
}

export function getTrainerRoutine(id: string): Workout | undefined {
  return list.find((w) => w.id === id);
}

export function addTrainerRoutine(workout: Workout): void {
  list = [...list, { ...workout, trainerId: CURRENT_TRAINER_ID }];
}

export function updateTrainerRoutine(id: string, workout: Workout): void {
  list = list.map((w) => (w.id === id ? { ...workout, id, trainerId: w.trainerId ?? CURRENT_TRAINER_ID } : w));
}

export function deleteTrainerRoutine(id: string): void {
  list = list.filter((w) => w.id !== id);
}
