import { useState } from "react";
import type { ReactNode } from "react";
import type { Booking } from "../types";
import { Select } from "./Input";

type Mode = "todos" | "mes" | "semana" | "año";

const CURRENT_YEAR = 2026;
const CURRENT_MONTH = 8;

const MONTHS_FULL = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];

const modes: { id: Mode; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "mes", label: "Mes" },
  { id: "semana", label: "Semana" },
  { id: "año", label: "Año" },
];

function parseBookingDate(b: Booking): Date | null {
  const [y, m, d] = b.date.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function monthLabel(key: string): string {
  const [name, year] = key.split(" ");
  return `${name.charAt(0)}${name.slice(1).toLowerCase()} ${year}`;
}

interface BookingsPeriodFilterProps {
  bookings: Booking[];
  children: (filtered: Booking[]) => ReactNode;
}

export function BookingsPeriodFilter({ bookings, children }: BookingsPeriodFilterProps) {
  const [mode, setMode] = useState<Mode>("todos");
  const [monthKey, setMonthKey] = useState(`${MONTHS_FULL[CURRENT_MONTH]} ${CURRENT_YEAR}`);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [week, setWeek] = useState(1);

  const yearOptions = [
    ...new Set(
      bookings.map((b) => Number(b.month.split(" ")[1])).filter((y) => Number.isFinite(y))
    ),
  ].sort((a, b) => a - b);
  const monthOptions = (yearOptions.length > 0 ? yearOptions : [CURRENT_YEAR])
    .sort((a, b) => a - b)
    .flatMap((y) => MONTHS_FULL.map((m, i) => ({ key: `${m} ${y}`, seq: y * 12 + i })))
    .sort((a, b) => a.seq - b.seq)
    .map((m) => m.key);

  const [selMonthName, selYearStr] = monthKey.split(" ");
  const selMonth = MONTHS_FULL.indexOf(selMonthName);
  const selYear = Number(selYearStr) || CURRENT_YEAR;
  const daysInSelMonth = new Date(selYear, selMonth + 1, 0).getDate();
  const weeks = Array.from({ length: Math.ceil(daysInSelMonth / 7) }, (_, i) => {
    const start = i * 7 + 1;
    const end = Math.min((i + 1) * 7, daysInSelMonth);
    return { value: i + 1, label: `Semana ${i + 1} · días ${start}–${end}` };
  });

  const filtered = bookings.filter((b) => {
    const d = parseBookingDate(b);
    if (!d) return true;
    if (mode === "año") return d.getFullYear() === year;
    if (mode === "mes") return d.getFullYear() === selYear && d.getMonth() === selMonth;
    if (mode === "semana") {
      if (d.getFullYear() !== selYear || d.getMonth() !== selMonth) return false;
      const start = (week - 1) * 7 + 1;
      const end = Math.min(week * 7, daysInSelMonth);
      return d.getDate() >= start && d.getDate() <= end;
    }
    return true;
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                mode === m.id
                  ? "bg-stadio-red text-white"
                  : "bg-stadio-gray-light text-stadio-gray-dark dark:bg-white/5 dark:text-white/60 hover:bg-stadio-gray-light/70 dark:hover:bg-white/10"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "año" && (
            <div className="w-28">
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label="Año">
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </Select>
            </div>
          )}
          {(mode === "mes" || mode === "semana") && (
            <div className="w-44">
              <Select value={monthKey} onChange={(e) => setMonthKey(e.target.value)} aria-label="Mes">
                {monthOptions.map((m) => (
                  <option key={m} value={m}>{monthLabel(m)}</option>
                ))}
              </Select>
            </div>
          )}
          {mode === "semana" && (
            <div className="w-52">
              <Select value={week} onChange={(e) => setWeek(Number(e.target.value))} aria-label="Semana">
                {weeks.map((w) => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">{children(filtered)}</div>
    </>
  );
}