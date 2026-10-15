import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Dumbbell, CalendarDays } from "lucide-react";
import { getTrainingMonths, getWeekSummary, type FinishedTraining } from "../features/training/trainingHistory";
import { getClientProfile } from "../features/profile/clientProfile";

const DAY_LETTERS = ["L", "M", "X", "J", "V", "S", "D"];

type Mode = "semana" | "mes" | "año";

function mondayOf(d: Date): Date {
  const day = (d.getDay() + 6) % 7;
  const out = new Date(d);
  out.setDate(d.getDate() - day);
  out.setHours(12, 0, 0, 0);
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(d.getDate() + n);
  return out;
}

interface Week {
  id: string;
  label: string;
  workouts: FinishedTraining[];
}

function buildWeeks(workouts: FinishedTraining[]): Week[] {
  const map = new Map<string, { monday: Date; workouts: FinishedTraining[] }>();
  for (const w of workouts) {
    const monday = mondayOf(new Date(`${w.date}T12:00:00`));
    const key = monday.toISOString();
    const entry = map.get(key) ?? { monday, workouts: [] };
    entry.workouts.push(w);
    map.set(key, entry);
  }
  return [...map.values()]
    .sort((a, b) => b.monday.getTime() - a.monday.getTime())
    .map(({ monday, workouts }) => ({
      id: monday.toISOString(),
      label: `Semana del ${fmtShort(monday)} al ${fmtShort(addDays(monday, 6))}`,
      workouts,
    }));
}

function fmtShort(d: Date): string {
  const s = d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function workoutDate(w: FinishedTraining): Date {
  return new Date(`${w.date}T12:00:00`);
}

export function TrainingHistory() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("mes");
  const [monthIdx, setMonthIdx] = useState(0);
  const [yearIdx, setYearIdx] = useState(0);
  const [weekIdx, setWeekIdx] = useState(0);

  const months = getTrainingMonths();
  const years = [...new Set(months.map((m) => m.year))].sort((a, b) => b - a);
  const year = years[yearIdx];
  const yearMonths = months.filter((m) => m.year === year).slice().reverse();
  const month = months[monthIdx];
  const weeks = buildWeeks(months.flatMap((m) => m.workouts));
  const week = weeks[weekIdx];
  const profile = getClientProfile();

  const workouts =
    mode === "semana"
      ? week?.workouts ?? []
      : mode === "mes"
        ? month.workouts
        : months.flatMap((m) => m.workouts).filter((w) => workoutDate(w).getFullYear() === year).sort((a, b) => workoutDate(a).getTime() - workoutDate(b).getTime());

  const totalMinutes = workouts.reduce((a, w) => a + w.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const periodLabel = mode === "semana" ? week?.label ?? "" : mode === "mes" ? `${month.label} ${month.year}` : String(year);

  const goPrev = () => {
    if (mode === "semana") setWeekIdx((i) => Math.min(weeks.length - 1, i + 1));
    else if (mode === "mes") setMonthIdx((i) => Math.min(months.length - 1, i + 1));
    else setYearIdx((i) => Math.min(years.length - 1, i + 1));
  };

  const goNext = () => {
    if (mode === "semana") setWeekIdx((i) => Math.max(0, i - 1));
    else if (mode === "mes") setMonthIdx((i) => Math.max(0, i - 1));
    else setYearIdx((i) => Math.max(0, i - 1));
  };

  const formatDate = (d: string) => {
    const date = new Date(`${d}T12:00:00`);
    const s = date.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const formatNumber = (n: number) => n.toLocaleString("es-ES");

  const summaryCards =
    mode === "mes"
      ? getWeekSummary(month).map((w) => ({ label: `Semana ${w.week}`, count: w.count, days: w.days }))
      : mode === "año"
        ? yearMonths.map((m) => ({
            label: m.label,
            count: m.workouts.length,
            days: [...new Set(m.workouts.map((w) => DAY_LETTERS[(workoutDate(w).getDay() + 6) % 7]))],
          }))
        : [{
            label: periodLabel,
            count: week?.workouts.length ?? 0,
            days: [...new Set((week?.workouts ?? []).map((w) => DAY_LETTERS[(workoutDate(w).getDay() + 6) % 7]))],
          }];

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center justify-between gap-3 rounded-xl bg-stadio-gray-light/60 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 sm:flex-row">
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black p-1">
          {(["semana", "mes", "año"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                mode === m ? "bg-stadio-red text-white" : "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
              }`}
            >
              {m === "semana" ? "Semana" : m === "mes" ? "Mes" : "Año"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-white dark:hover:bg-white/10"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <p className="min-w-[180px] text-center text-sm font-extrabold text-stadio-black dark:text-white">{periodLabel}</p>
          <button
            onClick={goNext}
            className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-white dark:hover:bg-white/10"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-stadio-red to-red-800 p-4 text-white">
          <p className="text-2xl font-extrabold">{workouts.length}</p>
          <p className="text-xs text-white/70">entrenamientos</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4">
          <p className="text-2xl font-extrabold text-stadio-black dark:text-white">
            {hours}h {mins}min
          </p>
          <p className="text-xs text-stadio-gray">tiempo total</p>
        </div>
        <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4">
          <p className="text-xs font-bold text-stadio-gray">Objetivo</p>
          <p className="text-sm font-extrabold text-stadio-black dark:text-white">{profile.frequency}</p>
          <p className="text-xs text-stadio-gray">frecuencia objetivo</p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold text-stadio-black dark:text-white">
          {mode === "mes" ? "Por semana" : mode === "año" ? "Por mes" : "Resumen de la semana"}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((w) => (
            <div key={w.label} className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4">
              <p className="text-xs font-bold text-stadio-gray">{w.label}</p>
              <p className="text-sm font-extrabold text-stadio-black dark:text-white">
                {w.count} {w.count === 1 ? "día" : "días"}
              </p>
              <div className="mt-1.5 flex gap-1">
                {DAY_LETTERS.map((l) => (
                  <span
                    key={l}
                    className={`grid h-5 w-5 place-items-center rounded text-[10px] font-bold ${
                      w.days.includes(l)
                        ? "bg-stadio-red text-white"
                        : "bg-stadio-gray-light dark:bg-white/10 text-stadio-gray dark:text-white/40"
                    }`}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-stadio-black dark:text-white">
          Sesiones {mode === "semana" ? `de ${periodLabel.toLowerCase()}` : mode === "mes" ? `de ${month.label.toLowerCase()} ${month.year}` : `de ${year}`}
        </h3>
        <p className="mb-3 text-xs text-stadio-gray">Pulsa una sesión para ver el detalle</p>
        <div className="space-y-3">
          {workouts.map((t: FinishedTraining) => (
            <button
              key={t.id}
              type="button"
              onClick={() => navigate(`/client/training/session/${t.id}`)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 text-left transition-colors hover:border-stadio-red/50 dark:border-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
                  <Dumbbell size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-stadio-black dark:text-white">{t.routine}</p>
                  <p className="flex items-center gap-1.5 text-xs text-stadio-gray">
                    <CalendarDays size={13} /> {formatDate(t.date)} · {t.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-xs font-semibold text-stadio-gray">Volumen</p>
                  <p className="text-sm font-extrabold text-stadio-black dark:text-white">
                    {formatNumber(t.volume)} kg
                  </p>
                </div>
                <ChevronRight size={18} className="text-stadio-gray" />
              </div>
            </button>
          ))}
          {workouts.length === 0 && (
            <p className="rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-6 text-center text-sm text-stadio-gray dark:text-white/50">
              No hay entrenamientos en este periodo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}