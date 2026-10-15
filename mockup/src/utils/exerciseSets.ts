import type { ExerciseSet } from "../types";

let setCounter = 0;

/** Crea una serie vacía con un id único. */
export function newSet(partial?: Partial<ExerciseSet>): ExerciseSet {
  return {
    id: `set-${++setCounter}`,
    weight: "",
    reps: "",
    rest: "",
    rir: "",
    rpe: "",
    ...partial,
  };
}
