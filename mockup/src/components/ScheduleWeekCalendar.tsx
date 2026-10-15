import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "./Card";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Field, Input, Select } from "./Input";
import { ClassDetailModal } from "./ClassDetailModal";
import {
  addScheduleEntry,
  deleteScheduleEntry,
  getScheduleForDate,
  updateScheduleEntry,
} from "../features/schedule/trainerSchedule";
import type { ScheduleEntry } from "../features/schedule/trainerSchedule";
import { classTypes, classSessions, resolveGymClasses } from "../data/classes";
import { facilityRooms, findEmployeeById, getShiftForDate } from "../data/employees";
import { clients } from "../data/users";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useSwipe } from "../hooks/useSwipe";
import { CURRENT_TRAINER_ID, getAssignedTrainerId } from "../features/trainer/personalTrainer";
import type { GymClass } from "../types";

const DAY_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAY_LONG = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const START_HOUR = 7;
const END_HOUR = 23;
const ROW_H = 46;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

interface EditorState {
  date: string;
  entry?: ScheduleEntry;
  start?: string;
  end?: string;
}

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

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function topFor(t: string): number {
  return ((timeToMinutes(t) - START_HOUR * 60) / 60) * ROW_H;
}

function heightFor(start: string, end: string): number {
  return Math.max(22, ((timeToMinutes(end) - timeToMinutes(start)) / 60) * ROW_H);
}

function addMinutesToTime(t: string, mins: number): string {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}

function endOfClass(c: GymClass): string {
  return addMinutesToTime(c.time, parseInt(c.duration, 10) || 45);
}

/** Otras actividades planificables a mano (las clases se cargan solas). */
function activityOptions(current?: string): string[] {
  const personal = clients
    .filter((c) => getAssignedTrainerId(c.id) === CURRENT_TRAINER_ID)
    .map((c) => `Entrenamiento personal · ${c.name}`);
  const options = [...new Set([...personal, "Revisión rutinas", "Reserva gimnasio libre"])];
  if (current && !options.includes(current)) options.push(current);
  return options;
}

function roomOptions(current?: string): string[] {
  const options = facilityRooms.filter((r) => r.status === "Disponible").map((r) => r.name);
  if (current && !options.includes(current)) options.push(current);
  return options;
}

