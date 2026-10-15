import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, CalendarDays, Euro, DoorOpen, Eye, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { StatCard } from "../../components/StatCard";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import { ClassDetailModal } from "../../components/ClassDetailModal";
import { revenueYears, monthlyLabels, filterMonthlyData } from "../../data/analytics";
import { classTypes, classSessions, resolveGymClasses, dateToKey, fmtDayShort } from "../../data/classes";
import { clients } from "../../data/users";
import type { GymClass } from "../../types";

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

const selectClass =
  "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red";

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const maxMonthForYear = (y: number) => (y === CURRENT_YEAR ? CURRENT_MONTH : 11);

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
function joinedTime(joined: string): number {
  const [day, month, year] = joined.split(" ");
  const m = MESES.indexOf(month);
  if (m === -1) return 0;
  return new Date(Number(year), m, Number(day)).getTime();
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const gymClasses = resolveGymClasses(classTypes, classSessions);
  const todayKey = dateToKey(new Date());
  const todayClasses = gymClasses.filter((c) => c.date === todayKey).slice(0, 3);
  const recent = [...clients].sort((a, b) => joinedTime(b.joined) - joinedTime(a.joined)).slice(0, 3);

  const [year, setYear] = useState(CURRENT_YEAR);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(CURRENT_MONTH);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);

  const data = filterMonthlyData(year, from, to);

  const selectFrom = (v: number) => setFrom(Math.min(v, to));
  const selectTo = (v: number) => setTo(Math.max(v, from));
  const applyPreset = (preset: "mes" | "3m" | "6m" | "año") => {
    const end = maxMonthForYear(year);
    let f = 0;
    let t = end;
    if (preset === "mes") {
      f = end;
      t = end;
    } else if (preset === "3m") {
      f = Math.max(0, end - 2);
      t = end;
    } else if (preset === "6m") {
      f = Math.max(0, end - 5);
      t = end;
    }
    setFrom(f);
    setTo(t);
  };
  const changeYear = (y: number) => {
    const max = maxMonthForYear(y);
    setYear(y);
    setFrom((f) => Math.min(f, max));
    setTo((t) => Math.min(t, max));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Gym Dashboard</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Resumen general de STADIO</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total clientes" value="1.247" change={4.2} icon={<Users size={20} />} />
        <StatCard label="Clases hoy" value="12" change={2} icon={<CalendarDays size={20} />} />
        <StatCard label="Ingresos / mes" value="24.580 €" change={3.1} icon={<Euro size={20} />} />
        <StatCard label="Accesos hoy" value="142" change={-1.8} icon={<DoorOpen size={20} />} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-stadio-black p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-stadio-gray">Año</label>
          <select value={year} onChange={(e) => changeYear(Number(e.target.value))} className={selectClass}>
            {revenueYears.filter((y) => y <= CURRENT_YEAR).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <label className="ml-2 text-xs font-bold text-stadio-gray">Desde</label>
          <select value={from} onChange={(e) => selectFrom(Number(e.target.value))} className={selectClass}>
            {monthlyLabels.map((m, i) => (
              <option key={m} value={i} disabled={i > maxMonthForYear(year)}>{m}</option>
            ))}
          </select>
          <label className="ml-2 text-xs font-bold text-stadio-gray">Hasta</label>
          <select value={to} onChange={(e) => selectTo(Number(e.target.value))} className={selectClass}>
            {monthlyLabels.map((m, i) => (
              <option key={m} value={i} disabled={i > maxMonthForYear(year)}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 bg-stadio-gray-light/60 dark:bg-stadio-black p-1">
          {([["mes", "Mes"], ["3m", "3 meses"], ["6m", "6 meses"], ["año", "Año"]] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => applyPreset(id)}
              className="rounded-md px-2.5 py-1.5 text-xs font-bold text-stadio-gray-dark hover:bg-white dark:text-white/60 dark:hover:bg-white/10"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Ingresos mensuales" action={<Badge variant="success">+3,1%</Badge>} />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d71920" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#d71920" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={55} tickFormatter={(v) => Number(v).toLocaleString("es-ES")} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString("es-ES")} €`, "Ingresos"]} />
                <Area type="monotone" dataKey="revenue" stroke="#d71920" strokeWidth={3} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Ocupación del gimnasio" subtitle="% de ocupación mensual" />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={35} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Ocupación"]} />
                <Line type="monotone" dataKey="occupancy" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="CLASES DE HOY" subtitle="Pulsa una clase para ver el detalle" />
          <CardBody className="space-y-2">
            {todayClasses.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedClass(c)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3 text-left transition-colors hover:border-stadio-red/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{c.name}</p>
                  <p className="text-xs text-stadio-gray">{fmtDayShort(c.date)} · {c.time} · {c.trainer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.booked >= c.capacity ? "error" : "info"}>{c.booked}/{c.capacity}</Badge>
                  <ChevronRight size={16} className="text-stadio-gray" />
                </div>
              </button>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="ALTAS RECIENTES"
            action={
              <button
                type="button"
                onClick={() => navigate("/admin/clients")}
                className="text-xs font-semibold text-stadio-red hover:underline"
              >
                Ver todos
              </button>
            }
          />
          <CardBody className="space-y-2">
            {recent.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/clients/${c.id}`)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <Avatar initials={c.initials} color={c.color} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-stadio-black hover:text-stadio-red dark:text-white">{c.name}</p>
                    <p className="text-xs text-stadio-gray">Se unió el {c.joined}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/clients/${c.id}`)}
                  className="rounded-lg p-2 text-stadio-gray-dark transition-colors hover:bg-stadio-gray-light hover:text-stadio-red dark:text-white/60 dark:hover:bg-white/10"
                  aria-label={`Ver perfil de ${c.name}`}
                >
                  <Eye size={16} />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <ClassDetailModal gymClass={selectedClass} onClose={() => setSelectedClass(null)} />
    </div>
  );
}