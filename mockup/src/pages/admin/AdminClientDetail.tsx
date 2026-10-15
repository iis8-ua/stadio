import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogIn, LogOut, MinusCircle, UserCheck } from "lucide-react";
import { Badge } from "../../components/Badge";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { BackButton } from "../../components/BackButton";
import { ErrorState } from "../../components/EmptyState";
import { ClassDetailModal } from "../../components/ClassDetailModal";
import { clients } from "../../data/users";
import { findEmployeeById, findEmployeeByName, getPersonalTrainers } from "../../data/employees";
import { resolveGymClasses, classTypes, classSessions, fmtShortDate } from "../../data/classes";
import { getAccessRecordsByMonth, payments } from "../../data/payments";
import { getBookingsByMonth } from "../../features/bookings/clientBookings";
import { getTrainingMonths, getWeekSummary } from "../../features/training/trainingHistory";
import {
  assignPersonalTrainer,
  getPersonalTrainerInfo,
  removePersonalTrainer,
} from "../../features/trainer/personalTrainer";
import { useToast } from "../../hooks/useToast";
import type { Booking, GymClass } from "../../types";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const YEARS = [2025, 2026, 2027];
const CURRENT_MONTH = 8;
const CURRENT_YEAR = 2026;

const selectClass =
  "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red";

const bookingVariant = (s: Booking["status"]) =>
  s === "confirmed" ? "success" : s === "cancelled" ? "neutral" : "warning";
const bookingLabel = (s: Booking["status"]) =>
  s === "confirmed" ? "Confirmada" : s === "cancelled" ? "Cancelada" : "Finalizada";

