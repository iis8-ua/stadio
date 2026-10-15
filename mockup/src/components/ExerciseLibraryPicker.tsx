import { useMemo, useState } from "react";
import { ArrowLeft, Dumbbell, Plus, Search } from "lucide-react";
import { Modal } from "./Modal";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Input } from "./Input";
import { exercises } from "../data/exercises";
import type { Exercise } from "../types";

interface ExerciseLibraryPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}

/** Orden preferido de los grupos musculares en los filtros. */
const MUSCLE_ORDER = ["Pecho", "Espalda", "Pierna", "Hombro", "Bíceps", "Tríceps", "Core", "Otros"];

const MAX_RESULTS = 60;

function ExerciseThumb({ exercise, size = "h-12 w-12" }: { exercise: Exercise; size?: string }) {
  if (exercise.image) {
    return (
      <img
        src={exercise.image}
        alt={exercise.name}
        loading="lazy"
        className={`${size} shrink-0 rounded-lg object-cover bg-stadio-gray-light dark:bg-white/10`}
      />
    );
  }
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-lg bg-stadio-gray-light text-stadio-gray dark:bg-white/10 dark:text-white/40`}
      aria-hidden
    >
      <Dumbbell size={20} />
    </div>
  );
}

export function ExerciseLibraryPicker({ open, onClose, onSelect }: ExerciseLibraryPickerProps) {
  const [query, setQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("Todos");
  const [detail, setDetail] = useState<Exercise | null>(null);

  const muscles = useMemo(() => {
    const present = new Set(exercises.map((e) => e.muscle));
    const ordered = MUSCLE_ORDER.filter((m) => present.has(m));
    const rest = [...present].filter((m) => !MUSCLE_ORDER.includes(m)).sort((a, b) => a.localeCompare(b, "es"));
    return ["Todos", ...ordered, ...rest];
  }, []);

  const filtered = useMemo(
    () =>
      exercises.filter(
        (e) =>
          (muscleFilter === "Todos" || e.muscle === muscleFilter) &&
          e.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [muscleFilter, query]
  );

  const shown = filtered.slice(0, MAX_RESULTS);

  const close = () => {
    setDetail(null);
    setQuery("");
    setMuscleFilter("Todos");
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title="Biblioteca de ejercicios">
      {detail ? (
        <div className="space-y-4">
          <button
            onClick={() => setDetail(null)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-stadio-gray-dark hover:text-stadio-red dark:text-white/60 dark:hover:text-red-300"
          >
            <ArrowLeft size={16} /> Volver a la biblioteca
          </button>

          <div className="flex items-start gap-4">
            <ExerciseThumb exercise={detail} size="h-24 w-24" />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-stadio-black dark:text-white">{detail.name}</h3>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge variant="neutral">{detail.muscle}</Badge>
                {detail.equipment && <Badge variant="info">{detail.equipment}</Badge>}
              </div>
            </div>
          </div>

          {detail.description && (
            <p className="text-sm text-stadio-gray-dark dark:text-white/70">{detail.description}</p>
          )}

          {detail.instructions && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-stadio-gray dark:text-white/50">
                Instrucciones
              </p>
              <p className="max-h-56 overflow-y-auto whitespace-pre-line text-sm text-stadio-gray-dark dark:text-white/70">
                {detail.instructions}
              </p>
            </div>
          )}

          <Button
            className="w-full"
            onClick={() => {
              onSelect(detail);
              close();
            }}
          >
            <Plus size={16} /> AÑADIR A LA RUTINA
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ejercicio..."
              aria-label="Buscar ejercicio"
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {muscles.map((m) => (
              <button
                key={m}
                onClick={() => setMuscleFilter(m)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  muscleFilter === m
                    ? "bg-stadio-red text-white"
                    : "bg-stadio-gray-light dark:bg-white/10 text-stadio-gray-dark dark:text-white/60"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-white/15 p-8 text-center text-sm text-stadio-gray dark:text-white/50">
              No hay ejercicios que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {shown.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setDetail(e)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-2.5 text-left hover:border-stadio-red/40 transition-colors"
                >
                  <ExerciseThumb exercise={e} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{e.name}</p>
                    <p className="text-xs text-stadio-gray">{e.muscle}</p>
                  </div>
                </button>
              ))}
              {filtered.length > shown.length && (
                <p className="pt-1 text-center text-xs text-stadio-gray dark:text-white/40">
                  Mostrando {shown.length} de {filtered.length}. Refina la búsqueda para ver más.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
