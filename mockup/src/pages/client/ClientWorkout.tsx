import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Circle,
  ChevronRight,
  Timer,
  Trophy,
  Dumbbell,
  Clock,
  Award,
  Pause,
  Play,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Field, Input } from "../../components/Input";
import { SetsEditor } from "../../components/SetsEditor";
import { useToast } from "../../hooks/useToast";
import { getEffectiveActiveRoutine } from "../../features/routines/activeRoutine";
import type { ExerciseSet } from "../../types";
import { newSet } from "../../utils/exerciseSets";
import { restLabel } from "../../utils/rest";

export function ClientWorkout() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const workout = getEffectiveActiveRoutine();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setsByExercise, setSetsByExercise] = useState<ExerciseSet[][]>(() =>
    workout.exercises.map((ex) => ex.sets.map((s) => ({ ...s })))
  );
  const [completedSets, setCompletedSets] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(90);
  const [resting, setResting] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rest, setRest] = useState("");
  const [rir, setRir] = useState("");
  const [rpe, setRpe] = useState("");
  const [notes, setNotes] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(false);

  const exercise = workout.exercises[exerciseIndex];
  const sets = setsByExercise[exerciseIndex] ?? [];

  useEffect(() => {
    if (!resting || timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearTimeout(id);
  }, [resting, timer]);

  const startRest = (seconds?: string) => {
    const secs = parseInt(seconds ?? "", 10);
    setTimer(Number.isFinite(secs) && secs > 0 ? secs : 90);
    setResting(true);
  };

  const updateSet = (setId: string, field: keyof ExerciseSet, value: string) => {
    setSetsByExercise((all) =>
      all.map((ex, i) =>
        i === exerciseIndex ? ex.map((s) => (s.id === setId ? { ...s, [field]: value } : s)) : ex
      )
    );
  };

  const removeSet = (setId: string) => {
    setSetsByExercise((all) =>
      all.map((ex, i) => (i === exerciseIndex ? ex.filter((s) => s.id !== setId) : ex))
    );
    setCompletedSets((c) => c.filter((k) => k !== `${exerciseIndex}:${setId}`));
  };

  const toggleSet = (setId: string, restSeconds: string) => {
    const key = `${exerciseIndex}:${setId}`;
    const done = completedSets.includes(key);
    setCompletedSets((c) => (done ? c.filter((k) => k !== key) : [...c, key]));
    if (!done) startRest(restSeconds);
  };

  const saveSet = () => {
    if (!weight || !reps || !rest) {
      notify("Peso, repeticiones y descanso son obligatorios", "warning");
      return;
    }
    const set = newSet({ weight, reps, rest, rir, rpe });
    setSetsByExercise((all) => all.map((ex, i) => (i === exerciseIndex ? [...ex, set] : ex)));
    setCompletedSets((c) => [...c, `${exerciseIndex}:${set.id}`]);
    startRest(rest);
    setSavedFeedback(true);
    notify("Serie registrada");
    setWeight("");
    setReps("");
    setRest("");
    setRir("");
    setRpe("");
    setNotes("");
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const nextExercise = () => {
    if (exerciseIndex < workout.exercises.length - 1) {
      setExerciseIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  };

  const finish = () => {
    setCompleted(true);
  };

  const formatTimer = () => `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}`;

  if (completed) {
    return (
      <div className="mx-auto max-w-md space-y-5">
        <Card>
          <CardBody className="flex flex-col items-center py-10 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-stadio-green-bg dark:bg-green-950/50">
              <Trophy size={40} className="text-stadio-green" />
            </div>
            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">
              ¡Entrenamiento completado! 💪
            </h1>
            <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
              Gran sesión de {workout.name}. Sigue así, Israel.
            </p>

            <div className="mt-6 grid w-full grid-cols-2 gap-3">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-4">
                <Dumbbell size={20} className="text-stadio-red" />
                <p className="mt-1 text-lg font-extrabold text-stadio-black dark:text-white">5</p>
                <p className="text-xs text-stadio-gray">ejercicios</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-4">
                <Circle size={20} className="text-stadio-red" />
                <p className="mt-1 text-lg font-extrabold text-stadio-black dark:text-white">18</p>
                <p className="text-xs text-stadio-gray">series</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-4">
                <Clock size={20} className="text-stadio-red" />
                <p className="mt-1 text-lg font-extrabold text-stadio-black dark:text-white">52 min</p>
                <p className="text-xs text-stadio-gray">duración</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-4">
                <Award size={20} className="text-stadio-red" />
                <p className="mt-1 text-lg font-extrabold text-stadio-black dark:text-white">8.420 kg</p>
                <p className="text-xs text-stadio-gray">volumen</p>
              </div>
            </div>

            <Button size="lg" className="mt-6 w-full" onClick={() => navigate("/client/training")}>
              VOLVER A MI RUTINA
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => navigate("/client/dashboard")}>
              Ir al inicio
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/client/training")}
          className="text-sm font-semibold text-stadio-gray-dark dark:text-white/60 hover:text-stadio-red"
        >
          ← Salir del entrenamiento
        </button>
        <span className="text-xs font-semibold text-stadio-gray">
          Ejercicio {exerciseIndex + 1}/{workout.exercises.length}
        </span>
      </div>

      <div className="flex gap-1">
        {workout.exercises.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i < exerciseIndex
                ? "bg-stadio-green"
                : i === exerciseIndex
                ? "bg-stadio-red"
                : "bg-gray-200 dark:bg-white/10"
            }`}
          />
        ))}
      </div>

      <Card>
        <CardHeader
          title={exercise.name}
          subtitle={`${exercise.muscle} · ${sets.length} series · pulsa el círculo para completar`}
        />
        <CardBody>
          <SetsEditor
            sets={sets}
            onUpdate={updateSet}
            onRemove={removeSet}
            isDone={(i) => completedSets.includes(`${exerciseIndex}:${sets[i]?.id}`)}
            onToggle={(i) => {
              const s = sets[i];
              if (s) toggleSet(s.id, s.rest);
            }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Registrar serie" subtitle="Peso, repeticiones y descanso son obligatorios" />
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Field label="Peso (kg) *">
              <Input type="number" min={0} step="any" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="80" />
            </Field>
            <Field label="Repeticiones *">
              <Input type="number" min={0} inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="10" />
            </Field>
            <Field label="Descanso (s) *">
              <Input type="number" min={0} inputMode="numeric" value={rest} onChange={(e) => setRest(e.target.value)} placeholder="90" />
            </Field>
            <Field label="RIR">
              <Input type="number" min={0} step="any" inputMode="decimal" value={rir} onChange={(e) => setRir(e.target.value)} placeholder="—" />
            </Field>
            <Field label="RPE">
              <Input type="number" min={0} step="any" inputMode="decimal" value={rpe} onChange={(e) => setRpe(e.target.value)} placeholder="—" />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Notas">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Sensaciones, técnica, etc."
                className="w-full rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-sm text-stadio-black dark:text-white placeholder:text-stadio-gray focus:outline-none focus:ring-2 focus:ring-red-500/40"
              />
            </Field>
          </div>

          <Button className="mt-4 w-full" onClick={saveSet}>
            GUARDAR SERIE
          </Button>
          {savedFeedback && (
            <p className="mt-2 text-center text-sm font-semibold text-stadio-green">
              ✓ Serie registrada
            </p>
          )}
        </CardBody>
      </Card>

      {resting && timer > 0 ? (
        <Card>
          <CardBody className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-stadio-red/10 text-stadio-red">
                <Timer size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-stadio-black dark:text-white">Descanso</p>
                <p className="text-2xl font-extrabold text-stadio-red">{formatTimer()}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setResting(false)}>
              <Pause size={16} /> Omitir
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-stadio-gray-light dark:bg-white/5 text-stadio-gray">
                <Timer size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-stadio-black dark:text-white">Descanso sugerido</p>
                <p className="text-xs text-stadio-gray">{restLabel(sets[0]?.rest) || "Sin descanso definido"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => startRest(sets[0]?.rest)}
              >
                <Play size={16} /> Iniciar
              </Button>
              {exerciseIndex < workout.exercises.length - 1 ? (
                <Button size="sm" variant="primary" onClick={nextExercise}>
                  SIGUIENTE EJERCICIO <ChevronRight size={16} />
                </Button>
              ) : (
                <Button size="sm" onClick={finish}>
                  FINALIZAR ENTRENAMIENTO
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
