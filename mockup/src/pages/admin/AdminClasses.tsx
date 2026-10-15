import { useEffect, useRef, useState } from "react";
import { Plus, Check, ChevronDown, X, Pencil } from "lucide-react";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { Confirmation } from "../../components/Confirmation";
import { Field, Input, Select, Textarea } from "../../components/Input";
import { ClassesCalendar } from "../../components/ClassesCalendar";
import {
  classTypes,
  classSessions,
  resolveGymClasses,
  generateSessions,
  fmtShortDate,
} from "../../data/classes";
import { equipment } from "../../data/employees";
import type { ClassType, ClassSession, GymClass } from "../../types";
import { useToast } from "../../hooks/useToast";

const weekDays = ["L", "M", "X", "J", "V", "S"];

const times = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

const durations = ["30 min", "45 min", "50 min", "60 min"];

const trainers = ["Carlos", "Diego", "Marta", "Sara"];

const rooms = ["Sala A", "Sala B", "Sala C", "Box", "Ring"];

const equipmentOptions = Array.from(
  new Set([...equipment.map((e) => e.name), ...classSessions.flatMap((s) => s.materials ?? [])])
);

const makeId = (n: string) => n.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");

export function AdminClasses() {
  const { notify } = useToast();
  const [types, setTypes] = useState<ClassType[]>(classTypes);
  const [sessions, setSessions] = useState<ClassSession[]>(classSessions);
  const [editing, setEditing] = useState<{ type: ClassType; session: ClassSession | null } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GymClass | null>(null);
  const [deleteTypeTarget, setDeleteTypeTarget] = useState<ClassType | null>(null);

  const [name, setName] = useState("");
  const [days, setDays] = useState<string[]>(["L"]);
  const [time, setTime] = useState("18:30");
  const [duration, setDuration] = useState("45 min");
  const [trainer, setTrainer] = useState("Carlos");
  const [room, setRoom] = useState("Sala A");
  const [capacity, setCapacity] = useState("20");
  const [booked, setBooked] = useState("0");
  const [materials, setMaterials] = useState<string[]>([]);
  const [matOpen, setMatOpen] = useState(false);
  const [matQuery, setMatQuery] = useState("");
  const matRef = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!matOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (matRef.current && !matRef.current.contains(e.target as Node)) setMatOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [matOpen]);

  const closeModal = () => {
    setCreateOpen(false);
    setEditing(null);
    setMatOpen(false);
    setMatQuery("");
  };

  const filteredMaterials = equipmentOptions.filter((m) => m.toLowerCase().includes(matQuery.trim().toLowerCase()));

  const openCreate = () => {
    setName("");
    setDays(["L"]);
    setTime("18:30");
    setDuration("45 min");
    setTrainer("Carlos");
    setRoom("Sala A");
    setCapacity("20");
    setBooked("0");
    setMaterials([]);
    setDescription("");
    setEditing(null);
    setCreateOpen(true);
  };

  const startEdit = (c: GymClass) => {
    const session = sessions.find((s) => s.id === c.id);
    const type = types.find((t) => t.id === (session?.classTypeId ?? c.id));
    if (!type) return;
    setEditing({ type, session: session ?? null });
    setName(type.name);
    setDescription(type.description);
    setTime(session ? session.time : "18:30");
    setDuration(session ? session.duration : "45 min");
    setTrainer(session ? session.trainer : "Carlos");
    setRoom(session ? session.room : "Sala A");
    setCapacity(String(session ? session.capacity : 20));
    setBooked(String(session ? session.booked : 0));
    setMaterials(session?.materials ?? []);
    setDays([]);
    setCreateOpen(false);
  };

  const toggleDay = (d: string) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const saveClass = () => {
    if (!name.trim()) {
      notify("Indica el nombre de la clase", "warning");
      return;
    }

    if (editing) {
      const typeId = editing.type.id;
      setTypes((l) => l.map((t) => (t.id === typeId ? { ...t, name: name.trim(), description } : t)));
      if (editing.session) {
        setSessions((prev) =>
          prev.map((sc) =>
            sc.id === editing.session!.id
              ? { ...sc, time, duration, trainer, room, capacity: Number(capacity), materials, booked: Number(booked) }
              : sc
          )
        );
      }
      setEditing(null);
      notify("Clase actualizada");
    } else {
      if (days.length === 0) {
        notify("Selecciona al menos un día para generar sesiones", "warning");
        return;
      }
      const id = makeId(name);
      if (types.some((t) => t.id === id)) {
        notify("Ya existe una clase con ese nombre", "warning");
        return;
      }
      setTypes((l) => [...l, { id, name: name.trim(), description }]);
      const now = new Date();
      setSessions((s) => [
        ...s,
        ...generateSessions(
          id,
          days,
          [{ year: now.getFullYear(), month: now.getMonth() }],
          { time, duration, trainer, room, capacity: Number(capacity), materials },
          0
        ),
      ]);
      notify("Clase creada");
    }
    closeModal();
  };

  const toggleMaterial = (m: string) => {
    setMaterials((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const deletingTypeName = () => {
    if (!deleteTypeTarget) return "";
    const count = sessions.filter((s) => s.classTypeId === deleteTypeTarget.id).length;
    return `${deleteTypeTarget.name}${count > 0 ? ` (${count} sesiones)` : ""}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Clases</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Calendario administrativo</p>
        </div>
        <Button onClick={openCreate}><Plus size={18} /> CREAR CLASE</Button>
      </div>

      <ClassesCalendar
        classes={resolveGymClasses(types, sessions)}
        onEdit={startEdit}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={createOpen || !!editing}
        onClose={closeModal}
        title={editing ? "Editar clase" : "Crear clase"}
      >
        <div className="space-y-3">
          <Field label="Nombre del tipo"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Spinning" /></Field>
          {!editing && (
            <Field label="Días de los que generar sesiones">
              <div className="flex flex-wrap gap-2">
                {weekDays.map((w) => {
                  const active = days.includes(w);
                  return (
                    <button
                      key={w}
                      type="button"
                      onClick={() => toggleDay(w)}
                      className={`grid h-10 w-10 place-items-center rounded-lg border font-bold transition-colors ${
                        active
                          ? "border-stadio-red bg-stadio-red text-white"
                          : "border-gray-200 dark:border-white/15 text-stadio-black dark:text-white hover:border-stadio-red/50"
                      }`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-stadio-gray">
                Crea una sesión por cada fecha de este mes con el día marcado. Después podrás editar cada sesión por separado.
              </p>
            </Field>
          )}

          <div className="relative -mx-3 rounded-xl bg-stadio-gray-light/40 dark:bg-white/5 px-3 py-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stadio-gray">
              <Pencil size={12} />
              {editing && editing.session
                ? `Datos de la sesión · ${fmtShortDate(editing.session.date)} (solo este día)`
                : "Datos de cada sesión generada"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hora">
                <Select value={time} onChange={(e) => setTime(e.target.value)}>
                  {times.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Duración">
                <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                  {durations.map((d) => <option key={d} value={d}>{d}</option>)}
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Monitor/instructor">
                <Select value={trainer} onChange={(e) => setTrainer(e.target.value)}>
                  {trainers.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Sala">
                <Select value={room} onChange={(e) => setRoom(e.target.value)}>
                  {rooms.map((r) => <option key={r} value={r}>{r}</option>)}
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Capacidad">
                <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </Field>
              {editing?.session ? (
                <Field label="Ocupación actual">
                  <Input type="number" value={booked} onChange={(e) => setBooked(e.target.value)} />
                </Field>
              ) : null}
            </div>
            <Field label="Material / Equipamiento">
              <div className="relative" ref={matRef}>
                <button
                  type="button"
                  onClick={() => setMatOpen((o) => !o)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2 text-left text-sm text-stadio-black dark:text-white transition-colors ${
                    matOpen ? "border-red-400 ring-2 ring-red-500/40" : "hover:border-red-400"
                  }`}
                >
                  <span className={materials.length === 0 ? "text-stadio-gray" : "font-semibold"}>
                    {materials.length === 0
                      ? "Selecciona el equipamiento…"
                      : materials.length === 1
                      ? "1 material seleccionado"
                      : `${materials.length} materiales seleccionados`}
                  </span>
                  <ChevronDown size={16} className={`shrink-0 text-stadio-gray transition-transform ${matOpen ? "rotate-180" : ""}`} />
                </button>

                {matOpen && (
                  <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-stadio-black shadow-lg">
                    <input
                      autoFocus
                      value={matQuery}
                      onChange={(e) => setMatQuery(e.target.value)}
                      placeholder="Buscar material…"
                      aria-label="Buscar material"
                      className="border-b border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-3 py-2 w-full text-sm text-stadio-black dark:text-white placeholder:text-stadio-gray focus:outline-none"
                    />
                    <ul className="max-h-52 overflow-y-auto p-1">
                      {filteredMaterials.map((m) => {
                        const active = materials.includes(m);
                        return (
                          <li key={m}>
                            <button
                              type="button"
                              onClick={() => toggleMaterial(m)}
                              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                                active ? "text-stadio-red" : "text-stadio-black dark:text-white hover:bg-stadio-gray-light dark:hover:bg-white/10"
                              }`}
                            >
                              <span
                                className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${
                                  active ? "border-stadio-red bg-stadio-red" : "border-gray-300 dark:border-white/20"
                                }`}
                              >
                                {active && <Check size={12} className="text-white" />}
                              </span>
                              {m}
                            </button>
                          </li>
                        );
                      })}
                      {filteredMaterials.length === 0 && (
                        <li className="px-2 py-2 text-sm text-stadio-gray">Sin resultados</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {materials.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {materials.map((m) => (
                    <span key={m} className="inline-flex items-center gap-1 rounded-full bg-stadio-red/10 px-2 py-0.5 text-xs font-bold text-stadio-red">
                      {m}
                      <button type="button" onClick={() => toggleMaterial(m)} aria-label={`Quitar ${m}`} className="text-stadio-red/60 hover:text-stadio-red">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>

          <Field label="Descripción">
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe la clase, intensidad, estilo…" />
          </Field>
          <div className="flex flex-col gap-2 pt-1">
            <Button className="w-full" onClick={saveClass}>
              {editing ? "GUARDAR CAMBIOS" : "CREAR CLASE"}
            </Button>
            {editing && (
              <button
                type="button"
                onClick={() => { setDeleteTypeTarget(editing.type); }}
                className="w-full rounded-lg px-3 py-2 text-center text-xs font-bold text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Eliminar tipo completo (todas las fechas)
              </button>
            )}
          </div>
        </div>
      </Modal>

      <Confirmation
        open={!!deleteTarget}
        title="Eliminar sesión"
        message={
          deleteTarget
            ? `¿Eliminar la sesión de "${deleteTarget.name}" del ${fmtShortDate(deleteTarget.date)}? Esta acción solo afecta a este día.`
            : ""
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (deleteTarget) {
            setSessions((s) => s.filter((sc) => sc.id !== deleteTarget.id));
            notify("Sesión eliminada", "info");
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
        danger
      />

      <Confirmation
        open={!!deleteTypeTarget}
        title="Eliminar tipo completo"
        message={
          deleteTypeTarget
            ? `¿Eliminar la clase "${deletingTypeName()}" con todas sus sesiones? No se podrá deshacer.`
            : ""
        }
        confirmLabel="Eliminar todo"
        onConfirm={() => {
          if (deleteTypeTarget) {
            setTypes((l) => l.filter((t) => t.id !== deleteTypeTarget.id));
            setSessions((s) => s.filter((sc) => sc.classTypeId !== deleteTypeTarget.id));
            notify("Clase eliminada", "info");
          }
          setDeleteTypeTarget(null);
          closeModal();
        }}
        onCancel={() => setDeleteTypeTarget(null)}
        danger
      />
    </div>
  );
}