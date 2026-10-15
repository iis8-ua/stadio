import { getExerciseHistory, getTrainingMonths, getWeekSummary } from "../training/trainingHistory";
import { getClientProfile } from "../profile/clientProfile";
import { exercises } from "../../data/exercises";

/** Grupos musculares de los ejercicios de demostración del historial. */
const DEMO_MUSCLE_OF: Record<string, string> = {
  "Press banca": "Pecho",
  "Press inclinado": "Pecho",
  "Aperturas": "Pecho",
  "Extensión en polea": "Tríceps",
  "Dominadas": "Espalda",
  "Remo con barra": "Espalda",
  "Jalón al pecho": "Espalda",
  "Curl con barra": "Bíceps",
  "Sentadilla": "Pierna",
  "Prensa": "Pierna",
  "Peso muerto rumano": "Pierna",
  "Press militar": "Hombro",
  "Plancha": "Core",
  "Elevación de piernas": "Core",
};

/** Índice nombre → grupo muscular construido desde la biblioteca importada. */
const LIBRARY_MUSCLE_OF: Record<string, string> = Object.fromEntries(
  exercises.map((e) => [e.name, e.muscle])
);

/** Los nombres de la demo tienen prioridad para no alterar el historial existente. */
const MUSCLE_OF: Record<string, string> = { ...LIBRARY_MUSCLE_OF, ...DEMO_MUSCLE_OF };

const PUSH_MUSCLES = ["Pecho", "Tríceps", "Hombro"];
const PULL_MUSCLES = ["Espalda", "Bíceps"];

export interface MuscleStat {
  muscle: string;
  sets: number;
  share: number;
  status: "fuerte" | "equilibrado" | "bajo";
}

export interface MuscleBalance {
  stats: MuscleStat[];
  pushSets: number;
  pullSets: number;
  ratio: number;
  lowGroups: string[];
  finding: string;
}

export interface ExerciseProgression {
  name: string;
  months: string[];
  weights: number[];
  deltaPct: number;
  status: "progresando" | "estancado";
  suggested: number;
  note: string;
}

export interface RecoveryAnalysis {
  avgSessionsPerWeek: number;
  targetSessionsPerWeek: number;
  totalVolume: number;
  avgVolumePerSession: number;
  avgDuration: number;
  overtraining: boolean;
  underTraining: boolean;
  findings: string[];
  tips: string[];
}

export interface WeeklyPlan {
  realFrequency: number;
  targetFrequency: number;
  coveredPct: number;
  restDays: number;
  tips: string[];
}

export interface GoalBalance {
  goal: string;
  aligned: number;
  total: number;
  alignedPct: number;
  verdict: string;
  recommendation: string;
}

export interface EvolutionReport {
  months: string[];
  totalSessions: number;
  totalVolume: number;
  avgVolumePerSession: number;
  pressDeltaPct: number;
  adherencePct: number;
  verdict: string;
}

function targetFrequency(): number {
  const n = Number.parseInt(getClientProfile().frequency, 10);
  return Number.isFinite(n) && n > 0 ? n : 4;
}

export function getMuscleBalance(): MuscleBalance {
  const last = getTrainingMonths()[0];
  const setsByMuscle = new Map<string, number>();
  for (const w of last.workouts) {
    for (const e of w.exercises) {
      const muscle = MUSCLE_OF[e.name] ?? "Otros";
      setsByMuscle.set(muscle, (setsByMuscle.get(muscle) ?? 0) + e.sets);
    }
  }
  const total = [...setsByMuscle.values()].reduce((a, b) => a + b, 0);

  const stats: MuscleStat[] = [...setsByMuscle.entries()]
    .map(([muscle, sets]) => {
      const share = (sets / total) * 100;
      return {
        muscle,
        sets,
        share,
        status: (share >= 18 ? "fuerte" : share <= 10 ? "bajo" : "equilibrado") as MuscleStat["status"],
      };
    })
    .sort((a, b) => b.sets - a.sets);

  const lowGroups = stats.filter((s) => s.status === "bajo").map((s) => s.muscle);
  const strongGroups = stats.filter((s) => s.status === "fuerte").map((s) => s.muscle);

  const pushSets = stats.filter((s) => PUSH_MUSCLES.includes(s.muscle)).reduce((a, s) => a + s.sets, 0);
  const pullSets = stats.filter((s) => PULL_MUSCLES.includes(s.muscle)).reduce((a, s) => a + s.sets, 0);
  const ratio = pullSets === 0 ? pushSets : pushSets / pullSets;

  const finding =
    lowGroups.length > 0
      ? `${strongGroups.join(" y ")} acumulan la mayor parte del trabajo (${stats
          .filter((s) => strongGroups.includes(s.muscle))
          .reduce((a, s) => a + s.share, 0)
          .toFixed(0)}%), mientras que ${lowGroups.join(", ")} apenas reciben estímulo (${stats
          .filter((s) => lowGroups.includes(s.muscle))
          .reduce((a, s) => a + s.share, 0)
          .toFixed(0)}%).`
      : "Tu distribución de trabajo muscular está bien equilibrada.";

  return { stats, pushSets, pullSets, ratio, lowGroups, finding };
}

