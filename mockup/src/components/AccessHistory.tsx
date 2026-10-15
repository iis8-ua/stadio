import { useState } from "react";
import { LogIn, LogOut, MinusCircle } from "lucide-react";
import { Select } from "./Input";
import { getAccessRecordsByMonth } from "../data/payments";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const YEARS = [2025, 2026, 2027];
const CURRENT_MONTH = 7; // Agosto (0-based)
const CURRENT_YEAR = 2026;

function durationMinutes(entry: string, exit?: string): number | null {
  if (!exit) return null;
  const [eh, em] = entry.split(":").map(Number);
  const [xh, xm] = exit.split(":").map(Number);
  return xh * 60 + xm - (eh * 60 + em);
}

function durationLabel(entry: string, exit?: string): string {
  const mins = durationMinutes(entry, exit);
  if (mins === null) return "";
  return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}min`;
}

export function AccessHistory() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);

  const records = getAccessRecordsByMonth(month, year);
  const periodLabel = `${MONTHS[month]} ${year}`;

  const totalMinutes = records.reduce((acc, a) => acc + (durationMinutes(a.entry, a.exit) ?? 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-28">
            <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </div>
          <div className="w-40">
            <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </Select>
          </div>
        </div>
        <p className="text-sm font-extrabold text-stadio-black dark:text-white">{periodLabel}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-stadio-black dark:text-white">{records.length}</p>
          <p className="text-xs text-stadio-gray mt-1">accesos en {periodLabel}</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-stadio-black dark:text-white">
            {hours}h {mins}min
          </p>
          <p className="text-xs text-stadio-gray mt-1">tiempo total dentro</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm p-5">
        <h3 className="text-sm font-bold text-stadio-black dark:text-white mb-4">Historial</h3>
        {records.length === 0 ? (
          <p className="text-sm text-stadio-gray dark:text-white/50">No hay accesos registrados en {periodLabel}.</p>
        ) : (
          <div className="space-y-3">
            {records.map((a) => (
              <div key={a.id} className="rounded-xl border border-gray-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-stadio-gray">
                    {a.day} · {a.date}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-green">
                    <LogIn size={15} /> Entrada · {a.entry}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray-dark dark:text-white/60">
                    {a.method}
                  </span>
                  {a.exit ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-red">
                      <LogOut size={15} /> Salida · {a.exit}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray">
                      <MinusCircle size={15} /> Salida no registrada
                    </span>
                  )}
                  {a.exit && (
                    <span className="ml-auto rounded-full bg-stadio-gray-light dark:bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
                      {durationLabel(a.entry, a.exit)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
