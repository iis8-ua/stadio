import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { BackButton } from "../../components/BackButton";
import { Field, Input, Select } from "../../components/Input";
import { Confirmation } from "../../components/Confirmation";
import { ExerciseLibraryPicker } from "../../components/ExerciseLibraryPicker";
import { SetsEditor } from "../../components/SetsEditor";
import { getClientRoutines, addClientRoutine, updateClientRoutine } from "../../features/routines/clientRoutines";
import type { Exercise, ExerciseSet } from "../../types";
import { newSet } from "../../utils/exerciseSets";
import { useToast } from "../../hooks/useToast";

interface DraftExercise {
  key: number;
  exercise: Exercise;
  sets: ExerciseSet[];
  notes: string;
}

let keyCounter = 0;

export function ClientCreateWorkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editing = editId ? getClientRoutines().find((w) => w.id === editId) ?? null : null;
  const { notify } = useToast();
  const [name, setName] = useState(editing?.name ?? "");
  const [goal, setGoal] = useState(editing?.goal ?? "Hipertrofia");
  const [days, setDays] = useState(editing?.frequency.split(" ")[0] ?? "3");
  const [draft, setDraft] = useState<DraftExercise[]>(() =>
    editing
      ? editing.exercises.map((ex) => ({
          key: ++keyCounter,
          exercise: ex,
          sets: ex.sets,
          notes: "",
        }))
      : []
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const addExercise = (ex: Exercise) => {
    setDraft((d) => [
      ...d,
      { key: ++keyCounter, exercise: ex, sets: [newSet()], notes: "" },
    ]);
    setPickerOpen(false);
    notify(`Añadido: ${ex.name}`);
  };

  const removeExercise = (key: number) => {
    setDraft((d) => d.filter((x) => x.key !== key));
  };

  const update = (key: number, field: keyof DraftExercise, value: string) => {
    setDraft((d) => d.map((x) => (x.key === key ? { ...x, [field]: value } : x)));
  };

  const updateSet = (key: number, setId: string, field: keyof ExerciseSet, value: string) => {
    setDraft((d) =>
      d.map((x) =>
        x.key === key ? { ...x, sets: x.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)) } : x
      )
    );
  };

  const addSet = (key: number) => {
    setDraft((d) => d.map((x) => (x.key === key ? { ...x, sets: [...x.sets, newSet()] } : x)));
  };

  const removeSet = (key: number, setId: string) => {
    setDraft((d) => d.map((x) => (x.key === key ? { ...x, sets: x.sets.filter((s) => s.id !== setId) } : x)));
  };

  const save = () => {
    if (!name) {
      notify("Ponle un nombre a tu rutina", "warning");
      return;
    }
    if (draft.length === 0) {
      notify("Añade al menos un ejercicio", "warning");
      return;
    }
    if (draft.some((d) => d.sets.length === 0)) {
      notify("Cada ejercicio necesita al menos una serie", "warning");
      return;
    }
    if (draft.some((d) => d.sets.some((s) => !s.weight || !s.reps || !s.rest))) {
      notify("Peso, repeticiones y descanso son obligatorios en cada serie", "warning");
      return;
    }
    setConfirmOpen(true);
  };

  const confirmSave = () => {
    const workout = {
      id: editId ?? `my-${Date.now()}`,
      name,
      goal,
      frequency: `${days} días/semana`,
      exercises: draft.map((d) => ({
        id: d.exercise.id,
        exerciseId: d.exercise.id,
        name: d.exercise.name,
        muscle: d.exercise.muscle,
        notes: d.notes,
        sets: d.sets,
      })),
    };
    if (editId) {
      updateClientRoutine(editId, workout);
      notify("Rutina actualizada correctamente");
    } else {
      addClientRoutine(workout);
      notify("Rutina creada correctamente");
    }
    setConfirmOpen(false);
    navigate("/client/training");
  };

  return (
    <div className="space-y-5">
      <BackButton />

      <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">
        {editId ? "Editar mi rutina" : "Crear mi rutina"}
      </h1>
      <p className="text-sm text-stadio-gray dark:text-white/50">
        {editId
          ? "Modifica los datos y ejercicios de tu rutina actual."
          : "Cuando guardes la rutina pasará a ser tu entrenamiento activo."}
      </p>

      <Card>
        <CardHeader title="Datos de la rutina" />
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nombre">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Empuje + Tríceps" />
            </Field>
            <Field label="Objetivo">
              <Select value={goal} onChange={(e) => setGoal(e.target.value)}>
                {["Hipertrofia", "Fuerza", "Resistencia", "Pérdida de grasa", "Salud general"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
            </Field>
            <Field label="Días por semana">
              <Select value={days} onChange={(e) => setDays(e.target.value)}>
                {["1", "2", "3", "4", "5", "6", "7"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Ejercicios"
          subtitle={`${draft.length} añadidos`}
          action={
            <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
              <Plus size={16} /> AÑADIR EJERCICIO
            </Button>
          }
        />
        <CardBody>
          {draft.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-white/15 p-8 text-center text-sm text-stadio-gray dark:text-white/50">
              Añade ejercicios desde la biblioteca para empezar tu rutina.
            </div>
          ) : (
            <div className="space-y-3">
              {draft.map((d) => (
                <div key={d.key} className="rounded-xl border border-gray-100 dark:border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-stadio-black dark:text-white">{d.exercise.name}</p>
                      <p className="text-xs text-stadio-gray">{d.exercise.muscle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stadio-gray">{d.sets.length} series</span>
                      <button
                        onClick={() => removeExercise(d.key)}
                        className="rounded-lg p-1.5 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                        aria-label="Eliminar ejercicio"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <SetsEditor
                      sets={d.sets}
                      onUpdate={(setId, field, value) => updateSet(d.key, setId, field, value)}
                      onAdd={() => addSet(d.key)}
                      onRemove={(setId) => removeSet(d.key, setId)}
                    />
                  </div>
                  <div className="mt-2">
                    <Field label="Notas">
                      <Input value={d.notes} onChange={(e) => update(d.key, "notes", e.target.value)} placeholder="Notas, sensaciones, técnica..." />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button size="lg" className="mt-4 w-full" onClick={save}>
            {editId ? "GUARDAR CAMBIOS" : "GUARDAR MI RUTINA"}
          </Button>
        </CardBody>
      </Card>

      <ExerciseLibraryPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addExercise}
      />

      <Confirmation
        open={confirmOpen}
        title={editId ? "Guardar cambios" : "Guardar mi rutina"}
        message={
          editId
            ? `Guardar los cambios de "${name}" con ${draft.length} ejercicios?`
            : `Guardar la rutina "${name}" con ${draft.length} ejercicios?`
        }
        confirmLabel="Guardar"
        onConfirm={confirmSave}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}