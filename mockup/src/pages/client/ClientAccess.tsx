import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { Users, Clock, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { aforoCurrent, occupancyToday, occupancyForecast, nowTime } from "../../data/aforo";
import { getGymSettings, getTodayHours } from "../../features/settings/gymSettings";

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

function remainingHours(closeTime: string): number {
  const [h, m] = nowTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  return Math.round(((ch * 60 + cm - (h * 60 + m)) / 60) * 10) / 10;
}

export function ClientAccess() {
  const capacity = getGymSettings().capacity;
  const today = getTodayHours();
  const closeTime = today.close;
  const hours = remainingHours(closeTime);
  const pct = Math.round((aforoCurrent.people / capacity) * 100);
  const peak = [...occupancyToday, ...occupancyForecast].reduce((a, b) => (b.people > a.people ? b : a));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Aforo del gimnasio</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
            Estado del gimnasio en tiempo real con predicción hasta el cierre
          </p>
        </div>
        <Badge variant="success" dot>Abierto · cierra a las {closeTime}</Badge>
      </div>

      <Card>
        <CardHeader title="AFORO ACTUAL" action={<Users size={18} className="text-stadio-gray" />} />
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-extrabold text-stadio-black dark:text-white">{aforoCurrent.people}</p>
              <p className="text-xs text-stadio-gray">personas dentro ahora</p>
            </div>
            <div className="w-1/2">
              <div className="h-3 w-full overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                <div className="h-full rounded-full bg-stadio-red" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-right text-sm font-bold text-stadio-red">{pct}% ocupación</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-stadio-gray dark:text-white/50">
            Capacidad máxima del recinto: {capacity} personas.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="OCUPACIÓN POR HORAS · HOY" subtitle="Entradas reales durante el día" />
        <CardBody>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={occupancyToday} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} personas`, "Ocupación"]} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <ReferenceLine y={capacity} stroke="#111" strokeDasharray="4 4" strokeWidth={1} />
              <Bar dataKey="people" radius={[6, 6, 0, 0]} maxBarSize={22}>
                {occupancyToday.map((d) => (
                  <Cell key={d.time} fill={d.time === "19:00" ? "#d71920" : "#f0a0a3"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-xs text-stadio-gray dark:text-white/50">
            Barra destacada: hora actual ({nowTime}); la línea gris indica la capacidad máxima.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="PREDICCIÓN HASTA EL CIERRE" subtitle={`${closeTime} · faltan ${hours.toLocaleString("es-ES")} h`} action={<Clock size={18} className="text-stadio-gray" />} />
        <CardBody>
          <div className="grid grid-cols-3 gap-3">
            {occupancyForecast.map((f) => (
              <div key={f.time} className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3 text-center">
                <p className="text-xs font-semibold text-stadio-gray">{f.time}</p>
                <p className="mt-1 text-lg font-extrabold text-stadio-black dark:text-white">{f.people}</p>
                <p className="text-[11px] text-stadio-gray">personas (est.)</p>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={occupancyForecast} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={36} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} personas`, "Previsión"]} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="people" radius={[6, 6, 0, 0]} maxBarSize={40} fill="#f0a0a3" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 dark:border-white/10 p-3">
              <TrendingDown size={16} className="text-stadio-green shrink-0" />
              <p className="text-xs text-stadio-gray-dark dark:text-white/60">
                El aforo descenderá a partir de las <b>20:00</b>.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 dark:border-white/10 p-3">
              <TrendingUp size={16} className="text-stadio-red shrink-0" />
              <p className="text-xs text-stadio-gray-dark dark:text-white/60">
                Pico de hoy: <b>{peak.time}</b> con {peak.people} personas.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 dark:border-white/10 p-3">
              <Zap size={16} className="text-stadio-red shrink-0" />
              <p className="text-xs text-stadio-gray-dark dark:text-white/60">
                Faltan <b>{hours.toLocaleString("es-ES")} h</b> hasta el cierre de las {closeTime}.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}