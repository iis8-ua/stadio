import { Check, Circle, Plus, Trash2 } from "lucide-react";
import { Input, Field } from "./Input";
import { Button } from "./Button";
import type { ExerciseSet } from "../types";

interface SetsEditorProps {
  sets: ExerciseSet[];
  onUpdate: (id: string, field: keyof ExerciseSet, value: string) => void;
  onRemove: (id: string) => void;
  onAdd?: () => void;
  isDone?: (index: number) => boolean;
  onToggle?: (index: number) => void;
}

const th = "pb-2 pr-2 text-left text-[11px] font-bold uppercase tracking-wide text-stadio-gray";
const req = <span className="text-stadio-red">*</span>;

export function SetsEditor({ sets, onUpdate, onRemove, onAdd, isDone, onToggle }: SetsEditorProps) {
  const interactive = typeof onToggle === "function";

  return (
    <div className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
      {sets.length === 0 ? (
        <p className="py-2 text-center text-xs text-stadio-gray dark:text-white/50">
          Sin series. Añade al menos una.
        </p>
      ) : (
        <>
          {/* Escritorio: tabla */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-1">
              <thead>
                <tr>
                  {interactive && <th className={`${th} w-8`} />}
                  <th className={`${th} w-12`}>Serie</th>
                  <th className={th}>Peso (kg) {req}</th>
                  <th className={th}>Reps {req}</th>
                  <th className={th}>Descanso (s) {req}</th>
                  <th className={th}>RIR</th>
                  <th className={th}>RPE</th>
                  <th className={`${th} w-8`} />
                </tr>
              </thead>
              <tbody>
                {sets.map((s, i) => {
                  const done = isDone?.(i) ?? false;
                  return (
                    <tr key={s.id}>
                      {interactive && (
                        <td className="pr-2">
                          <button
                            type="button"
                            onClick={() => onToggle?.(i)}
                            aria-label={`Marcar serie ${i + 1}`}
                            className={`grid h-8 w-8 place-items-center rounded-full border-2 transition-colors ${
                              done
                                ? "border-stadio-green bg-stadio-green text-white"
                                : "border-gray-300 dark:border-white/20 text-stadio-gray dark:text-white/50 hover:border-stadio-red/50"
                            }`}
                          >
                            {done ? <Check size={14} /> : <Circle size={12} />}
                          </button>
                        </td>
                      )}
                      <td className="pr-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-stadio-red/10 text-xs font-bold text-stadio-red">
                          {i + 1}
                        </span>
                      </td>
                      <td className="pr-2">
                        <Input type="number" min={0} step="any" inputMode="decimal" value={s.weight} onChange={(e) => onUpdate(s.id, "weight", e.target.value)} placeholder="0" />
                      </td>
                      <td className="pr-2">
                        <Input type="number" min={0} inputMode="numeric" value={s.reps} onChange={(e) => onUpdate(s.id, "reps", e.target.value)} placeholder="10" />
                      </td>
                      <td className="pr-2">
                        <Input type="number" min={0} inputMode="numeric" value={s.rest} onChange={(e) => onUpdate(s.id, "rest", e.target.value)} placeholder="90" />
                      </td>
                      <td className="pr-2">
                        <Input type="number" min={0} step="any" inputMode="decimal" value={s.rir} onChange={(e) => onUpdate(s.id, "rir", e.target.value)} placeholder="—" />
                      </td>
                      <td className="pr-2">
                        <Input type="number" min={0} step="any" inputMode="decimal" value={s.rpe} onChange={(e) => onUpdate(s.id, "rpe", e.target.value)} placeholder="—" />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => onRemove(s.id)}
                          className="rounded-lg p-1.5 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                          aria-label={`Eliminar serie ${i + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Móvil: tarjetas */}
          <div className="space-y-2 sm:hidden">
            {sets.map((s, i) => {
              const done = isDone?.(i) ?? false;
              return (
                <div key={s.id} className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {interactive && (
                        <button
                          type="button"
                          onClick={() => onToggle?.(i)}
                          aria-label={`Marcar serie ${i + 1}`}
                          className={`grid h-7 w-7 place-items-center rounded-full border-2 transition-colors ${
                            done
                              ? "border-stadio-green bg-stadio-green text-white"
                              : "border-gray-300 dark:border-white/20 text-stadio-gray dark:text-white/50"
                          }`}
                        >
                          {done ? <Check size={13} /> : <Circle size={11} />}
                        </button>
                      )}
                      <span className="text-xs font-bold text-stadio-gray-dark dark:text-white/70">Serie {i + 1}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(s.id)}
                      className="rounded-lg p-1.5 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                      aria-label={`Eliminar serie ${i + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Peso (kg) *">
                      <Input type="number" min={0} step="any" inputMode="decimal" value={s.weight} onChange={(e) => onUpdate(s.id, "weight", e.target.value)} placeholder="0" />
                    </Field>
                    <Field label="Reps *">
                      <Input type="number" min={0} inputMode="numeric" value={s.reps} onChange={(e) => onUpdate(s.id, "reps", e.target.value)} placeholder="10" />
                    </Field>
                    <Field label="Descanso (s) *">
                      <Input type="number" min={0} inputMode="numeric" value={s.rest} onChange={(e) => onUpdate(s.id, "rest", e.target.value)} placeholder="90" />
                    </Field>
                    <Field label="RIR">
                      <Input type="number" min={0} step="any" inputMode="decimal" value={s.rir} onChange={(e) => onUpdate(s.id, "rir", e.target.value)} placeholder="—" />
                    </Field>
                    <Field label="RPE">
                      <Input type="number" min={0} step="any" inputMode="decimal" value={s.rpe} onChange={(e) => onUpdate(s.id, "rpe", e.target.value)} placeholder="—" />
                    </Field>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {onAdd && (
        <Button variant="ghost" size="sm" className="mt-2" onClick={onAdd}>
          <Plus size={14} /> AÑADIR SERIE
        </Button>
      )}
    </div>
  );
}
