import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardBody } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Modal } from "./Modal";
import {
  clearRoutineForDate,
  getRoutineForDate,
  setRoutineForDate,
} from "../features/routines/routineAssignments";

interface Option {
  id: string;
  name: string;
}

interface RoutineWeekCalendarProps {
  clientId: string;
  routines: Option[];
  onChange?: () => void;
}

const DAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseIso(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

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

function fmt(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function RoutineWeekCalendar({ clientId, routines, onChange }: RoutineWeekCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [openDate, setOpenDate] = useState<string | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayIso = toIso(new Date());
  const weekLabel = `Semana del ${fmt(weekStart)} al ${fmt(addDays(weekStart, 6))}`;
  const openEntry = openDate ? getRoutineForDate(clientId, openDate) : undefined;

  const assign = (routine: Option) => {
    if (!openDate) return;
    setRoutineForDate(clientId, openDate, routine.id, routine.name);
    onChange?.();
    setOpenDate(null);
  };

  const clear = () => {
    if (!openDate) return;
    clearRoutineForDate(clientId, openDate);
    onChange?.();
    setOpenDate(null);
  };

  return (
    <Card>
      <CardHeader
        title="CALENDARIO DE RUTINAS"
        action={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setWeekStart((w) => addDays(w, -7))}
              className="rounded-lg p-1.5 text-stadio-gray-dark hover:bg-stadio-gray-light dark:text-white/60 dark:hover:bg-white/10"
              aria-label="Semana anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setWeekStart(mondayOf(new Date()))}
              className="rounded-lg border border-gray-200 dark:border-white/10 px-2.5 py-1 text-xs font-bold text-stadio-gray-dark hover:bg-stadio-gray-light dark:text-white/60 dark:hover:bg-white/10"
            >
              HOY
            </button>
            <button
              type="button"
              onClick={() => setWeekStart((w) => addDays(w, 7))}
              className="rounded-lg p-1.5 text-stadio-gray-dark hover:bg-stadio-gray-light dark:text-white/60 dark:hover:bg-white/10"
              aria-label="Semana siguiente"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        }
      />
      <CardBody className="space-y-3">
        <p className="text-sm font-extrabold text-stadio-black dark:text-white">{weekLabel}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {days.map((d, i) => {
            const iso = toIso(d);
            const entry = getRoutineForDate(clientId, iso);
            const isToday = iso === todayIso;
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setOpenDate(iso)}
                className={`flex min-h-[96px] flex-col gap-2 rounded-xl border p-3 text-left transition-colors ${
                  isToday
                    ? "border-stadio-red/50 bg-stadio-red/5"
                    : "border-gray-100 hover:border-stadio-red/40 dark:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stadio-gray">{DAY_NAMES[i]}</span>
                  <span className={`text-xs font-bold ${isToday ? "text-stadio-red" : "text-stadio-gray"}`}>
                    {d.getDate()} {MONTHS[d.getMonth()]}
                  </span>
                </div>
                {entry ? (
                  <Badge variant="info">{entry.routineName}</Badge>
                ) : (
                  <span className="text-xs text-stadio-gray dark:text-white/40">Libre</span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-stadio-gray dark:text-white/40">Pulsa un día para asignarle una rutina.</p>
      </CardBody>

      <Modal
        open={openDate !== null}
        onClose={() => setOpenDate(null)}
        title={openDate ? `Rutina · ${fmt(parseIso(openDate))}` : "Rutina"}
      >
        <div className="space-y-2">
          {routines.length === 0 ? (
            <p className="text-sm text-stadio-gray dark:text-white/50">
              No tienes rutinas en la biblioteca. Crea una primero.
            </p>
          ) : (
            routines.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => assign(r)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  openEntry?.routineId === r.id
                    ? "border-stadio-red bg-stadio-red/5 dark:bg-stadio-red/10"
                    : "border-gray-100 hover:border-stadio-red/40 dark:border-white/10"
                }`}
              >
                <span className="text-sm font-bold text-stadio-black dark:text-white">{r.name}</span>
                {openEntry?.routineId === r.id && <Badge variant="success" dot>Asignada</Badge>}
              </button>
            ))
          )}
          {openEntry && (
            <Button variant="danger" className="w-full" onClick={clear}>
              QUITAR RUTINA
            </Button>
          )}
        </div>
      </Modal>
    </Card>
  );
}
