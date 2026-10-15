import { useMemo, useState } from "react";
import { Clock, MapPin, Users, RotateCcw, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Select } from "../../components/Input";
import { ClassDetailModal } from "../../components/ClassDetailModal";
import { classTypes, classSessions, resolveGymClasses } from "../../data/classes";
import { findEmployeeById } from "../../data/employees";
import { CURRENT_TRAINER_ID } from "../../features/trainer/personalTrainer";
import type { GymClass } from "../../types";

type Scope = "proximas" | "todas";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
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

function fmtLong(iso: string): string {
  const s = new Date(`${iso}T12:00:00`).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function occupancyColor(pct: number): string {
  if (pct >= 100) return "bg-stadio-red";
  if (pct > 80) return "bg-stadio-amber";
  return "bg-stadio-green";
}

export function TrainerClasses() {
  const [detailClass, setDetailClass] = useState<GymClass | null>(null);
  const [typeFilter, setTypeFilter] = useState("Todas");
  const [roomFilter, setRoomFilter] = useState("Todas");
  const [scope, setScope] = useState<Scope>("proximas");

  const trainer = findEmployeeById(CURRENT_TRAINER_ID);
  const assignedNames = classTypes.filter((t) => trainer?.classIds.includes(t.id)).map((t) => t.name);

  const gymClasses = useMemo(() => resolveGymClasses(classTypes, classSessions), []);
  const myClasses = gymClasses.filter((c) => assignedNames.includes(c.name));

  const todayIso = toIso(new Date());
  const weekStart = mondayOf(new Date());
  const weekSet = new Set(Array.from({ length: 7 }, (_, i) => toIso(addDays(weekStart, i))));

  const typeOptions = [...new Set(myClasses.map((c) => c.name))].sort();
  const roomOptions = [...new Set(myClasses.map((c) => c.room))].sort();

  const filtered = myClasses
    .filter((c) => typeFilter === "Todas" || c.name === typeFilter)
    .filter((c) => roomFilter === "Todas" || c.room === roomFilter)
    .filter((c) => scope === "todas" || c.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const groups: { date: string; items: GymClass[] }[] = [];
  for (const c of filtered) {
    const group = groups.find((g) => g.date === c.date);
    if (group) group.items.push(c);
    else groups.push({ date: c.date, items: [c] });
  }

  const weekClasses = myClasses.filter((c) => weekSet.has(c.date));
  const weekBooked = weekClasses.reduce((a, c) => a + c.booked, 0);
  const weekCapacity = weekClasses.reduce((a, c) => a + c.capacity, 0);
  const avgOccupancy = weekCapacity > 0 ? Math.round((weekBooked / weekCapacity) * 100) : 0;

  const resetFilters = () => {
    setTypeFilter("Todas");
    setRoomFilter("Todas");
    setScope("proximas");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Mis clases</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Tus sesiones y su ocupación</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="p-4">
            <Clock size={18} className="text-stadio-red" />
            <p className="mt-2 text-2xl font-extrabold text-stadio-black dark:text-white">{weekClasses.length}</p>
            <p className="text-xs text-stadio-gray">clases esta semana</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <Users size={18} className="text-stadio-red" />
            <p className="mt-2 text-2xl font-extrabold text-stadio-black dark:text-white">{myClasses.length}</p>
            <p className="text-xs text-stadio-gray">clases programadas en total</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <MapPin size={18} className="text-stadio-red" />
            <p className="mt-2 text-2xl font-extrabold text-stadio-black dark:text-white">{avgOccupancy}%</p>
            <p className="text-xs text-stadio-gray">ocupación media (esta semana)</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3 lg:flex-1">
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="Todas">Todos los tipos</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
            <Select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
              <option value="Todas">Todas las salas</option>
              {roomOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
            <Select value={scope} onChange={(e) => setScope(e.target.value as Scope)}>
              <option value="proximas">Próximas</option>
              <option value="todas">Todas</option>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <p className="text-xs text-stadio-gray dark:text-white/40">
              {filtered.length} {filtered.length === 1 ? "clase" : "clases"}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stadio-gray-dark hover:text-stadio-red dark:text-white/50"
            >
              <RotateCcw size={13} /> Limpiar filtros
            </button>
          </div>
        </CardBody>
      </Card>

      {groups.length === 0 ? (
        <Card>
          <CardBody className="py-10 text-center text-sm text-stadio-gray dark:text-white/50">
            No hay clases con estos filtros.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.date}>
              <CardHeader title={fmtLong(group.date)} action={<Badge variant="neutral">{group.items.length}</Badge>} />
              <CardBody className="space-y-2">
                {group.items.map((c) => {
                  const pct = c.capacity > 0 ? Math.min(100, Math.round((c.booked / c.capacity) * 100)) : 0;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setDetailClass(c)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 text-left transition-colors hover:border-stadio-red/40 dark:border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-11 w-14 place-items-center rounded-lg bg-stadio-red/10 text-sm font-extrabold text-stadio-red">
                          {c.time}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-stadio-black dark:text-white">{c.name}</p>
                          <p className="inline-flex items-center gap-1 text-xs text-stadio-gray">
                            <MapPin size={12} /> {c.room} · {c.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden w-28 sm:block">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-stadio-gray">
                            <span>{c.booked}/{c.capacity}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                            <div className={`h-full rounded-full ${occupancyColor(pct)}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <Badge variant={c.booked >= c.capacity ? "error" : "success"} dot>
                          {c.booked >= c.capacity ? "Completa" : "Disponible"}
                        </Badge>
                        <ChevronRight size={16} className="text-stadio-gray" />
                      </div>
                    </button>
                  );
                })}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <ClassDetailModal gymClass={detailClass} onClose={() => setDetailClass(null)} />
    </div>
  );
}
