import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarCheck2, Trash2 } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardBody } from "./Card";
import { ClassDetailModal } from "./ClassDetailModal";
import { dateToKey } from "../data/classes";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSwipe } from "../hooks/useSwipe";
import type { GymClass } from "../types";

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const YEAR_START = 2024;
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth();
const CURRENT_DAY = TODAY.getDate();
const MAX_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH + 1, CURRENT_DAY);
const MAX_YEAR = MAX_DATE.getFullYear();
const MAX_MONTH = MAX_DATE.getMonth();
const MAX_DAY = MAX_DATE.getDate();
const YEARS = Array.from({ length: MAX_YEAR - YEAR_START + 1 }, (_, i) => YEAR_START + i);
const MAX_SELECTABLE_DAY = (y: number, m: number) =>
  y === MAX_YEAR && m === MAX_MONTH ? MAX_DAY : new Date(y, m + 1, 0).getDate();

const selectClass =
  "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red";

type View = "month" | "week" | "day";

interface Props {
  classes: GymClass[];
  onEdit: (c: GymClass) => void;
  onDelete: (c: GymClass) => void;
}

function classesOnDate(classes: GymClass[], date: Date): GymClass[] {
  const key = dateToKey(date);
  return classes
    .filter((c) => c.date === key)
    .sort((a, b) => a.time.localeCompare(b.time));
}

function addDays(base: Date, delta: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + delta);
  return d;
}

