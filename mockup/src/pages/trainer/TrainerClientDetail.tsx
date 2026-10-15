import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Target, ClipboardList, Activity, Scale, User, CalendarDays, MapPin, Lightbulb } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { BackButton } from "../../components/BackButton";
import { ErrorState } from "../../components/EmptyState";
import { RoutineWeekCalendar } from "../../components/RoutineWeekCalendar";
import { clients, currentClient } from "../../data/users";
import { fmtShortDate } from "../../data/classes";
import { bodyWeightSeries } from "../../data/progress";
import { getTrainingMonths } from "../../features/training/trainingHistory";
import { getClientProfile } from "../../features/profile/clientProfile";
import { getTrainerRoutines } from "../../features/routines/trainerRoutines";
import { getClientActiveEntry } from "../../features/routines/routineAssignments";
import { getClientCoaching } from "../../features/ai/trainerAnalysis";

const MONTHS_ABBR = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_ABBR[m - 1]}`;
}

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

export function TrainerClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const c = clients.find((x) => x.id === id);

  if (!c) return <ErrorState title="Cliente no encontrado" />;

  const routines = getTrainerRoutines();
  const activeEntry = getClientActiveEntry(c.id);
  const coaching = getClientCoaching().find((cc) => cc.client.id === c.id);

  const cp = getClientProfile();
  const isCurrentClient = c.id === currentClient.id;
  const info = isCurrentClient
    ? {
        name: cp.name,
        email: cp.email,
        phone: cp.phone,
        goal: cp.goal,
        weight: cp.weight,
        targetWeight: cp.targetWeight,
        frequency: cp.frequency,
        sex: cp.sex,
        birthDate: cp.birthDate,
        address: cp.address,
        city: cp.city,
        postalCode: cp.postalCode,
      }
    : {
        name: c.name,
        email: c.email,
        phone: c.phone,
        goal: c.goal,
        weight: c.weight,
        targetWeight: c.targetWeight,
        frequency: c.frequency,
        sex: c.sex,
        birthDate: c.birthDate,
        address: c.address,
        city: c.city,
        postalCode: c.postalCode,
      };

  const allSessions = getTrainingMonths()
    .flatMap((m) => m.workouts)
    .sort((a, b) => a.date.localeCompare(b.date));

  const sessions = allSessions.filter(
    (w) => (!fromDate || w.date >= fromDate) && (!toDate || w.date <= toDate)
  );

  const volumeData = sessions.map((w) => ({ label: shortDate(w.date), kg: w.volume }));

  const monthlyWeights = bodyWeightSeries(2026, 0, 11, c.weight);
  const weightData = sessions.map((w) => {
    const monthIndex = new Date(`${w.date}T12:00:00`).getMonth();
    return { label: shortDate(w.date), kg: monthlyWeights[monthIndex]?.kg ?? c.weight };
  });
  const flatWeights = weightData.map((p) => p.kg);
  const weightDomain =
    flatWeights.length > 0
      ? [Math.max(0, Math.floor(Math.min(...flatWeights)) - 1), Math.ceil(Math.max(...flatWeights)) + 1]
      : [70, 80];

  const benchData = sessions
    .map((w) => {
      const ex = w.exercises.find((e) => e.name === "Press banca");
      return ex ? { label: shortDate(w.date), kg: ex.weight } : null;
    })
    .filter((p): p is { label: string; kg: number } => p !== null && p.kg > 0);
  const benchFirst = benchData[0]?.kg ?? 0;
  const benchLast = benchData[benchData.length - 1]?.kg ?? 0;

  const recentSessions = allSessions.slice().reverse().slice(0, 5);

  return (
    <div className="space-y-5">
      <BackButton />

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar initials={c.initials} color={c.color} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-stadio-black dark:text-white">{info.name}</h1>
            <p className="text-sm text-stadio-gray dark:text-white/50">{info.email} · {info.phone}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={c.status === "active" ? "success" : "neutral"} dot>{c.status === "active" ? "Activo" : "Inactivo"}</Badge>
              <Badge variant="info" dot>Cuota {c.fee.toLowerCase()}</Badge>
              <Badge variant="neutral">Cliente desde {c.joined}</Badge>
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-stadio-black dark:text-white">{c.progress}%</p>
            <p className="text-xs text-stadio-gray">progreso</p>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="p-4">
            <Target size={18} className="text-stadio-red" />
            <p className="mt-2 text-xs text-stadio-gray">Objetivo</p>
            <p className="text-sm font-bold text-stadio-black dark:text-white">{info.goal}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <Scale size={18} className="text-stadio-red" />
            <p className="mt-2 text-xs text-stadio-gray">Peso actual</p>
            <p className="text-sm font-bold text-stadio-black dark:text-white">{info.weight.toLocaleString("es-ES")} kg</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <Scale size={18} className="text-stadio-red" />
            <p className="mt-2 text-xs text-stadio-gray">Peso objetivo</p>
            <p className="text-sm font-bold text-stadio-black dark:text-white">{info.targetWeight.toLocaleString("es-ES")} kg</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="p-4">
            <ClipboardList size={18} className="text-stadio-red" />
            <p className="mt-2 text-xs text-stadio-gray">Rutina actual</p>
            <p className="text-sm font-bold text-stadio-black dark:text-white">
              {activeEntry ? activeEntry.routineName : c.routine}
            </p>
            <p className="text-xs text-stadio-gray">{info.frequency}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <User size={18} className="text-stadio-red" />
            <p className="mt-2 text-xs text-stadio-gray">Datos del perfil</p>
            <div className="mt-1.5 space-y-1 text-xs text-stadio-gray-dark dark:text-white/60">
              <p className="flex items-center gap-1.5">
                <User size={13} className="text-stadio-gray" /> {info.sex} · {info.birthDate}
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarDays size={13} className="text-stadio-gray" /> Cliente desde {c.joined}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin size={13} className="text-stadio-gray" /> {info.address}, {info.postalCode} {info.city}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <RoutineWeekCalendar
        clientId={c.id}
        routines={routines.map((r) => ({ id: r.id, name: r.name }))}
        onChange={() => setTick((t) => t + 1)}
      />

      {coaching && (
        <Card>
          <CardHeader
            title="COACHING DEL CLIENTE"
            subtitle="Ritmo, adherencia y recomendaciones"
            action={
              <Badge
                variant={coaching.rhythm === "bueno" ? "success" : coaching.rhythm === "irregular" ? "warning" : "error"}
                dot
              >
                {coaching.rhythm === "bueno" ? "Buen ritmo" : coaching.rhythm === "irregular" ? "Irregular" : "Ritmo bajo"}
              </Badge>
            }
          />
          <CardBody className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stadio-gray">
                <span>Adherencia semanal</span>
                <span>{coaching.completed}/{coaching.target} · {coaching.adherencePct}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    coaching.adherencePct >= 80 ? "bg-stadio-green" : coaching.adherencePct >= 55 ? "bg-stadio-amber" : "bg-stadio-red"
                  }`}
                  style={{ width: `${coaching.adherencePct}%` }}
                />
              </div>
            </div>

            <ul className="space-y-1">
              {coaching.findings.map((f) => (
                <li key={f} className="flex gap-1.5 text-xs text-stadio-gray-dark dark:text-white/60">
                  <span className="text-stadio-gray">•</span> {f}
                </li>
              ))}
            </ul>

            <div className="rounded-lg border border-stadio-red/20 bg-stadio-red/5 px-3 py-2">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-stadio-red">
                <Lightbulb size={12} /> Qué cambiar
              </p>
              <ul className="space-y-1">
                {coaching.recommendations.map((r) => (
                  <li key={r} className="flex gap-1.5 text-xs text-stadio-gray-dark dark:text-white/70">
                    <span className="text-stadio-red">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">Desde</span>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">Hasta</span>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
            </label>
            <Button variant="secondary" size="sm" onClick={() => { setFromDate(""); setToDate(""); }}>
              LIMPIAR
            </Button>
          </div>
          <p className="text-xs text-stadio-gray dark:text-white/40">
            {sessions.length} {sessions.length === 1 ? "sesión" : "sesiones"}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Evolución de carga"
          subtitle={benchData.length > 0 ? `Press banca · ${benchFirst} kg → ${benchLast} kg` : "Press banca"}
          action={<Activity size={18} className="text-stadio-gray" />}
        />
        <CardBody>
          {benchData.length === 0 ? (
            <p className="py-8 text-center text-sm text-stadio-gray dark:text-white/50">
              No hay sesiones con press banca en el rango seleccionado.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={benchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} minTickGap={12} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Carga"]} />
                <Line type="monotone" dataKey="kg" stroke="#d71920" strokeWidth={3} dot={{ r: 4, fill: "#d71920" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Volumen por sesión" subtitle={`${sessions.length} sesiones`} />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} minTickGap={12} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={45} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Volumen"]} />
                <Bar dataKey="kg" fill="#d71920" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Peso corporal" subtitle={`Objetivo: ${c.targetWeight.toLocaleString("es-ES")} kg`} />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} minTickGap={12} />
                <YAxis domain={weightDomain} tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Peso"]} />
                <Line type="monotone" dataKey="kg" stroke="#2563eb" strokeWidth={3} dot={{ r: 3, fill: "#2563eb" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Historial de entrenamientos" subtitle="Pulsa una sesión para ver el detalle" />
        <CardBody className="space-y-2">
          {recentSessions.map((w) => (
            <Link
              key={w.id}
              to={`/trainer/clients/${c.id}/session/${w.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:border-stadio-red/40 dark:border-white/10"
            >
              <div>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{w.routine}</p>
                <p className="text-xs text-stadio-gray">
                  {w.exercises.length} ejercicios · {w.exercises.reduce((a, e) => a + e.sets, 0)} series
                </p>
              </div>
              <Badge variant="neutral">{fmtShortDate(w.date)}</Badge>
            </Link>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" className="sm:flex-1" onClick={() => navigate("/trainer/workouts/new")}>
            Crear nueva rutina
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