export function AdminClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();
  const c = clients.find((x) => x.id === id);
  const [accessMonth, setAccessMonth] = useState(CURRENT_MONTH);
  const [accessYear, setAccessYear] = useState(CURRENT_YEAR);
  const [classMonth, setClassMonth] = useState(CURRENT_MONTH);
  const [classYear, setClassYear] = useState(CURRENT_YEAR);
  const [feeYear, setFeeYear] = useState(CURRENT_YEAR);
  const [activityMonth, setActivityMonth] = useState(7);
  const [activityYear, setActivityYear] = useState(CURRENT_YEAR);
  const [activityWeek, setActivityWeek] = useState(() => {
    const m = getTrainingMonths()[0];
    if (!m) return 1;
    const ws = getWeekSummary(m);
    return ws[ws.length - 1]?.week ?? 1;
  });
  const [activityDay, setActivityDay] = useState(0);
  const [detailClass, setDetailClass] = useState<GymClass | null>(null);
  const [trainerSelect, setTrainerSelect] = useState("");
  const [reminded, setReminded] = useState<string[]>([]);
  const [, setPtTick] = useState(0);
  const gymClasses = useMemo(() => resolveGymClasses(classTypes, classSessions), []);
  const classById = useMemo(() => new Map(gymClasses.map((g) => [g.id, g])), [gymClasses]);
  if (!c) return <ErrorState title="Cliente no encontrado" />;

  const personalTrainers = getPersonalTrainers();
  const pt = getPersonalTrainerInfo(c.id);
  const personalTrainer = pt.trainerId ? findEmployeeById(pt.trainerId) : undefined;

  const assignTrainer = () => {
    if (!trainerSelect) return;
    assignPersonalTrainer(c.id, trainerSelect);
    setTrainerSelect("");
    setPtTick((t) => t + 1);
    notify("Entrenador personal asignado");
  };

  const removeTrainer = () => {
    removePersonalTrainer(c.id);
    setPtTick((t) => t + 1);
    notify("Entrenador personal quitado", "info");
  };

  const trainerLink = (name: string) => {
    const emp = findEmployeeByName(name);
    if (!emp) return <span>{name}</span>;
    return (
      <button
        type="button"
        onClick={() => navigate(`/admin/employees/${emp.id}`)}
        className="font-semibold text-stadio-red hover:underline"
      >
        {name}
      </button>
    );
  };

  const accesses = getAccessRecordsByMonth(accessMonth, accessYear);
  const classBookings = getBookingsByMonth(classMonth, classYear);
  const feePayments = payments.filter((p) => p.month.endsWith(String(feeYear)));

  const recentMonth = getTrainingMonths()[0];
  const weekSummary = getWeekSummary(recentMonth);
  const lastWeek = weekSummary[weekSummary.length - 1];

  const trainings = getTrainingMonths();
  const yearWorkouts = trainings.filter((m) => m.year === activityYear).flatMap((m) => m.workouts);
  const activityMonthObj =
    activityMonth === -1
      ? undefined
      : trainings.find((m) => m.year === activityYear && m.label === MONTHS[activityMonth]);
  const monthWorkouts = activityMonth === -1 ? yearWorkouts : (activityMonthObj?.workouts ?? []);

  const daysInMonth = new Date(activityYear, Math.max(activityMonth, 0) + 1, 0).getDate();
  const weekCount = Math.ceil(daysInMonth / 7);
  const effWeek = activityWeek > weekCount ? 0 : activityWeek;
  const activityWeeks = [
    { value: 0, label: "Todo el mes" },
    ...Array.from({ length: weekCount }, (_, i) => ({
      value: i + 1,
      label: `Semana ${i + 1} · días ${i * 7 + 1}–${Math.min((i + 1) * 7, daysInMonth)}`,
    })),
  ];
  const dayStart = (effWeek - 1) * 7 + 1;
  const dayEnd = Math.min(effWeek * 7, daysInMonth);
  const activityDays = [
    { value: 0, label: "Toda la semana" },
    ...(effWeek > 0
      ? Array.from({ length: dayEnd - dayStart + 1 }, (_, i) => {
          const dayNum = dayStart + i;
          const d = new Date(activityYear, Math.max(activityMonth, 0), dayNum);
          const weekday = d.toLocaleDateString("es-ES", { weekday: "long" });
          return { value: dayNum, label: `${weekday[0].toUpperCase()}${weekday.slice(1)} ${dayNum}` };
        })
      : []),
  ];
  const weekWorkouts =
    effWeek === 0
      ? monthWorkouts
      : monthWorkouts.filter((w) => {
          const d = new Date(`${w.date}T12:00:00`);
          return Math.floor((d.getDate() - 1) / 7) + 1 === effWeek;
        });
  const activityWorkouts =
    activityDay === 0
      ? weekWorkouts
      : weekWorkouts.filter((w) => new Date(`${w.date}T12:00:00`).getDate() === activityDay);
  const activityMinutes = activityWorkouts.reduce((acc, w) => acc + w.duration, 0);
  const activityTime =
    activityMinutes >= 60
      ? `${Math.floor(activityMinutes / 60)}h ${activityMinutes % 60}min`
      : `${activityMinutes} min`;
  const dayLabel = activityDays.find((d) => d.value === activityDay)?.label;
  const activitySubtitle =
    activityMonth === -1
      ? `Todo el año ${activityYear}`
      : effWeek === 0
        ? `Todo el mes · ${MONTHS[activityMonth]} ${activityYear}`
        : `${MONTHS[activityMonth]} ${activityYear} · Semana ${effWeek}${activityDay ? ` · ${dayLabel}` : ""}`;

  return (
    <div className="space-y-5">
      <BackButton />

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar initials={c.initials} color={c.color} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-stadio-black dark:text-white">{c.name}</h1>
            <p className="text-sm text-stadio-gray dark:text-white/50">{c.email} · {c.phone}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="neutral">Alta: {c.joined}</Badge>
              <Badge variant="neutral">NFC: {c.nfcId ?? "—"}</Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardBody className="p-4"><p className="text-xs text-stadio-gray">Último acceso</p><p className="text-sm font-bold text-stadio-black dark:text-white">{c.lastAccess}</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-xs text-stadio-gray">Accesos en {MONTHS[accessMonth].toLowerCase()}</p><p className="text-sm font-bold text-stadio-black dark:text-white">{accesses.length}</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-xs text-stadio-gray">Entrenamientos esta semana</p><p className="text-sm font-bold text-stadio-black dark:text-white">{lastWeek.count}</p></CardBody></Card>
      </div>

      <Card>
        <CardHeader
          title="ENTRENADOR PERSONAL"
          action={<UserCheck size={18} className="text-stadio-gray" />}
        />
        <CardBody>
          {!pt.requested ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-stadio-gray dark:text-white/50">
                El cliente no ha contratado entrenador personal.
              </p>
              <Badge variant="neutral" dot>No contratado</Badge>
            </div>
          ) : (
            <div className="space-y-3">
              {personalTrainer ? (
                <div className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/employees/${personalTrainer.id}`)}
                    className="flex items-center gap-3 text-left"
                    title="Ver ficha del entrenador"
                  >
                    <Avatar initials={personalTrainer.initials} color={personalTrainer.color} size="md" />
                    <div>
                      <p className="text-sm font-bold text-stadio-black hover:text-stadio-red dark:text-white">{personalTrainer.name}</p>
                      <p className="text-xs text-stadio-gray dark:text-white/50">{personalTrainer.email} · {personalTrainer.phone}</p>
                      {pt.since && (
                        <p className="mt-0.5 text-xs text-stadio-gray dark:text-white/50">Asignado desde {pt.since}</p>
                      )}
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="success" dot>Asignado</Badge>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="warning" dot>Solicitado · pendiente de asignación</Badge>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <select value={trainerSelect} onChange={(e) => setTrainerSelect(e.target.value)} aria-label="Entrenador personal" className={selectClass}>
                  <option value="">Selecciona entrenador…</option>
                  {personalTrainers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <Button size="sm" onClick={assignTrainer} disabled={!trainerSelect}>
                  {personalTrainer ? "CAMBIAR" : "ASIGNAR"}
                </Button>
                {personalTrainer && (
                  <Button variant="danger" size="sm" onClick={removeTrainer}>
                    QUITAR
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="HISTORIAL DE ACCESOS"
            action={
              <div className="flex items-center gap-2">
                <select value={accessMonth} onChange={(e) => setAccessMonth(Number(e.target.value))} aria-label="Mes de accesos" className={selectClass}>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <select value={accessYear} onChange={(e) => setAccessYear(Number(e.target.value))} aria-label="Año de accesos" className={selectClass}>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            }
          />
          <CardBody className="space-y-2">
            {accesses.map((a) => (
              <div key={a.id} className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-stadio-gray">
                  {a.day} · {a.date}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-green">
                    <LogIn size={14} /> Entrada · {a.entry}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray-dark dark:text-white/60">
                    {a.method}
                  </span>
                  {a.exit ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-red">
                      <LogOut size={14} /> Salida · {a.exit}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-stadio-gray">
                      <MinusCircle size={14} /> Sin salida
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="HISTORIAL DE CLASES"
            action={
              <div className="flex items-center gap-2">
                <select value={classMonth} onChange={(e) => setClassMonth(Number(e.target.value))} aria-label="Mes del historial de clases" className={selectClass}>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
                <select value={classYear} onChange={(e) => setClassYear(Number(e.target.value))} aria-label="Año del historial de clases" className={selectClass}>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            }
          />
          <CardBody className="space-y-2">
            {classBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const gymClass = classById.get(b.classId) ?? gymClasses.find((g) => g.name === b.className);
                      if (gymClass) setDetailClass(gymClass);
                    }}
                    className="text-left text-sm font-bold text-stadio-black hover:text-stadio-red dark:text-white"
                  >
                    {b.className}
                  </button>
                  <p className="text-xs text-stadio-gray">{fmtShortDate(b.date)} · {b.time} · {trainerLink(b.trainer)}</p>
                </div>
                <Badge variant={bookingVariant(b.status)} dot>{bookingLabel(b.status)}</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="ACTIVIDAD DE ENTRENAMIENTO"
          subtitle={activitySubtitle}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <select value={activityMonth} onChange={(e) => { setActivityMonth(Number(e.target.value)); setActivityWeek(0); setActivityDay(0); }} aria-label="Mes de actividad" className={selectClass}>
                <option value={-1}>Todo el año</option>
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select value={activityYear} onChange={(e) => { setActivityYear(Number(e.target.value)); setActivityWeek(0); setActivityDay(0); }} aria-label="Año de actividad" className={selectClass}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {activityMonth !== -1 && (
                <select value={effWeek} onChange={(e) => { setActivityWeek(Number(e.target.value)); setActivityDay(0); }} aria-label="Semana de actividad" className={selectClass}>
                  {activityWeeks.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              )}
              {activityMonth !== -1 && effWeek > 0 && (
                <select value={activityDay} onChange={(e) => setActivityDay(Number(e.target.value))} aria-label="Día de actividad" className={selectClass}>
                  {activityDays.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              )}
            </div>
          }
        />
        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-stadio-black dark:text-white">{activityWorkouts.length}</p>
              <p className="mt-1 text-xs text-stadio-gray">entrenamientos realizados</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-5 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-stadio-black dark:text-white">{activityTime}</p>
              <p className="mt-1 text-xs text-stadio-gray">tiempo de entrenamiento</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Historial de cuotas"
          action={
          <select value={feeYear} onChange={(e) => setFeeYear(Number(e.target.value))} aria-label="Año de cuotas" className={selectClass}>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          }
        />
        <CardBody className="space-y-2">
          {feePayments.length === 0 ? (
            <p className="text-sm text-stadio-gray dark:text-white/50">No hay cuotas registradas en {feeYear}.</p>
          ) : (
            feePayments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <p className="text-sm font-bold text-stadio-black dark:text-white">{p.month}</p>
                {p.date ? (
                  <Badge variant="success" dot>Pagada · {p.date}</Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" dot>Pendiente</Badge>
                    {reminded.includes(p.id) ? (
                      <Badge variant="neutral">Recordatorio enviado</Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setReminded((r) => [...r, p.id]);
                          notify(`Recordatorio de pago enviado a ${c.name}`);
                        }}
                      >
                        Recordatorio
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <ClassDetailModal gymClass={detailClass} onClose={() => setDetailClass(null)} />
    </div>
  );
}