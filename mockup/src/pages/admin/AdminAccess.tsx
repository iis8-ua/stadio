import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoorOpen, Activity, ChevronLeft, ChevronRight, CalendarCheck2, Download } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { getOccupancyByDay, getOccupancyDayLabel, currentDayNumber, currentMonthIndex, currentFullYear, aforoCurrent } from "../../data/aforo";
import { getTodayAccessLogs } from "../../data/accessLogs";
import { findClientByName } from "../../data/users";
import { getGymSettings } from "../../features/settings/gymSettings";
import { useToast } from "../../hooks/useToast";
import { downloadFile, toCsv, downloadJson } from "../../utils/download";
import { DeviceManager } from "../../components/DeviceManager";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const YEAR_START = 2024;
const YEARS = Array.from({ length: currentFullYear - YEAR_START + 1 }, (_, i) => YEAR_START + i);
const MONTHS_FOR_YEAR = (y: number) =>
  y === currentFullYear ? MONTHS.slice(0, currentMonthIndex + 1) : [...MONTHS];
const MAX_DAY = (y: number, m: number) =>
  y === currentFullYear && m === currentMonthIndex
    ? currentDayNumber
    : new Date(y, m + 1, 0).getDate();

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

const PAGE_SIZE = 6;

export function AdminAccess() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [day, setDay] = useState(currentDayNumber);
  const [monthIndex, setMonthIndex] = useState(currentMonthIndex);
  const [year, setYear] = useState(currentFullYear);
  const [logPage, setLogPage] = useState(1);

  const capacity = getGymSettings().capacity;
  const peopleInside = aforoCurrent.people;
  const occupancyPct = Math.round((peopleInside / capacity) * 100);

  const todayLogs = useMemo(() => getTodayAccessLogs(), []);
  const totalLogPages = Math.ceil(todayLogs.length / PAGE_SIZE);
  const pagedLogs = todayLogs.slice((logPage - 1) * PAGE_SIZE, logPage * PAGE_SIZE);
  const todayLabel = getOccupancyDayLabel(currentDayNumber, currentMonthIndex, currentFullYear);

  const maxDay = MAX_DAY(year, monthIndex);
  const isToday = year === currentFullYear && monthIndex === currentMonthIndex && day === currentDayNumber;
  const dayData = getOccupancyByDay(day, monthIndex, year);
  const dayLabel = getOccupancyDayLabel(day, monthIndex, year);
  const maxPeople = Math.max(...dayData.map((p) => p.people));
  const yMax = Math.max(100, Math.ceil(maxPeople / 50) * 50);
  const yTicks = Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50);

  const exportAccessCsv = () => {
    const rows: (string | number)[][] = [
      ["Usuario", "Hora", "Tipo", "Estado"],
      ...todayLogs.map((l) => [l.user, l.time, l.type, l.status]),
    ];
    downloadFile("accesos-stadio.csv", toCsv(rows), "text/csv;charset=utf-8");
    notify("Accesos exportados (CSV)");
  };

  const exportAccessJson = () => {
    downloadJson("accesos-stadio.json", {
      fecha: `${day} ${MONTHS[monthIndex]} ${year}`,
      movimientos: todayLogs,
      aforoPorHoras: dayData,
    });
    notify("Accesos exportados (JSON)");
  };

  const goToday = () => {
    setYear(currentFullYear);
    setMonthIndex(currentMonthIndex);
    setDay(currentDayNumber);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Control de accesos</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Tornos · NFC · Pulseras</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-stadio-red to-red-800 border-0">
          <CardBody className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-white/70">PERSONAS DENTRO</p>
            <p className="mt-2 text-4xl font-extrabold text-white">{peopleInside}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-stadio-gray">CAPACIDAD</p>
            <p className="mt-2 text-4xl font-extrabold text-stadio-black dark:text-white">{capacity}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-stadio-gray">OCUPACIÓN</p>
            <p className="mt-2 text-4xl font-extrabold text-stadio-black dark:text-white">{occupancyPct}%</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
              <div className="h-full rounded-full bg-stadio-red" style={{ width: `${Math.min(100, occupancyPct)}%` }} />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="AFORO POR HORAS"
          subtitle="Personas dentro del gimnasio en tiempo real"
          action={<Activity size={18} className="text-stadio-gray" />}
        />
        <CardBody>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDay((d) => Math.max(1, d - 1))}
                disabled={day === 1}
                className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10 disabled:opacity-30"
                aria-label="Día anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <Button variant="secondary" size="sm" onClick={goToday}>
                <CalendarCheck2 size={14} /> HOY
              </Button>
              <button
                onClick={() => setDay((d) => Math.min(maxDay, d + 1))}
                disabled={day === maxDay}
                className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10 disabled:opacity-30"
                aria-label="Día siguiente"
              >
                <ChevronRight size={20} />
              </button>
              <select
                value={monthIndex}
                onChange={(e) => {
                  const i = Number(e.target.value);
                  setMonthIndex(i);
                  setDay((d) => Math.min(d, MAX_DAY(year, i)));
                }}
                className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red"
              >
                {MONTHS_FOR_YEAR(year).map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setYear(y);
                  setMonthIndex((m) => (y === currentFullYear ? Math.min(m, currentMonthIndex) : m));
                  setDay((d) => Math.min(d, MAX_DAY(y, y === currentFullYear ? Math.min(monthIndex, currentMonthIndex) : monthIndex)));
                }}
                className="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-sm font-extrabold capitalize text-stadio-black dark:text-white">
                Día {day} · {dayLabel.weekday}
              </p>
              <p className="text-xs text-stadio-gray">
                {dayLabel.date} de {year}
                {isToday && <span className="ml-1 font-bold text-stadio-red">· Hoy</span>}
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dayData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="aforoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d71920" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#d71920" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis
                  ticks={yTicks}
                  domain={[0, yMax]}
                  tick={{ fontSize: 12, fill: "#8a8a8a" }}
                  axisLine={false}
                  tickLine={false}
                  width={35}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${Number(value)} personas`, "Aforo"]}
                  labelFormatter={(l) => `${l} · ${day} de ${MONTHS[monthIndex].toLowerCase()} ${year}`}
                />
                <Area type="monotone" dataKey="people" stroke="#d71920" strokeWidth={3} fill="url(#aforoGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="MOVIMIENTOS RECIENTES"
          subtitle={`Hoy · ${todayLabel.weekday} ${todayLabel.date} · se reinicia cada día`}
          action={
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="neutral">{todayLogs.length} movimientos</Badge>
              <Button variant="secondary" size="sm" onClick={exportAccessCsv} aria-label="Exportar accesos en CSV">
                <Download size={15} /> CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={exportAccessJson} aria-label="Exportar accesos en JSON">
                <Download size={15} /> JSON
              </Button>
            </div>
          }
        />
        <CardBody className="space-y-3">
          {pagedLogs.length === 0 ? (
            <p className="py-8 text-center text-sm text-stadio-gray dark:text-white/50">
              Todavía no hay movimientos hoy.
            </p>
          ) : (
            pagedLogs.map((l) => {
              const client = findClientByName(l.user);
              return (
                <div key={l.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 p-3">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${l.type === "Entrada" ? "bg-stadio-green-bg text-stadio-green dark:bg-green-950/50" : "bg-red-100 text-stadio-red dark:bg-red-950/50"}`}>
                      <DoorOpen size={16} />
                    </span>
                    {client ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/clients/${client.id}`)}
                        className="text-left"
                      >
                        <p className="text-sm font-bold text-stadio-black hover:text-stadio-red dark:text-white">{l.user}</p>
                        <p className="text-xs text-stadio-gray">{l.time}</p>
                      </button>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-stadio-black dark:text-white">{l.user}</p>
                        <p className="text-xs text-stadio-gray">{l.time}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={l.type === "Entrada" ? "success" : "error"} dot>{l.type}</Badge>
                    <Badge variant={l.status === "Completado" ? "neutral" : "warning"}>{l.status}</Badge>
                  </div>
                </div>
              );
            })
          )}

          <Pagination page={logPage} totalPages={totalLogPages} onPageChange={setLogPage} className="pt-1" />
        </CardBody>
      </Card>

      <DeviceManager />
    </div>
  );
}