export function ScheduleWeekCalendar() {
  const [, setTick] = useState(0);
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [mobileDay, setMobileDay] = useState(() => (new Date().getDay() + 6) % 7);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [detailClass, setDetailClass] = useState<GymClass | null>(null);
  const refresh = () => setTick((t) => t + 1);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const trainer = findEmployeeById(CURRENT_TRAINER_ID);
  const assignedNames = classTypes.filter((t) => trainer?.classIds.includes(t.id)).map((t) => t.name);
  const gymClasses = resolveGymClasses(classTypes, classSessions);
  const classBlocks = gymClasses.filter((c) => assignedNames.includes(c.name));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayIso = toIso(new Date());
  const weekLabel = `Semana del ${fmt(weekStart)} al ${fmt(addDays(weekStart, 6))}`;

  const classesFor = (iso: string) =>
    classBlocks.filter((c) => c.date === iso).sort((a, b) => a.time.localeCompare(b.time));

  const openAdd = (iso: string) => {
    const shift = getShiftForDate(trainer, iso);
    const start = shift?.from ?? "09:00";
    setEditor({ date: iso, start, end: addMinutesToTime(start, 60) });
  };

  return (
    <Card>
      <CardHeader
        title="TU JORNADA"
        subtitle={weekLabel}
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
        <div className="flex flex-wrap items-center gap-4 text-xs text-stadio-gray">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border border-stadio-green/40 bg-stadio-green-bg dark:bg-green-950/50" /> Jornada
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-stadio-red" /> Clases
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-blue-600" /> Otras actividades
          </span>
        </div>

        {isDesktop ? (
          <div className="overflow-x-auto">
            <div className="min-w-[780px]">
              <div className="flex border-b border-gray-100 dark:border-white/10">
                <div className="w-14 shrink-0" />
                {days.map((d, i) => {
                  const iso = toIso(d);
                  const isToday = iso === todayIso;
                  return (
                    <div
                      key={iso}
                      className={`flex-1 border-l border-gray-100 px-1 py-1.5 text-center dark:border-white/10 ${
                        isToday ? "bg-stadio-red/5" : ""
                      }`}
                    >
                      <p className={`text-xs font-bold ${isToday ? "text-stadio-red" : "text-stadio-gray"}`}>
                        {DAY_SHORT[i]} {d.getDate()} {MONTHS[d.getMonth()]}
                      </p>
                      <button
                        type="button"
                        onClick={() => openAdd(iso)}
                        className="mt-1 inline-flex items-center gap-0.5 rounded-md border border-dashed border-gray-200 px-1.5 py-0.5 text-[10px] font-bold text-stadio-gray transition-colors hover:border-stadio-red/40 hover:text-stadio-red dark:border-white/15"
                      >
                        <Plus size={10} /> AÑADIR
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex">
                <div className="w-14 shrink-0">
                  {HOURS.map((h) => (
                    <div key={h} style={{ height: ROW_H }} className="relative">
                      <span className="absolute -top-2 right-1 text-[10px] font-semibold text-stadio-gray">
                        {pad(h)}:00
                      </span>
                    </div>
                  ))}
                </div>

                {days.map((d) => {
                  const iso = toIso(d);
                  const shift = getShiftForDate(trainer, iso);
                  const entries = getScheduleForDate(iso);
                  const classes = classesFor(iso);
                  const isToday = iso === todayIso;
                  return (
                    <div
                      key={iso}
                      className={`relative flex-1 border-l border-gray-100 dark:border-white/10 ${
                        isToday ? "bg-stadio-red/5" : ""
                      }`}
                    >
                      {HOURS.map((h) => (
                        <div key={h} style={{ height: ROW_H }} className="border-b border-gray-100 dark:border-white/10" />
                      ))}

                      {shift && (
                        <div
                          className="pointer-events-none absolute inset-x-0 border-x border-stadio-green/40 bg-stadio-green-bg/70 dark:bg-green-950/30"
                          style={{ top: topFor(shift.from), height: heightFor(shift.from, shift.to) }}
                        >
                          <span className="absolute left-1 top-0.5 text-[9px] font-bold text-stadio-green">
                            {shift.from}–{shift.to}
                          </span>
                        </div>
                      )}

                      {classes.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setDetailClass(c)}
                          style={{ top: topFor(c.time), height: heightFor(c.time, endOfClass(c)) }}
                          className="absolute left-0.5 right-0.5 overflow-hidden rounded-md bg-stadio-red px-1.5 py-0.5 text-left text-white shadow-sm transition-colors hover:bg-red-700"
                        >
                          <p className="text-[10px] font-extrabold leading-tight">{c.time}</p>
                          <p className="truncate text-[11px] font-bold leading-tight">{c.name}</p>
                          <p className="truncate text-[10px] leading-tight text-white/80">{c.room}</p>
                        </button>
                      ))}

                      {entries.map((e) => (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setEditor({ date: iso, entry: e })}
                          style={{ top: topFor(e.start), height: heightFor(e.start, e.end) }}
                          className="absolute left-0.5 right-0.5 overflow-hidden rounded-md bg-blue-600 px-1.5 py-0.5 text-left text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                          <p className="text-[10px] font-extrabold leading-tight">
                            {e.start}–{e.end}
                          </p>
                          <p className="truncate text-[11px] font-bold leading-tight">{e.title}</p>
                          {e.room && <p className="truncate text-[10px] leading-tight text-white/80">{e.room}</p>}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <MobileDay
            days={days}
            mobileDay={mobileDay}
            setMobileDay={setMobileDay}
            todayIso={todayIso}
            trainer={trainer}
            classesFor={classesFor}
            onAdd={openAdd}
            onOpenClass={setDetailClass}
            onEditEntry={(iso, entry) => setEditor({ date: iso, entry })}
          />
        )}
      </CardBody>

      {editor && <ScheduleEntryModal state={editor} onClose={() => setEditor(null)} onSaved={refresh} />}
      <ClassDetailModal gymClass={detailClass} onClose={() => setDetailClass(null)} />
    </Card>
  );
}

function MobileDay({
  days,
  mobileDay,
  setMobileDay,
  todayIso,
  trainer,
  classesFor,
  onAdd,
  onOpenClass,
  onEditEntry,
}: {
  days: Date[];
  mobileDay: number;
  setMobileDay: (i: number) => void;
  todayIso: string;
  trainer: ReturnType<typeof findEmployeeById>;
  classesFor: (iso: string) => GymClass[];
  onAdd: (iso: string) => void;
  onOpenClass: (c: GymClass) => void;
  onEditEntry: (iso: string, entry: ScheduleEntry) => void;
}) {
  const day = days[mobileDay];
  const iso = `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
  const shift = getShiftForDate(trainer, iso);
  const classes = classesFor(iso);
  const entries = getScheduleForDate(iso);

  const swipe = useSwipe(
    () => setMobileDay(Math.min(6, mobileDay + 1)),
    () => setMobileDay(Math.max(0, mobileDay - 1))
  );

  const items = [
    ...classes.map((c) => ({ kind: "class" as const, start: c.time, gymClass: c })),
    ...entries.map((e) => ({ kind: "entry" as const, start: e.start, entry: e })),
  ].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="space-y-3" {...swipe}>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {days.map((d, i) => {
          const isToday = toIso(d) === todayIso;
          const active = i === mobileDay;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setMobileDay(i)}
              className={`flex min-w-[46px] flex-1 flex-col items-center rounded-lg px-2 py-1.5 text-center transition-colors ${
                active
                  ? "bg-stadio-red text-white"
                  : `border border-gray-200 text-stadio-gray-dark dark:border-white/15 dark:text-white/60 ${
                      isToday ? "text-stadio-red" : ""
                    }`
              }`}
            >
              <span className="text-[11px] font-bold">{DAY_SHORT[i]}</span>
              <span className="text-[11px]">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm font-extrabold text-stadio-black dark:text-white">
        {DAY_LONG[mobileDay]} {fmt(day)}
      </p>

      {shift && (
        <div className="rounded-xl border border-stadio-green/40 bg-stadio-green-bg px-3 py-2 dark:bg-green-950/40">
          <p className="text-xs font-bold uppercase tracking-wide text-stadio-green">Jornada de trabajo</p>
          <p className="text-sm font-bold text-stadio-black dark:text-white">
            Entrada {shift.from} · Salida {shift.to}
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-stadio-gray dark:border-white/15 dark:text-white/50">
          Sin actividad este día.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((it) =>
            it.kind === "class" ? (
              <button
                key={it.gymClass.id}
                type="button"
                onClick={() => onOpenClass(it.gymClass)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 border-l-4 border-l-stadio-red p-3 text-left dark:border-white/10"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stadio-red">
                    {it.gymClass.time}–{endOfClass(it.gymClass)}
                  </p>
                  <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{it.gymClass.name}</p>
                  <p className="truncate text-xs text-stadio-gray">
                    {it.gymClass.room} · {it.gymClass.booked}/{it.gymClass.capacity} plazas
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-stadio-gray" />
              </button>
            ) : (
              <button
                key={it.entry.id}
                type="button"
                onClick={() => onEditEntry(iso, it.entry)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 border-l-4 border-l-blue-600 p-3 text-left dark:border-white/10"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-blue-600">
                    {it.entry.start}–{it.entry.end}
                  </p>
                  <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{it.entry.title}</p>
                  {it.entry.room && <p className="truncate text-xs text-stadio-gray">{it.entry.room}</p>}
                </div>
                <ChevronRight size={16} className="shrink-0 text-stadio-gray" />
              </button>
            )
          )}
        </div>
      )}

      <Button variant="secondary" className="w-full" onClick={() => onAdd(iso)}>
        <Plus size={15} /> AÑADIR ACTIVIDAD
      </Button>
    </div>
  );
}

function ScheduleEntryModal({
  state,
  onClose,
  onSaved,
}: {
  state: EditorState;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [start, setStart] = useState(state.entry?.start ?? state.start ?? "");
  const [end, setEnd] = useState(state.entry?.end ?? state.end ?? "");
  const [title, setTitle] = useState(state.entry?.title ?? "");
  const [room, setRoom] = useState(state.entry?.room ?? "");

  const activities = activityOptions(state.entry?.title);
  const rooms = roomOptions(state.entry?.room);

  const valid = Boolean(start && end && title.trim());

  const save = () => {
    if (!valid) return;
    if (state.entry) {
      updateScheduleEntry(state.entry.id, { start, end, title: title.trim(), room: room.trim() });
    } else {
      addScheduleEntry({ date: state.date, start, end, title: title.trim(), room: room.trim() });
    }
    onSaved();
    onClose();
  };

  const remove = () => {
    if (!state.entry) return;
    deleteScheduleEntry(state.entry.id);
    onSaved();
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={`Actividad · ${fmt(parseIso(state.date))}`}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hora inicio">
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Hora fin">
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>
        <Field label="Actividad">
          <Select value={title} onChange={(e) => setTitle(e.target.value)}>
            <option value="">Selecciona una actividad…</option>
            {activities.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </Select>
        </Field>
        <Field label="Sala (opcional)">
          <Select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option value="">Sin sala</option>
            {rooms.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <div className="flex items-center justify-between gap-2 pt-1">
          {state.entry ? (
            <Button variant="danger" onClick={remove}>
              <Trash2 size={15} /> Eliminar
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={save} disabled={!valid}>Guardar</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