function mondayOf(base: Date): Date {
  const d = new Date(base);
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function fmtDay(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function ClassesCalendar({ classes, onEdit, onDelete }: Props) {
  const isMobile = !useMediaQuery("(min-width: 640px)");
  const [view, setView] = useState<View>(isMobile ? "day" : "month");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [monthIndex, setMonthIndex] = useState(CURRENT_MONTH);
  const [day, setDay] = useState(CURRENT_DAY);
  const [detail, setDetail] = useState<GymClass | null>(null);

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const focused = new Date(year, monthIndex, day);

  const clampDay = (y: number, m: number) => Math.min(day, MAX_SELECTABLE_DAY(y, m));

  const goToday = () => {
    setYear(CURRENT_YEAR);
    setMonthIndex(CURRENT_MONTH);
    setDay(CURRENT_DAY);
  };

  const goPrev = () => {
    if (view === "day") {
      const d = addDays(focused, -1);
      setYear(d.getFullYear()); setMonthIndex(d.getMonth()); setDay(d.getDate());
    } else if (view === "week") {
      const d = addDays(focused, -7);
      setYear(d.getFullYear()); setMonthIndex(d.getMonth()); setDay(d.getDate());
    } else if (monthIndex === 0) {
      setMonthIndex(11);
      setYear((y) => Math.max(YEARS[0], y - 1));
    } else {
      setMonthIndex((m) => m - 1);
    }
  };

  const goNext = () => {
    if (view === "day") {
      const d = addDays(focused, 1);
      if (d.getTime() > MAX_DATE.getTime()) return;
      setYear(d.getFullYear()); setMonthIndex(d.getMonth()); setDay(d.getDate());
    } else if (view === "week") {
      const d = addDays(focused, 7);
      const weekEnd = addDays(mondayOf(d), 6);
      if (weekEnd.getTime() > MAX_DATE.getTime()) return;
      setYear(d.getFullYear()); setMonthIndex(d.getMonth()); setDay(d.getDate());
    } else if (year === MAX_YEAR && monthIndex === MAX_MONTH) {
      return;
    } else if (monthIndex === 11) {
      setMonthIndex(0);
      setYear((y) => Math.min(YEARS[YEARS.length - 1], y + 1));
    } else {
      setMonthIndex((m) => m + 1);
    }
  };

  const swipe = useSwipe(goNext, goPrev);

  const changeMonth = (m: number) => {
    setMonthIndex(m);
    setDay((d) => Math.min(d, MAX_SELECTABLE_DAY(year, m)));
  };
  const changeYear = (y: number) => {
    setYear(y);
    setMonthIndex((m) => (y === MAX_YEAR ? Math.min(m, MAX_MONTH) : m));
    setDay((d) =>
      Math.min(
        d,
        MAX_SELECTABLE_DAY(y, y === MAX_YEAR ? Math.min(monthIndex, MAX_MONTH) : monthIndex)
      )
    );
  };

  const renderMonth = () => {
    const lead = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const cells: (number | null)[] = [...Array.from({ length: lead }, () => null), ...days];
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div className="overflow-x-auto">
      <div className="grid min-w-[560px] grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-center text-xs font-bold uppercase tracking-wider text-stadio-gray">
            {w}
          </div>
        ))}
        {cells.map((d, idx) => {
          if (!d) return <div key={`empty-${idx}`} className="min-h-[92px] rounded-xl border border-transparent" />;
          const cellDate = new Date(year, monthIndex, d);
          const isBeyond = cellDate.getTime() > MAX_DATE.getTime();
          const isToday = cellDate.getFullYear() === CURRENT_YEAR && cellDate.getMonth() === CURRENT_MONTH && cellDate.getDate() === CURRENT_DAY;
          return (
            <div
              key={d}
              onClick={() => { if (view === "month" && !isBeyond) { setDay(d); setView("day"); } }}
              className={`min-h-[92px] rounded-xl border p-2 transition-colors ${
                isBeyond
                  ? "cursor-not-allowed border-gray-100/50 bg-stadio-gray-light/50 dark:border-white/5 dark:bg-white/[0.02]"
                  : "cursor-pointer hover:border-stadio-red/50"
              } ${
                isToday
                  ? "border-stadio-red/60 bg-stadio-red/5 dark:bg-red-950/30"
                  : "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5"
              }`}
            >
              <p className={`text-xs font-bold ${isToday ? "text-stadio-red" : isBeyond ? "text-stadio-gray/60 dark:text-white/30" : "text-stadio-black dark:text-white"}`}>
                {d}
              </p>
              <div className="mt-1.5 space-y-1">
                {classesOnDate(classes, cellDate).map((c) => (
                  <ClassChip key={c.id} c={c} onDetails={setDetail} onDelete={onDelete} />
                ))}
                {classesOnDate(classes, cellDate).length === 0 && (
                  <p className="text-[10px] text-stadio-gray dark:text-white/30">Sin clases</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    );
  };

  const renderWeek = () => {
    const monday = mondayOf(focused);
    return (
      <div className="overflow-x-auto">
      <div className="grid min-w-[560px] grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-center text-xs font-bold uppercase tracking-wider text-stadio-gray">
            {w}
          </div>
        ))}
        {Array.from({ length: 7 }, (_, i) => addDays(monday, i)).map((d) => {
          const isToday = d.getFullYear() === CURRENT_YEAR && d.getMonth() === CURRENT_MONTH && d.getDate() === CURRENT_DAY;
          const isBeyond = d.getTime() > MAX_DATE.getTime();
          const dayClasses = classesOnDate(classes, d);
          return (
            <div
              key={d.toISOString()}
              onClick={() => { if (!isBeyond) { setYear(d.getFullYear()); setMonthIndex(d.getMonth()); setDay(d.getDate()); setView("day"); } }}
              className={`min-h-[92px] rounded-xl border p-2 transition-colors ${
                isBeyond
                  ? "cursor-not-allowed border-gray-100/50 bg-stadio-gray-light/50 dark:border-white/5 dark:bg-white/[0.02]"
                  : isToday ? "cursor-pointer border-stadio-red/60 bg-stadio-red/5 dark:bg-red-950/30"
                  : "cursor-pointer border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-stadio-red/50"
              }`}
            >
              <p className={`text-xs font-bold ${isToday ? "text-stadio-red" : isBeyond ? "text-stadio-gray/60 dark:text-white/30" : "text-stadio-black dark:text-white"}`}>
                {d.getDate()}
              </p>
              <div className="mt-1.5 space-y-1">
                {dayClasses.map((c) => (
                  <ClassChip key={c.id} c={c} onDetails={setDetail} onDelete={onDelete} />
                ))}
                {dayClasses.length === 0 && (
                  <p className="text-[10px] text-stadio-gray dark:text-white/30">Sin clases</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    );
  };

  const renderDay = () => {
    const dayClasses = classesOnDate(classes, focused);
    return (
      <div className="space-y-2">
        {dayClasses.length === 0 && (
          <p className="rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-6 text-center text-sm text-stadio-gray dark:text-white/50">
            No hay clases el {fmtDay(focused)}.
          </p>
        )}
        {dayClasses.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-3 cursor-pointer hover:border-stadio-red/50"
            onClick={() => setDetail(c)}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-14 place-items-center rounded-lg bg-stadio-red/10 text-xs font-extrabold text-stadio-red">
                {c.time}
              </span>
              <div>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{c.name}</p>
                <p className="text-xs text-stadio-gray">{c.trainer} · {c.room} · {c.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={c.booked >= c.capacity ? "error" : "info"}>{c.booked}/{c.capacity}</Badge>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(c); }}
                className="rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <div className="flex flex-col gap-3 rounded-t-2xl p-4 pt-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black p-1">
            {(["month", "week", "day"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                  view === v
                    ? "bg-stadio-red text-white"
                    : "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                }`}
              >
                {v === "month" ? "Mes" : v === "week" ? "Semana" : "Día"}
              </button>
            ))}
          </div>
          <button onClick={goPrev} className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10" aria-label="Anterior">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNext} className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10" aria-label="Siguiente">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {view === "day" && (
            <select
              aria-label="Día"
              value={clampDay(year, monthIndex)}
              onChange={(e) => setDay(Number(e.target.value))}
              className={selectClass}
            >
              {Array.from({ length: MAX_SELECTABLE_DAY(year, monthIndex) }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          )}
          <select value={monthIndex} onChange={(e) => changeMonth(Number(e.target.value))} aria-label="Mes" className={selectClass}>
            {MONTHS.map((m, i) => (year < MAX_YEAR || i <= MAX_MONTH ? <option key={m} value={i}>{m}</option> : null))}
          </select>
          <select value={year} onChange={(e) => changeYear(Number(e.target.value))} aria-label="Año" className={selectClass}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={goToday}>
            <CalendarCheck2 size={14} /> HOY
          </Button>
        </div>
      </div>

      <CardBody {...(view === "day" ? swipe : {})}>
        {view === "month" && renderMonth()}
        {view === "week" && renderWeek()}
        {view === "day" && renderDay()}
      </CardBody>

      <ClassDetailModal
        gymClass={detail}
        onClose={() => setDetail(null)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Card>
  );
}

function ClassChip({ c, onDetails, onDelete }: { c: GymClass; onDetails: (c: GymClass) => void; onDelete: (c: GymClass) => void }) {
  return (
    <button
      onClick={() => onDetails(c)}
      className="group/class block w-full rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-1.5 text-left transition-colors hover:border-stadio-red/50"
      title={c.name}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-stadio-red">{c.time}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(c); }}
          className="rounded p-0.5 text-stadio-gray opacity-0 transition-opacity group-hover/class:opacity-100 hover:text-stadio-red"
          aria-label="Eliminar"
        >
          <Trash2 size={10} />
        </button>
      </div>
      <p className="truncate text-[11px] font-bold text-stadio-black dark:text-white">{c.name}</p>
      <p className="truncate text-[10px] text-stadio-gray">{c.trainer} · {c.booked}/{c.capacity}</p>
    </button>
  );
}