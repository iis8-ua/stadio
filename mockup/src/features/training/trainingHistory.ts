export interface FinishedExercise {
  name: string;
  sets: number;
  reps: string;
  weight: number;
}

export interface FinishedTraining {
  id: string;
  routine: string;
  goal: string;
  date: string;
  time: string;
  duration: number;
  volume: number;
  calories: number;
  exercises: FinishedExercise[];
}

export interface TrainingMonth {
  key: string;
  label: string;
  year: number;
  workouts: FinishedTraining[];
}

export interface WeekSummary {
  week: number;
  count: number;
  days: string[];
}

const DAY_LETTER: Record<number, string> = { 0: "D", 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S" };

const pechoJun = [
  { name: "Press banca", sets: 4, reps: "8", weight: 78 },
  { name: "Press inclinado", sets: 3, reps: "10", weight: 55 },
  { name: "Aperturas", sets: 3, reps: "12", weight: 18 },
  { name: "Extensión en polea", sets: 3, reps: "12", weight: 30 },
];

const espaldaJun = [
  { name: "Dominadas", sets: 4, reps: "8", weight: 9 },
  { name: "Remo con barra", sets: 4, reps: "8", weight: 62 },
  { name: "Jalón al pecho", sets: 3, reps: "10", weight: 48 },
  { name: "Curl con barra", sets: 3, reps: "10", weight: 26 },
];

const piernaJun = [
  { name: "Sentadilla", sets: 4, reps: "8", weight: 95 },
  { name: "Prensa", sets: 4, reps: "10", weight: 165 },
  { name: "Peso muerto rumano", sets: 3, reps: "10", weight: 72 },
  { name: "Elevación de piernas", sets: 3, reps: "15", weight: 0 },
];

const fullBodyJun = [
  { name: "Sentadilla", sets: 4, reps: "10", weight: 85 },
  { name: "Press banca", sets: 4, reps: "8", weight: 73 },
  { name: "Remo con barra", sets: 3, reps: "10", weight: 58 },
  { name: "Press militar", sets: 3, reps: "8", weight: 36 },
  { name: "Plancha", sets: 3, reps: "60s", weight: 0 },
];

const pechoJul = [
  { name: "Press banca", sets: 4, reps: "8", weight: 80 },
  { name: "Press inclinado", sets: 3, reps: "10", weight: 58 },
  { name: "Aperturas", sets: 3, reps: "12", weight: 20 },
  { name: "Extensión en polea", sets: 3, reps: "12", weight: 33 },
];

const espaldaJul = [
  { name: "Dominadas", sets: 4, reps: "8", weight: 10 },
  { name: "Remo con barra", sets: 4, reps: "8", weight: 66 },
  { name: "Jalón al pecho", sets: 3, reps: "10", weight: 51 },
  { name: "Curl con barra", sets: 3, reps: "10", weight: 28 },
];

const piernaJul = [
  { name: "Sentadilla", sets: 4, reps: "8", weight: 100 },
  { name: "Prensa", sets: 4, reps: "10", weight: 172 },
  { name: "Peso muerto rumano", sets: 3, reps: "10", weight: 76 },
  { name: "Elevación de piernas", sets: 3, reps: "15", weight: 0 },
];

const fullBodyJul = [
  { name: "Sentadilla", sets: 4, reps: "10", weight: 90 },
  { name: "Press banca", sets: 4, reps: "8", weight: 76 },
  { name: "Remo con barra", sets: 3, reps: "10", weight: 62 },
  { name: "Press militar", sets: 3, reps: "8", weight: 38 },
  { name: "Plancha", sets: 3, reps: "60s", weight: 0 },
];

const pechoAgo = [
  { name: "Press banca", sets: 4, reps: "8", weight: 84 },
  { name: "Press inclinado", sets: 3, reps: "10", weight: 60 },
  { name: "Aperturas", sets: 3, reps: "12", weight: 22 },
  { name: "Extensión en polea", sets: 3, reps: "12", weight: 36 },
];

const espaldaAgo = [
  { name: "Dominadas", sets: 4, reps: "8", weight: 12 },
  { name: "Remo con barra", sets: 4, reps: "8", weight: 70 },
  { name: "Jalón al pecho", sets: 3, reps: "10", weight: 51 },
  { name: "Curl con barra", sets: 3, reps: "10", weight: 30 },
];

const piernaAgo = [
  { name: "Sentadilla", sets: 4, reps: "8", weight: 105 },
  { name: "Prensa", sets: 4, reps: "10", weight: 180 },
  { name: "Peso muerto rumano", sets: 3, reps: "10", weight: 80 },
  { name: "Elevación de piernas", sets: 3, reps: "15", weight: 0 },
];

const fullBodyAgo = [
  { name: "Sentadilla", sets: 4, reps: "10", weight: 95 },
  { name: "Press banca", sets: 4, reps: "8", weight: 80 },
  { name: "Remo con barra", sets: 3, reps: "10", weight: 65 },
  { name: "Press militar", sets: 3, reps: "8", weight: 40 },
  { name: "Plancha", sets: 3, reps: "60s", weight: 0 },
];

const todaysMonths: TrainingMonth[] = [
  {
    key: "2026-08",
    label: "Agosto",
    year: 2026,
    workouts: [
      { id: "t1", routine: "Pecho + Tríceps", goal: "Hipertrofia", date: "2026-08-03", time: "10:15", duration: 55, volume: 6540, calories: 480, exercises: pechoAgo },
      { id: "t2", routine: "Espalda + Bíceps", goal: "Hipertrofia", date: "2026-08-05", time: "18:30", duration: 60, volume: 5840, calories: 510, exercises: espaldaAgo },
      { id: "t3", routine: "Pierna + Core", goal: "Fuerza", date: "2026-08-07", time: "09:00", duration: 70, volume: 7420, calories: 610, exercises: piernaAgo },
      { id: "t4", routine: "Push Pull Legs", goal: "Hipertrofia", date: "2026-08-10", time: "19:00", duration: 65, volume: 6980, calories: 590, exercises: fullBodyAgo },
      { id: "t5", routine: "Pecho + Tríceps", goal: "Hipertrofia", date: "2026-08-12", time: "10:00", duration: 55, volume: 6710, calories: 495, exercises: pechoAgo },
      { id: "t6", routine: "Espalda + Bíceps", goal: "Hipertrofia", date: "2026-08-14", time: "18:00", duration: 60, volume: 6030, calories: 520, exercises: espaldaAgo },
      { id: "t7", routine: "Pierna + Core", goal: "Fuerza", date: "2026-08-15", time: "11:30", duration: 65, volume: 7610, calories: 625, exercises: piernaAgo },
      { id: "t8", routine: "Push Pull Legs", goal: "Hipertrofia", date: "2026-08-17", time: "19:15", duration: 65, volume: 7150, calories: 600, exercises: fullBodyAgo },
      { id: "t9", routine: "Pecho + Tríceps", goal: "Hipertrofia", date: "2026-08-19", time: "10:30", duration: 55, volume: 6890, calories: 510, exercises: pechoAgo },
      { id: "t10", routine: "Pierna + Core", goal: "Fuerza", date: "2026-08-21", time: "09:30", duration: 70, volume: 7780, calories: 640, exercises: piernaAgo },
      { id: "t11", routine: "Espalda + Bíceps", goal: "Hipertrofia", date: "2026-08-24", time: "18:45", duration: 60, volume: 6210, calories: 530, exercises: espaldaAgo },
      { id: "t12", routine: "Push Pull Legs", goal: "Hipertrofia", date: "2026-08-26", time: "19:00", duration: 65, volume: 7310, calories: 610, exercises: fullBodyAgo },
    ],
  },
  {
    key: "2026-07",
    label: "Julio",
    year: 2026,
    workouts: [
      { id: "t13", routine: "Pecho + Tríceps", goal: "Hipertrofia", date: "2026-07-01", time: "10:00", duration: 55, volume: 6420, calories: 470, exercises: pechoJul },
      { id: "t14", routine: "Espalda + Bíceps", goal: "Hipertrofia", date: "2026-07-03", time: "18:30", duration: 60, volume: 5710, calories: 500, exercises: espaldaJul },
      { id: "t15", routine: "Pierna + Core", goal: "Fuerza", date: "2026-07-06", time: "09:15", duration: 70, volume: 7290, calories: 600, exercises: piernaJul },
      { id: "t16", routine: "Full Body", goal: "Pérdida de grasa", date: "2026-07-08", time: "19:00", duration: 55, volume: 5480, calories: 560, exercises: fullBodyJul },
      { id: "t17", routine: "Pecho + Tríceps", goal: "Hipertrofia", date: "2026-07-10", time: "10:30", duration: 55, volume: 6580, calories: 485, exercises: pechoJul },
      { id: "t18", routine: "Espalda + Bíceps", goal: "Hipertrofia", date: "2026-07-13", time: "18:00", duration: 60, volume: 5890, calories: 510, exercises: espaldaJul },
      { id: "t19", routine: "Pierna + Core", goal: "Fuerza", date: "2026-07-15", time: "09:00", duration: 70, volume: 7450, calories: 615, exercises: piernaJul },
      { id: "t20", routine: "Push Pull Legs", goal: "Hipertrofia", date: "2026-07-17", time: "19:15", duration: 65, volume: 7020, calories: 590, exercises: fullBodyJul },
    ],
  },
  {
    key: "2026-06",
    label: "Junio",
    year: 2026,
    workouts: [
      { id: "t21", routine: "Pecho + Tríceps", goal: "Hipertrofia", date: "2026-06-01", time: "10:15", duration: 55, volume: 6280, calories: 460, exercises: pechoJun },
      { id: "t22", routine: "Espalda + Bíceps", goal: "Hipertrofia", date: "2026-06-03", time: "18:30", duration: 60, volume: 5580, calories: 495, exercises: espaldaJun },
      { id: "t23", routine: "Pierna + Core", goal: "Fuerza", date: "2026-06-05", time: "09:15", duration: 70, volume: 7140, calories: 590, exercises: piernaJun },
      { id: "t24", routine: "Full Body", goal: "Pérdida de grasa", date: "2026-06-08", time: "19:00", duration: 55, volume: 5320, calories: 545, exercises: fullBodyJun },
      { id: "t25", routine: "Pecho + Tríceps", goal: "Hipertrofia", date: "2026-06-10", time: "10:30", duration: 55, volume: 6390, calories: 475, exercises: pechoJun },
      { id: "t26", routine: "Espalda + Bíceps", goal: "Hipertrofia", date: "2026-06-12", time: "18:00", duration: 60, volume: 5720, calories: 505, exercises: espaldaJun },
      { id: "t27", routine: "Pierna + Core", goal: "Fuerza", date: "2026-06-15", time: "09:00", duration: 70, volume: 7310, calories: 605, exercises: piernaJun },
      { id: "t28", routine: "Push Pull Legs", goal: "Hipertrofia", date: "2026-06-17", time: "19:15", duration: 65, volume: 6890, calories: 580, exercises: fullBodyJun },
    ],
  },
];

export function getTrainingMonths(): TrainingMonth[] {
  return todaysMonths;
}

export function getTrainingById(id: string): FinishedTraining | undefined {
  for (const month of todaysMonths) {
    const workout = month.workouts.find((w) => w.id === id);
    if (workout) return workout;
  }
  return undefined;
}

export function getExerciseHistory(name: string): { month: string; weight: number }[] {
  return todaysMonths.map((m) => {
    const workout = m.workouts.find((w) => w.exercises.some((e) => e.name === name));
    const weight = workout?.exercises.find((e) => e.name === name)?.weight;
    return { month: m.label, weight: weight ?? 0 };
  });
}

export function getWeekSummary(month: TrainingMonth): WeekSummary[] {
  const weeks: WeekSummary[] = [];
  for (const w of month.workouts) {
    const d = new Date(`${w.date}T12:00:00`);
    const dayOfMonth = d.getDate();
    const week = Math.floor((dayOfMonth - 1) / 7) + 1;
    let entry = weeks.find((x) => x.week === week);
    if (!entry) {
      entry = { week, count: 0, days: [] };
      weeks.push(entry);
    }
    entry.count += 1;
    const letter = DAY_LETTER[d.getDay()];
    if (!entry.days.includes(letter)) entry.days.push(letter);
  }
  return weeks.sort((a, b) => a.week - b.week);
}