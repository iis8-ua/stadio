import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { StatCard } from "../../components/StatCard";
import { Button } from "../../components/Button";
import { Users, TrendingUp, Ticket, DoorOpen, Download } from "lucide-react";
import {
  filterUsersData, filterRetentionData, filterPopularClasses, filterDistribution,
  filterPeakHoursForDate, filterDailyEntries, getStatMonth, pctChange,
  revenueYears, monthlyLabels, MONTHS_FULL,
} from "../../data/analytics";
import { useToast } from "../../hooks/useToast";
import { downloadFile, toCsv, downloadJson } from "../../utils/download";

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const maxMonthForYear = (y: number) => (y === CURRENT_YEAR ? CURRENT_MONTH : 11);
const maxDayFor = (y: number, m: number) => {
  const max = new Date(y, m + 1, 0).getDate();
  if (y === CURRENT_YEAR && m === CURRENT_MONTH) return Math.min(max, new Date().getDate());
  return max;
};

const selectClass =
  "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black px-2.5 py-1.5 text-xs font-bold text-stadio-black dark:text-white outline-none focus:border-stadio-red";

interface RangeFilter {
  year: number;
  from: number;
  to: number;
}

interface MonthDayFilterValue {
  year: number;
  month: number;
  day: number;
}

interface StatFilterValue {
  year: number;
  month: number;
}

