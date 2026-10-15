import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Users, ClipboardList, ChevronRight, Clock, MapPin, CalendarPlus } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import { StatCard } from "../../components/StatCard";
import { ClassDetailModal } from "../../components/ClassDetailModal";
import { clients } from "../../data/users";
import { resolveGymClasses, classTypes, classSessions, dateToKey } from "../../data/classes";
import { findEmployeeById } from "../../data/employees";
import { getScheduleForClient } from "../../features/routines/routineAssignments";
import { CURRENT_TRAINER_ID, getAssignedTrainerId } from "../../features/trainer/personalTrainer";
import { useAuth } from "../../features/auth/authContext";
import type { GymClass } from "../../types";

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

export function TrainerDashboard() {
  const { trainerProfile } = useAuth();
  const isMonitor = trainerProfile === "monitor";
  const myClients = clients.filter((c) => getAssignedTrainerId(c.id) === CURRENT_TRAINER_ID);
  const [detailClass, setDetailClass] = useState<GymClass | null>(null);

  const gymClasses = useMemo(() => resolveGymClasses(classTypes, classSessions), []);
  const todayKey = dateToKey(new Date());
  const trainer = findEmployeeById(CURRENT_TRAINER_ID);
  const todayClassesCount = gymClasses.filter(
    (c) => c.date === todayKey && (!trainer || c.trainer === trainer.name)
  ).length;
  const nextClass =
    [...gymClasses]
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .find((c) => c.date >= todayKey) ?? gymClasses[0];

  const byMonth = new Map<string, { booked: number; capacity: number }>();
  for (const c of gymClasses) {
    const key = c.date.slice(0, 7);
    const entry = byMonth.get(key) ?? { booked: 0, capacity: 0 };
    entry.booked += c.booked;
    entry.capacity += c.capacity;
    byMonth.set(key, entry);
  }
  const monthKeys = [...byMonth.keys()].sort();
  const latest = byMonth.get(monthKeys[monthKeys.length - 1]);
  const previous = byMonth.get(monthKeys[monthKeys.length - 2]);
  const attendance = latest && latest.capacity > 0 ? Math.round((latest.booked / latest.capacity) * 100) : 0;
  const prevAttendance =
    previous && previous.capacity > 0 ? Math.round((previous.booked / previous.capacity) * 100) : attendance;
  const attendanceChange = attendance - prevAttendance;

  const weekStart = mondayOf(new Date());
  const weekSet = new Set(Array.from({ length: 7 }, (_, i) => toIso(addDays(weekStart, i))));
  const pendingRoutines = myClients
    .map((c) => {
      const assigned = getScheduleForClient(c.id).filter((a) => weekSet.has(a.date)).length;
      const required = parseInt(c.frequency, 10) || 0;
      return { client: c, assigned, required, missing: Math.max(0, required - assigned) };
    })
    .filter((p) => p.missing > 0);
  const pendingCount = pendingRoutines.reduce((a, p) => a + p.missing, 0);

  const recentClients = myClients.slice(0, 3);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Buenos días, Carlos ☀️</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
          {isMonitor ? "Resumen del día de tus clases colectivas" : "Resumen del día para tus clientes"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {isMonitor ? (
          <>
            <StatCard label="Clases hoy" value={String(todayClassesCount)} icon={<CalendarDays size={20} />} />
            <StatCard label="Asistencia en clases" value={`${attendance}%`} change={attendanceChange} icon={<Clock size={20} />} />
          </>
        ) : (
          <>
            <StatCard label="Clientes asignados" value={String(myClients.length)} change={3} icon={<Users size={20} />} />
            <StatCard label="Rutinas pendientes" value={String(pendingCount)} change={-1} icon={<ClipboardList size={20} />} />
          </>
        )}
      </div>

      {isMonitor && nextClass && (
        <Card>
          <CardHeader title="PRÓXIMA CLASE" action={<Badge variant="warning">{nextClass.time}</Badge>} />
          <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() => setDetailClass(nextClass)}
                className="text-left text-lg font-bold text-stadio-black hover:text-stadio-red dark:text-white"
              >
                {nextClass.name}
              </button>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stadio-gray-dark dark:text-white/60">
                <span className="inline-flex items-center gap-1"><Clock size={14} /> {nextClass.time} · {nextClass.duration}</span>
                <span className="inline-flex items-center gap-1"><MapPin size={14} /> {nextClass.room}</span>
                <span>{nextClass.booked}/{nextClass.capacity} plazas</span>
              </div>
            </div>
            <Link to="/trainer/classes">
              <Button variant="secondary">VER CLASES <ChevronRight size={16} /></Button>
            </Link>
          </CardBody>
        </Card>
      )}

      {!isMonitor && (
        <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="CLIENTES RECIENTES" action={<Link to="/trainer/clients" className="text-xs font-bold text-stadio-red">Ver todos</Link>} />
          <CardBody className="space-y-3">
            {recentClients.map((c) => (
              <Link key={c.id} to={`/trainer/clients/${c.id}`} className="block rounded-xl border border-gray-100 dark:border-white/10 p-3 hover:border-stadio-red/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar initials={c.initials} color={c.color} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{c.name}</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">{c.goal} · {c.lastWorkout}</p>
                  </div>
                  <Badge variant="success">Progreso {c.progress}%</Badge>
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="RUTINAS PENDIENTES"
            subtitle="Sesiones por asignar esta semana"
            action={<CalendarPlus size={18} className="text-stadio-gray" />}
          />
          <CardBody className="space-y-3">
            {pendingRoutines.length === 0 ? (
              <p className="rounded-xl border border-gray-100 dark:border-white/10 p-4 text-center text-sm text-stadio-gray dark:text-white/50">
                No hay rutinas pendientes esta semana. ✅
              </p>
            ) : (
              pendingRoutines.map((p) => (
                <div key={p.client.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={p.client.initials} color={p.client.color} size="sm" />
                    <div>
                      <p className="text-sm font-bold text-stadio-black dark:text-white">{p.client.name}</p>
                      <p className="text-xs text-stadio-gray dark:text-white/50">
                        Faltan {p.missing} {p.missing === 1 ? "sesión" : "sesiones"} por asignar ({p.assigned}/{p.required})
                      </p>
                    </div>
                  </div>
                  <Link to={`/trainer/clients/${p.client.id}`}>
                    <Button size="sm">Asignar</Button>
                  </Link>
                </div>
              ))
            )}
          </CardBody>
        </Card>
        </div>
      )}

      <ClassDetailModal gymClass={detailClass} onClose={() => setDetailClass(null)} />
    </div>
  );
}
