import type { Exercise, ExerciseSet, RoutineExercise, Workout } from "../types";

/**
 * Ejercicios de ejemplo usados por las rutinas de demostración de este fichero.
 * La biblioteca real de ejercicios vive en `data/exercises.ts` (importada de wger).
 */
const demoExercises: Exercise[] = [
  { id: "e1", name: "Press banca", muscle: "Pecho", description: "Empuje horizontal con barra sobre banco plano." },
  { id: "e2", name: "Press inclinado", muscle: "Pecho", description: "Empuje con barra en banco inclinado (porción superior del pecho)." },
  { id: "e3", name: "Aperturas", muscle: "Pecho", description: "Aducción de brazos con mancuernas o poleas." },
  { id: "e4", name: "Fondos", muscle: "Tríceps", description: "Extensión de codo en paralelas o banco." },
  { id: "e5", name: "Extensión en polea", muscle: "Tríceps", description: "Extensión de codo en polea alta." },
  { id: "e6", name: "Press francés", muscle: "Tríceps", description: "Extensión de codo tumbado con barra." },
  { id: "e7", name: "Dominadas", muscle: "Espalda", description: "Tracción vertical en barra fija." },
  { id: "e8", name: "Remo con barra", muscle: "Espalda", description: "Tracción horizontal con barra." },
  { id: "e9", name: "Jalón al pecho", muscle: "Espalda", description: "Tracción vertical en polea." },
  { id: "e10", name: "Sentadilla", muscle: "Pierna", description: "Flexión de rodillas con barra, ejercicio básico de pierna." },
  { id: "e11", name: "Prensa", muscle: "Pierna", description: "Empuje de piernas en máquina guiada." },
  { id: "e12", name: "Peso muerto rumano", muscle: "Pierna", description: "Bisagra de cadera con barra (isquios y glúteo)." },
  { id: "e13", name: "Press militar", muscle: "Hombro", description: "Empuje vertical con barra o mancuernas." },
  { id: "e14", name: "Elevaciones laterales", muscle: "Hombro", description: "Abducción de hombro con mancuernas." },
  { id: "e15", name: "Curl con barra", muscle: "Bíceps", description: "Flexión de codo con barra." },
  { id: "e16", name: "Martillo", muscle: "Bíceps", description: "Curl neutro con mancuernas." },
  { id: "e17", name: "Curl concentrado", muscle: "Bíceps", description: "Curl de bíceps apoyado en banco." },
  { id: "e18", name: "Plancha", muscle: "Core", description: "Isométrico de core en antebrazos." },
  { id: "e19", name: "Crunch", muscle: "Core", description: "Flexión de tronco para abdominales." },
  { id: "e20", name: "Elevación de piernas", muscle: "Core", description: "Elevación de piernas colgado o tumbado." },
];

let setSeq = 0;

function sets(count: number, reps: string, rest: string): ExerciseSet[] {
  return Array.from({ length: count }, () => ({
    id: `set-${++setSeq}`,
    weight: "",
    reps,
    rest,
    rir: "",
    rpe: "",
  }));
}

/** Entrada de un ejercicio dentro de una rutina (con sus series individuales). */
function rx(exercise: Exercise, count: number, reps: string, rest: string): RoutineExercise {
  return {
    id: exercise.id,
    exerciseId: exercise.id,
    name: exercise.name,
    muscle: exercise.muscle,
    sets: sets(count, reps, rest),
  };
}

export const workouts: Workout[] = [
  {
    id: "w1",
    name: "Pecho + Tríceps",
    goal: "Hipertrofia",
    frequency: "2 días/semana",
    exercises: [rx(demoExercises[0], 4, "8", "120"), rx(demoExercises[1], 3, "8", "90"), rx(demoExercises[2], 3, "10", "60"), rx(demoExercises[4], 3, "12", "60"), rx(demoExercises[5], 3, "10", "90")],
  },
  {
    id: "w2",
    name: "Espalda + Bíceps",
    goal: "Hipertrofia",
    frequency: "2 días/semana",
    exercises: [rx(demoExercises[6], 4, "8", "120"), rx(demoExercises[7], 4, "8", "90"), rx(demoExercises[8], 3, "10", "90"), rx(demoExercises[14], 3, "10", "60"), rx(demoExercises[16], 3, "10", "60")],
  },
  {
    id: "w3",
    name: "Pierna + Core",
    goal: "Fuerza",
    frequency: "2 días/semana",
    exercises: [rx(demoExercises[9], 4, "8", "150"), rx(demoExercises[10], 4, "10", "120"), rx(demoExercises[11], 3, "8", "120"), rx(demoExercises[18], 3, "20", "45"), rx(demoExercises[19], 3, "15", "60")],
  },
  {
    id: "w4",
    name: "Push Pull Legs",
    goal: "Hipertrofia",
    frequency: "6 días/semana",
    exercises: [rx(demoExercises[0], 4, "8", "120"), rx(demoExercises[6], 4, "8", "120"), rx(demoExercises[9], 4, "8", "150"), rx(demoExercises[13], 3, "12", "60"), rx(demoExercises[14], 3, "12", "60"), rx(demoExercises[18], 3, "20", "45")],
  },
  {
    id: "w5",
    name: "Full Body",
    goal: "Pérdida de grasa",
    frequency: "3 días/semana",
    exercises: [rx(demoExercises[9], 4, "8", "150"), rx(demoExercises[0], 4, "8", "120"), rx(demoExercises[7], 3, "8", "90"), rx(demoExercises[13], 3, "12", "60"), rx(demoExercises[18], 3, "20", "45")],
  },
  {
    id: "w6",
    name: "Fuerza 5x5",
    goal: "Fuerza",
    frequency: "5 días/semana",
    exercises: [rx(demoExercises[0], 5, "5", "150"), rx(demoExercises[9], 5, "5", "180"), rx(demoExercises[11], 5, "5", "150"), rx(demoExercises[9], 5, "5", "180"), rx(demoExercises[0], 5, "5", "150")],
  },
];

export const currentWorkout: Workout = workouts[0];
