import { Check, Circle } from "lucide-react";
import { restLabel } from "../utils/rest";
import type { ExerciseSet } from "../types";

interface SetsTableProps {
  sets: ExerciseSet[];
  isDone?: (index: number) => boolean;
  onToggle?: (index: number) => void;
}

const th = "pb-1 pr-3 text-left text-[11px] font-bold uppercase tracking-wide text-stadio-gray";

export function SetsTable({ sets, isDone, onToggle }: SetsTableProps) {
  const interactive = typeof onToggle === "function";

  return (
    <div>
      {/* Escritorio: tabla */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[520px] border-separate border-spacing-y-1 text-sm">
          <thead>
            <tr>
              {interactive && <th className={`${th} w-8`} />}
              <th className={th}>Serie</th>
              <th className={th}>Peso</th>
              <th className={th}>Reps</th>
              <th className={th}>Descanso</th>
              <th className={th}>RIR</th>
              <th className={th}>RPE</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((s, i) => {
              const done = isDone?.(i) ?? false;
              return (
                <tr key={s.id} className="text-stadio-black dark:text-white">
                  {interactive && (
                    <td className="pr-2">
                      <button
                        type="button"
                        onClick={() => onToggle?.(i)}
                        aria-label={`Marcar serie ${i + 1}`}
                        className={`grid h-7 w-7 place-items-center rounded-full border-2 transition-colors ${
                          done
                            ? "border-stadio-green bg-stadio-green text-white"
                            : "border-gray-300 dark:border-white/20 text-stadio-gray dark:text-white/50 hover:border-stadio-red/50"
                        }`}
                      >
                        {done ? <Check size={14} /> : <Circle size={12} />}
                      </button>
                    </td>
                  )}
                  <td className="pr-3 font-semibold">{i + 1}</td>
                  <td className="pr-3">{s.weight ? `${s.weight} kg` : "—"}</td>
                  <td className="pr-3">{s.reps || "—"}</td>
                  <td className="pr-3">{restLabel(s.rest) || "—"}</td>
                  <td className="pr-3">{s.rir || "—"}</td>
                  <td className="pr-3">{s.rpe || "—"}</td>
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
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stadio-gray-dark dark:text-white/70">Serie {i + 1}</span>
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
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <p className="text-stadio-gray">
                  Peso: <span className="font-semibold text-stadio-black dark:text-white">{s.weight ? `${s.weight} kg` : "—"}</span>
                </p>
                <p className="text-stadio-gray">
                  Reps: <span className="font-semibold text-stadio-black dark:text-white">{s.reps || "—"}</span>
                </p>
                <p className="text-stadio-gray">
                  Descanso: <span className="font-semibold text-stadio-black dark:text-white">{restLabel(s.rest) || "—"}</span>
                </p>
                <p className="text-stadio-gray">
                  RIR: <span className="font-semibold text-stadio-black dark:text-white">{s.rir || "—"}</span>
                </p>
                <p className="text-stadio-gray">
                  RPE: <span className="font-semibold text-stadio-black dark:text-white">{s.rpe || "—"}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
