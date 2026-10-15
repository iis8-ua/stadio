import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarCheck2, Clock, DoorOpen, Dumbbell, Users, User, CheckCircle2, XCircle, CalendarCheck, AlignLeft } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card, CardBody } from "./Card";
import { Modal } from "./Modal";
import { Confirmation } from "./Confirmation";
import { getBookingForClass, cancelBooking } from "../features/bookings/clientBookings";
import { dateToKey, fmtShortDate } from "../data/classes";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSwipe } from "../hooks/useSwipe";
import type { GymClass, Booking } from "../types";

const YEAR_START = 2024;
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth();
const CURRENT_DAY = TODAY.getDate();
const MAX_DATE = new Date(CURRENT_YEAR, CURRENT_MONTH + 1, CURRENT_DAY);
const MAX_YEAR = MAX_DATE.getFullYear();
const MAX_MONTH = MAX_DATE.getMonth();
const MAX_DAY = MAX_DATE.getDate();
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const YEARS = Array.from({ length: MAX_YEAR - YEAR_START + 1 }, (_, i) => YEAR_START + i);
const MAX_SELECTABLE_DAY = (y: number, m: number) =>
  y === MAX_YEAR && m === MAX_MONTH ? MAX_DAY : new Date(y, m + 1, 0).getDate();
const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

type View = "month" | "week" | "day";

const selectClass =
  "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-3 py-1.5 text-sm font-semibold text-stadio-black dark:text-white focus:outline-none focus:ring-2 focus:ring-stadio-red/40";

function classesOnDate(classes: GymClass[], date: Date): GymClass[] {
  const key = dateToKey(date);
  return classes.filter((c) => c.date === key);
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

function fmtDay(d: Date): string {
  const s = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Color del chip de clase según su estado: reservada, completa o disponible. */
function chipClass(c: GymClass, booked: boolean): string {
  if (booked) return "border-stadio-green/50 bg-stadio-green-bg dark:border-green-900/40 dark:bg-green-950/40";
  if (c.booked >= c.capacity) return "border-stadio-red/40 bg-stadio-red/10 dark:border-red-900/40 dark:bg-red-950/40";
  return "border-gray-100 bg-white hover:border-stadio-red/50 dark:border-white/10 dark:bg-white/5";
}

interface Props {
  classes: GymClass[];
}

export function ClientClassesCalendar({ classes }: Props) {
  const isMobile = !useMediaQuery("(min-width: 640px)");
  const [view, setView] = useState<View>(isMobile ? "day" : "month");
  const [year, setYear] = useState(CURRENT_YEAR);
  const [monthIndex, setMonthIndex] = useState(CURRENT_MONTH);
  const [day, setDay] = useState(CURRENT_DAY);
  const [detail, setDetail] = useState<GymClass | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [, setTick] = useState(0);
  const navigate = useNavigate();

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

  const handleBook = (c: GymClass) => {
    setDetail(null);
    navigate(`/client/bookings/${c.id}`);
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    cancelBooking(cancelTarget.id);
    setCancelTarget(null);
    setDetail(null);
    setTick((t) => t + 1);
  };

  const bookingAction = (c: GymClass) => {
    const booking = getBookingForClass(c.id, c.day);
    if (booking) {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-stadio-green">
            <CheckCircle2 size={14} /> Reservado
          </span>
          <button
            onClick={() => setCancelTarget(booking)}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <XCircle size={14} /> CANCELAR
          </button>
        </div>
      );
    }
    if (c.booked >= c.capacity) return <Badge variant="error">Clase completa</Badge>;
    return (
      <Button size="sm" onClick={() => handleBook(c)}>
        <CalendarCheck size={14} /> RESERVAR
      </Button>
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
                  <button
                    key={c.id}
                    onClick={(e) => { e.stopPropagation(); setDetail(c); }}
                    className={`group/class block w-full rounded-lg border p-1.5 text-left transition-colors ${chipClass(c, Boolean(getBookingForClass(c.id, c.day)))}`}
                    title={c.name}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-stadio-red">{c.time}</span>
                      {getBookingForClass(c.id, c.day) && (
                        <CheckCircle2 size={10} className="text-stadio-green" />
                      )}
                    </div>
                    <p className="truncate text-[11px] font-bold text-stadio-black dark:text-white">{c.name}</p>
                    <p className="truncate text-[10px] text-stadio-gray">{c.trainer} · {c.booked}/{c.capacity}</p>
                  </button>
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
                  <button
                    key={c.id}
                    onClick={(e) => { e.stopPropagation(); setDetail(c); }}
                    className={`group/class block w-full rounded-lg border p-1.5 text-left transition-colors ${chipClass(c, Boolean(getBookingForClass(c.id, c.day)))}`}
                    title={c.name}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-stadio-red">{c.time}</span>
                      {getBookingForClass(c.id, c.day) ? (
                        <CheckCircle2 size={10} className="text-stadio-green" />
                      ) : null}
                    </div>
                    <p className="truncate text-[11px] font-bold text-stadio-black dark:text-white">{c.name}</p>
                    <p className="truncate text-[10px] text-stadio-gray">{c.booked}/{c.capacity}</p>
                  </button>
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
            <div onClick={(e) => e.stopPropagation()}>{bookingAction(c)}</div>
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

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 pb-2 text-[11px] font-semibold text-stadio-gray dark:text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-gray-200 bg-white dark:border-white/15 dark:bg-white/5" /> Disponible
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-stadio-green/50 bg-stadio-green-bg dark:bg-green-950/50" /> Reservada
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-stadio-red/40 bg-stadio-red/10 dark:bg-red-950/50" /> Completa
        </span>
      </div>

      <CardBody {...(view === "day" ? swipe : {})}>
        {view === "month" && renderMonth()}
        {view === "week" && renderWeek()}
        {view === "day" && renderDay()}
      </CardBody>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail ? detail.name : ""}>
        {detail && (
          <div className="space-y-4">
            <div className="rounded-xl bg-stadio-gray-light/50 dark:bg-white/5 p-3">
              <p className="text-xs font-bold uppercase tracking-wider text-stadio-gray">{fmtShortDate(detail.date)} · {detail.time}</p>
              <p className="mt-1 flex items-start gap-1.5 text-sm text-stadio-gray dark:text-white/60">
                <AlignLeft size={14} className="mt-0.5 shrink-0" /> {detail.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <DetailRow icon={User} label="Empleado" value={detail.trainer} />
              <DetailRow icon={Clock} label="Duración" value={detail.duration} />
              <DetailRow icon={DoorOpen} label="Sala" value={detail.room} />
              <DetailRow icon={Users} label="Ocupación" value={`${detail.booked} / ${detail.capacity} usuarios`} />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-stadio-gray">Material / Equipamiento</p>
              {(detail.materials ?? []).length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {detail.materials!.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 rounded-full bg-stadio-red/10 px-2.5 py-1 text-xs font-bold text-stadio-red">
                      <Dumbbell size={12} /> {m}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stadio-gray dark:text-white/50">Sin material registrado</p>
              )}
            </div>

            <div className="pt-1">{bookingAction(detail)}</div>
          </div>
        )}
      </Modal>

      <Confirmation
        open={cancelTarget !== null}
        title="Cancelar reserva"
        message={`¿Quieres cancelar tu plaza en ${cancelTarget?.className} (${cancelTarget?.date} · ${cancelTarget?.time})?`}
        confirmLabel="Sí, cancelar"
        danger
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </Card>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">{label}</p>
        <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{value}</p>
      </div>
    </div>
  );
}