const KEY_EXERCISES = ["Press banca", "Sentadilla", "Remo con barra", "Curl con barra", "Jalón al pecho"];

export function getLoadProgression(): ExerciseProgression[] {
  return KEY_EXERCISES.map((name) => {
    const history = getExerciseHistory(name).filter((h) => h.weight > 0);
    const months = history.map((h) => h.month);
    const weights = history.map((h) => h.weight);
    const first = weights[0] ?? 0;
    const last = weights[weights.length - 1] ?? 0;
    const prev = weights[weights.length - 2] ?? 0;
    const deltaPct = first === 0 ? 0 : ((last - first) / first) * 100;
    const status: ExerciseProgression["status"] =
      weights.length > 1 && (last === prev || deltaPct < 2.5) ? "estancado" : "progresando";
    const suggested = Math.round((last + 2.5) * 10) / 10;
    const note =
      status === "estancado"
        ? "Llevas semanas con la misma carga. Prueba un incremento progresivo de 2,5 kg cuando completes todas las series con buena técnica."
        : status === "progresando" && deltaPct >= 10
          ? "Gran evolución. Mantén el incremento de cargas y registra tus sensaciones."
          : "Sigue añadiendo carga de forma progresiva cada 2-3 semanas.";
    return { name, months, weights, deltaPct, status, suggested, note };
  });
}

export function getRecoveryAnalysis(): RecoveryAnalysis {
  const last = getTrainingMonths()[0];
  const target = targetFrequency();
  const weeks = getWeekSummary(last);
  const sessions = last.workouts.length;
  const avgSessionsPerWeek = weeks.length === 0 ? 0 : sessions / weeks.length;
  const totalVolume = last.workouts.reduce((a, w) => a + w.volume, 0);
  const avgVolumePerSession = sessions === 0 ? 0 : Math.round(totalVolume / sessions);
  const avgDuration = sessions === 0 ? 0 : Math.round(last.workouts.reduce((a, w) => a + w.duration, 0) / sessions);

  const overtraining = avgSessionsPerWeek > target + 1;
  const underTraining = avgSessionsPerWeek < target - 0.5;

  const findings: string[] = [];
  if (overtraining) {
    findings.push(
      `Registras ${avgSessionsPerWeek.toFixed(1)} sesiones/semana, por encima de tu plan de ${target}. Aumenta el riesgo de sobreentrenamiento y falta de recuperación.`
    );
  } else if (underTraining) {
    findings.push(
      `Entrenaste ${avgSessionsPerWeek.toFixed(1)} sesiones/semana de media, algo por debajo de las ${target} planificadas.`
    );
  } else {
    findings.push(
      `Tu frecuencia real de ${avgSessionsPerWeek.toFixed(1)} sesiones/semana está alineada con el plan de ${target}.`
    );
  }
  findings.push(
    `Volumen medio de ${avgVolumePerSession.toLocaleString("es-ES")} kg y ${avgDuration} min por sesión.`
  );
  findings.push(
    "En series pesadas el descanso medio de 90s puede ser insuficiente para una recuperación completa."
  );

  const tips = [
    "Prioriza 7-8h de sueño para no comprometer la recuperación muscular.",
    "Aumenta el descanso a 120-150s en los ejercicios compuestos pesados.",
    "Alterna días duros y suaves para dosificar la fatiga acumulada.",
  ];

  return { avgSessionsPerWeek, targetSessionsPerWeek: target, totalVolume, avgVolumePerSession, avgDuration, overtraining, underTraining, findings, tips };
}