function dayLabel(year: number, month: number, day: number): string {
  const s = new Date(year, month, day).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function MonthlyRangeFilter({ value, onChange }: { value: RangeFilter; onChange: (next: RangeFilter) => void }) {
  const max = maxMonthForYear(value.year);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select
        value={value.year}
        onChange={(e) => {
          const y = Number(e.target.value);
          const m = maxMonthForYear(y);
          onChange({ year: y, from: Math.min(value.from, m), to: Math.min(value.to, m) });
        }}
        aria-label="Año"
        className={selectClass}
      >
        {revenueYears.filter((y) => y <= CURRENT_YEAR).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select
        value={value.from}
        onChange={(e) => onChange({ ...value, from: Math.min(Number(e.target.value), value.to) })}
        aria-label="Mes inicial"
        className={selectClass}
      >
        {monthlyLabels.map((m, i) => (
          <option key={m} value={i} disabled={i > max}>{m}</option>
        ))}
      </select>
      <span className="text-xs font-bold text-stadio-gray">—</span>
      <select
        value={value.to}
        onChange={(e) => onChange({ ...value, to: Math.max(Number(e.target.value), value.from) })}
        aria-label="Mes final"
        className={selectClass}
      >
        {monthlyLabels.map((m, i) => (
          <option key={m} value={i} disabled={i > max}>{m}</option>
        ))}
      </select>
    </div>
  );
}

function MonthDayFilter({ value, onChange }: { value: MonthDayFilterValue; onChange: (next: MonthDayFilterValue) => void }) {
  const max = maxMonthForYear(value.year);
  const maxDay = maxDayFor(value.year, value.month);
  const changeMonth = (m: number) =>
    onChange({ year: value.year, month: m, day: Math.min(value.day, maxDayFor(value.year, m)) });
  const changeYear = (y: number) => {
    const m = Math.min(value.month, maxMonthForYear(y));
    onChange({ year: y, month: m, day: Math.min(value.day, maxDayFor(y, m)) });
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select value={value.year} onChange={(e) => changeYear(Number(e.target.value))} aria-label="Año" className={selectClass}>
        {revenueYears.filter((y) => y <= CURRENT_YEAR).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select value={value.month} onChange={(e) => changeMonth(Number(e.target.value))} aria-label="Mes" className={selectClass}>
        {monthlyLabels.map((m, i) => (
          <option key={m} value={i} disabled={i > max}>{m}</option>
        ))}
      </select>
      <select value={value.day} onChange={(e) => onChange({ ...value, day: Number(e.target.value) })} aria-label="Día" className={selectClass}>
        {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </div>
  );
}

function StatFilter({ value, onChange }: { value: StatFilterValue; onChange: (next: StatFilterValue) => void }) {
  const max = maxMonthForYear(value.year);
  const changeYear = (y: number) =>
    onChange({ year: y, month: Math.min(value.month, maxMonthForYear(y)) });
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <select value={value.year} onChange={(e) => changeYear(Number(e.target.value))} aria-label="Año" className={selectClass}>
        {revenueYears.filter((y) => y <= CURRENT_YEAR).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select value={value.month} onChange={(e) => onChange({ ...value, month: Number(e.target.value) })} aria-label="Mes" className={selectClass}>
        {MONTHS_FULL.map((m, i) => (
          <option key={m} value={i} disabled={i > max}>{m}</option>
        ))}
      </select>
    </div>
  );
}

export function AdminAnalytics() {
  const { notify } = useToast();
  const [usersFilter, setUsersFilter] = useState<RangeFilter>({ year: CURRENT_YEAR, from: 0, to: CURRENT_MONTH });
  const [retFilter, setRetFilter] = useState<RangeFilter>({ year: CURRENT_YEAR, from: 0, to: CURRENT_MONTH });
  const [classesFilter, setClassesFilter] = useState<RangeFilter>({ year: CURRENT_YEAR, from: 0, to: CURRENT_MONTH });
  const [distFilter, setDistFilter] = useState<RangeFilter>({ year: CURRENT_YEAR, from: 0, to: CURRENT_MONTH });
  const [peakFilter, setPeakFilter] = useState<MonthDayFilterValue>({ year: CURRENT_YEAR, month: CURRENT_MONTH, day: Math.min(new Date().getDate(), maxDayFor(CURRENT_YEAR, CURRENT_MONTH)) });
  const [dailyFilter, setDailyFilter] = useState<MonthDayFilterValue>({ year: CURRENT_YEAR, month: CURRENT_MONTH, day: Math.min(new Date().getDate(), maxDayFor(CURRENT_YEAR, CURRENT_MONTH)) });
  const [statFilter, setStatFilter] = useState<StatFilterValue>({ year: CURRENT_YEAR, month: CURRENT_MONTH });

  const usersData = filterUsersData(usersFilter.year, usersFilter.from, usersFilter.to);
  const retData = filterRetentionData(retFilter.year, retFilter.from, retFilter.to);
  const classesData = filterPopularClasses(classesFilter.year, classesFilter.from, classesFilter.to);
  const distData = filterDistribution(distFilter.year, distFilter.from, distFilter.to);
  const peakData = filterPeakHoursForDate(peakFilter.year, peakFilter.month, peakFilter.day);
  const dailyData = filterDailyEntries(dailyFilter.year, dailyFilter.month);

  const stat = getStatMonth(statFilter.year, statFilter.month);
  const prev = getStatMonth(statFilter.year, statFilter.month === 0 ? statFilter.month : statFilter.month - 1);
  const statChanges = {
    activeUsers: pctChange(stat.activeUsers, prev.activeUsers),
    revenue: pctChange(stat.revenue, prev.revenue),
    bookings: pctChange(stat.bookings, prev.bookings),
    accesses: pctChange(stat.accesses, prev.accesses),
  };

  const buildReportData = () => ({
    generado: new Date().toISOString(),
    periodo: `${MONTHS_FULL[statFilter.month]} ${statFilter.year}`,
    kpis: {
      usuariosActivos: stat.activeUsers,
      ingresos: stat.revenue,
      reservas: stat.bookings,
      accesosPorDia: stat.accesses,
    },
    evolucionUsuarios: usersData,
    horasPunta: peakData,
  });

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Analítica STADIO"],
      ["Periodo", `${MONTHS_FULL[statFilter.month]} ${statFilter.year}`],
      ["Usuarios activos", stat.activeUsers],
      ["Ingresos (EUR)", stat.revenue],
      ["Reservas", stat.bookings],
      ["Accesos/día", stat.accesses],
      [],
      ["Evolución de usuarios", "Mes", "Activos", "Total"],
      ...usersData.map((d) => ["", d.month, d.active, d.total]),
      [],
      ["Horas punta", "Hora", "Tráfico"],
      ...peakData.map((d) => ["", d.hour, d.traffic]),
    ];
    downloadFile("informe-analitica-stadio.csv", toCsv(rows), "text/csv;charset=utf-8");
    notify("Informe CSV exportado");
  };

  const exportJson = () => {
    downloadJson("informe-analitica-stadio.json", buildReportData());
    notify("Informe JSON exportado");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Analítica</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Métricas de rendimiento del gimnasio</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatFilter value={statFilter} onChange={setStatFilter} />
          <Button variant="secondary" size="sm" onClick={exportCsv}>
            <Download size={15} /> CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={exportJson}>
            <Download size={15} /> JSON
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Usuarios activos" value={stat.activeUsers.toLocaleString("es-ES")} change={statChanges.activeUsers} icon={<Users size={20} />} />
        <StatCard label="Ingresos" value={`${stat.revenue.toLocaleString("es-ES")} €`} change={statChanges.revenue} icon={<TrendingUp size={20} />} />
        <StatCard label="Reservas" value={stat.bookings.toLocaleString("es-ES")} change={statChanges.bookings} icon={<Ticket size={20} />} />
        <StatCard label="Accesos / día" value={stat.accesses.toLocaleString("es-ES")} change={statChanges.accesses} icon={<DoorOpen size={20} />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Evolución de usuarios" action={<MonthlyRangeFilter value={usersFilter} onChange={setUsersFilter} />} />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" name="Activos" dataKey="active" stroke="#d71920" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" name="Total" dataKey="total" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Horas punta"
            subtitle={dayLabel(peakFilter.year, peakFilter.month, peakFilter.day)}
            action={<MonthDayFilter value={peakFilter} onChange={setPeakFilter} />}
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={peakData}>
                <defs>
                  <linearGradient id="peakh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d71920" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#d71920" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="traffic" stroke="#d71920" strokeWidth={3} fill="url(#peakh)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Clases populares" subtitle="% de ocupación media" action={<MonthlyRangeFilter value={classesFilter} onChange={setClassesFilter} />} />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={classesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Ocupación"]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {classesData.map((_, i) => (
                    <Cell key={i} fill={["#d71920", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed", "#0891b2", "#db2777"][i % 7]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Distribución de socios" action={<MonthlyRangeFilter value={distFilter} onChange={setDistFilter} />} />
          <CardBody>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={distData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {distData.map((m, i) => (
                    <Cell key={i} fill={m.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              {distData.map((d) => (
                <span key={d.name} className="inline-flex items-center gap-1.5 text-stadio-gray-dark dark:text-white/60">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} /> {d.name} {d.value.toLocaleString("es-ES")}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Accesos por día"
            subtitle={dayLabel(dailyFilter.year, dailyFilter.month, dailyFilter.day)}
            action={<MonthDayFilter value={dailyFilter} onChange={setDailyFilter} />}
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="entries" name="Accesos" radius={[6, 6, 0, 0]}>
                  {dailyData.map((d) => (
                    <Cell key={d.day} fill={Number(d.day) === dailyFilter.day ? "#d71920" : "#2563eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Retención de socios" subtitle="Tasa mensual" action={<MonthlyRangeFilter value={retFilter} onChange={setRetFilter} />} />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={retData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 85]} tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Retención"]} />
                <Line type="monotone" dataKey="retention" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: "#16a34a" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}