export function getWeeklyPlanning(): WeeklyPlan {
  const last = getTrainingMonths()[0];
  const target = targetFrequency();
  const weeks = getWeekSummary(last);
  const real = weeks.length === 0 ? 0 : last.workouts.length / weeks.length;
  const coveredPct = Math.min(100, Math.round((real / target) * 100));
  const restDays = 7 - Math.min(7, Math.ceil(real));

  const tips: string[] = [];
  if (real < target) {
    tips.push(`Suma 1 sesión a la semana hasta alcanzar las ${target} planificadas, dejando 24-48h entre grupos musculares repetidos.`);
  } else {
    tips.push("Mantén la distribución actual de días de entrenamiento.");
  }
  tips.push("Reparte los descansos con un día completo de recuperación tras las sesiones de pierna.");
  tips.push("Cierra cada semana con una sesión de movilidad o estiramientos para descargar tensión.");

  return { realFrequency: real, targetFrequency: target, coveredPct, restDays, tips };
}

export function getGoalBalance(): GoalBalance {
  const profile = getClientProfile();
  const goal = profile.goal;
  const last = getTrainingMonths()[0];
  const aligned = last.workouts.filter((w) => w.goal === goal).length;
  const total = last.workouts.length;
  const alignedPct = total === 0 ? 0 : Math.round((aligned / total) * 100);

  const verdict =
    alignedPct >= 70
      ? `El ${alignedPct}% de tus sesiones se orientan a tu objetivo de ${goal}. La planificación está bien alineada.`
      : `Solo el ${alignedPct}% de tus sesiones coincide con tu objetivo de ${goal}. Conviene reorientar parte del trabajo.`;

  const offGoals = [...new Set(last.workouts.filter((w) => w.goal !== goal).map((w) => w.goal))];
  const recommendation =
    offGoals.length > 0
      ? `Las sesiones de ${offGoals.join(" y ")} ayudan a construir la base, pero prioriza el rango de series y cargas propio de ${goal}.`
      : `Mantén el foco en ${goal} y ajusta cargas cuando completes todos los rangos con control.`;

  return { goal, aligned, total, alignedPct, verdict, recommendation };
}

export function getEvolutionReport(): EvolutionReport {
  const months = getTrainingMonths();
  const labels = months.map((m) => m.label);
  const totalSessions = months.reduce((a, m) => a + m.workouts.length, 0);
  const totalVolume = months.reduce((a, m) => a + m.workouts.reduce((x, w) => x + w.volume, 0), 0);
  const avgVolumePerSession = totalSessions === 0 ? 0 : Math.round(totalVolume / totalSessions);

  const press = getExerciseHistory("Press banca").filter((h) => h.weight > 0);
  const pressDeltaPct =
    press.length > 1 ? ((press[press.length - 1].weight - press[0].weight) / press[0].weight) * 100 : 0;

  const target = targetFrequency();
  let acc = 0;
  let weeksCount = 0;
  for (const m of months) {
    weeksCount += getWeekSummary(m).length;
    acc += m.workouts.length;
  }
  const realFreq = weeksCount === 0 ? 0 : acc / weeksCount;
  const adherencePct = Math.min(100, Math.round((realFreq / target) * 100));

  const verdict =
    pressDeltaPct > 0
      ? `Tendencia clara de progresión: press banca +${pressDeltaPct.toFixed(0)}% en el trimestre, ${totalSessions} sesiones y ${totalVolume.toLocaleString("es-ES")} kg de volumen total.`
      : `Trimestre estable: ${totalSessions} sesiones y ${totalVolume.toLocaleString("es-ES")} kg de volumen total.`;

  return { months: labels, totalSessions, totalVolume, avgVolumePerSession, pressDeltaPct, adherencePct, verdict };
}