import { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Scale, Dumbbell, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardBody, } from "../../components/Card";
import { Select } from "../../components/Input";
import { Button } from "../../components/Button";
import { clientAIInsights } from "../../data/aiInsights";
import { getClientProfile } from "../../features/profile/clientProfile";
import { PROGRESS_YEARS, MONTHS_FULL, exerciseLoadSeries, PROGRESS_EXERCISES, bodyWeightSeries, volumeMonthlySeries, volumeWeeklySeries } from "../../data/progress";

type Granularity = "month" | "week";

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

export function ClientProgress() {
  const [year, setYear] = useState(2026);
  const [from, setFrom] = useState(5);
  const [to, setTo] = useState(8);
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [exercise, setExercise] = useState("Press banca");
  const [cmpAFrom, setCmpAFrom] = useState(5);
  const [cmpATo, setCmpATo] = useState(6);
  const [cmpBFrom, setCmpBFrom] = useState(7);
  const [cmpBTo, setCmpBTo] = useState(8);
  const profile = getClientProfile();

  const setFromMonth = (m: number) => {
    setFrom(m);
    if (m > to) setTo(m);
  };
  const setToMonth = (m: number) => {
    setTo(Math.max(m, from));
  };

  const applyPreset = (preset: string) => {
    const end = 8; // Agosto (mes de referencia de los datos)
    if (preset === "semana") { setFrom(end); setTo(end); setGranularity("week"); return; }
    if (preset === "mes") { setFrom(end); setTo(end); setGranularity("month"); return; }
    if (preset === "3m") { setFrom(end - 2); setTo(end); return; }
    if (preset === "6m") { setFrom(end - 5); setTo(end); return; }
    if (preset === "año") { setFrom(0); setTo(11); return; }
  };

  const bench = exerciseLoadSeries(exercise, year, from, to);
  const weightSeries = bodyWeightSeries(year, from, to, profile.weight);
  const volume = granularity === "week" ? volumeWeeklySeries(year, from, to) : volumeMonthlySeries(year, from, to);
  const totalVolume = volume.reduce((a, p) => a + p.kg, 0);
  const workoutCount = granularity === "week" ? volume.length : (to - from + 1) * 4;

  const first = bench[0]?.kg ?? 0;
  const last = bench[bench.length - 1]?.kg ?? 0;
  const pct = first > 0 ? Math.abs((last - first) / first) * 100 : 0;
  const freqNum = profile.frequency.match(/\d+/)?.[0];
  const freqLabel = freqNum ? `${freqNum}/sem` : profile.frequency;

  const flatWeights = weightSeries.map((p) => p.kg);
  const weightDomain =
    flatWeights.length > 0
      ? [Math.max(0, Math.floor(Math.min(...flatWeights)) - 1), Math.ceil(Math.max(...flatWeights)) + 1]
      : [70, 80];

  const weightDelta = profile.weight - profile.targetWeight;
  const goalProgression =
    profile.goal === "Pérdida de grasa" || profile.goal === "Resistencia"
      ? weightDelta > 0
        ? `Aún te quedan ${Math.abs(weightDelta).toLocaleString("es-ES")} kg hasta tu objetivo.`
        : "Estás en tu rango de peso objetivo."
      : `Tu peso actual es de ${profile.weight.toLocaleString("es-ES")} kg, consistente con tu objetivo de ${profile.goal}.`;

  // RF-48: comparación entre dos periodos.
  type PeriodStats = { start: number; end: number; delta: number; volume: number; sessions: number };
  const periodStats = (pFrom: number, pTo: number): PeriodStats | null => {
    const a = Math.min(pFrom, pTo);
    const b = Math.max(pFrom, pTo);
    const load = exerciseLoadSeries(exercise, year, a, b);
    if (load.length === 0) return null;
    const start = load[0].kg;
    const end = load[load.length - 1].kg;
    const delta = start > 0 ? ((end - start) / start) * 100 : 0;
    const vol = volumeMonthlySeries(year, a, b).reduce((acc, x) => acc + x.kg, 0);
    return { start, end, delta, volume: vol, sessions: (b - a + 1) * 4 };
  };
  const statsA = periodStats(cmpAFrom, cmpATo);
  const statsB = periodStats(cmpBFrom, cmpBTo);
  const formatNumber = (n: number) => n.toLocaleString("es-ES");
  const comparisonRows =
    statsA && statsB
      ? [
          { label: "Carga final", a: `${formatNumber(statsA.end)} kg`, b: `${formatNumber(statsB.end)} kg`, diff: statsB.end - statsA.end, unit: " kg" },
          { label: "Variación del periodo", a: `${statsA.delta.toFixed(1).replace(".", ",")}%`, b: `${statsB.delta.toFixed(1).replace(".", ",")}%`, diff: statsB.delta - statsA.delta, unit: " p.p." },
          { label: "Volumen total", a: `${formatNumber(statsA.volume)} kg`, b: `${formatNumber(statsB.volume)} kg`, diff: statsB.volume - statsA.volume, unit: " kg" },
          { label: "Sesiones", a: String(statsA.sessions), b: String(statsB.sessions), diff: statsB.sessions - statsA.sessions, unit: "" },
        ]
      : [];

  const periodSelectors = [
    { label: "Periodo A", from: cmpAFrom, to: cmpATo, setFrom: setCmpAFrom, setTo: setCmpATo },
    { label: "Periodo B", from: cmpBFrom, to: cmpBTo, setFrom: setCmpBFrom, setTo: setCmpBTo },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Mi progreso</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Evolución de tu rendimiento</p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">Ejercicio</span>
            <Select value={exercise} onChange={(e) => setExercise(e.target.value)} className="w-44">
              {PROGRESS_EXERCISES.map((ex) => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">Año</span>
            <Select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-24">
              {PROGRESS_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">Desde</span>
            <Select value={from} onChange={(e) => setFromMonth(Number(e.target.value))} className="w-32">
              {MONTHS_FULL.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">Hasta</span>
            <Select value={to} onChange={(e) => setToMonth(Number(e.target.value))} className="w-32">
              {MONTHS_FULL.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </Select>
          </label>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 bg-stadio-gray-light/60 dark:bg-stadio-black p-1">
            {([["semana", "Semana"], ["mes", "Mes"], ["3m", "3 meses"], ["6m", "6 meses"], ["año", "Año"]] as const).map(([id, label]) => (
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
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Entrenamientos", value: String(workoutCount), icon: Dumbbell },
          { label: "Frecuencia", value: freqLabel, icon: Calendar },
          { label: "Volumen total", value: `${totalVolume.toLocaleString("es-ES")} kg`, icon: TrendingUp },
          { label: "Peso corporal", value: `${profile.weight.toLocaleString("es-ES")} kg`, icon: Scale },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardBody className="p-4">
                <Icon size={18} className="text-stadio-red" />
                <p className="mt-2 text-lg font-extrabold text-stadio-black dark:text-white">{s.value}</p>
                <p className="text-xs text-stadio-gray">{s.label}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader
          title={`${exercise} · Evolución de carga`}
          subtitle={`${first} kg → ${last} kg · +${pct.toFixed(1).replace(".", ",")}%`}
        />
        <CardBody>
          {bench.length < 2 ? (
            <p className="py-10 text-center text-sm text-stadio-gray dark:text-white/50">
              No hay datos suficientes para el periodo seleccionado. Amplía el intervalo para ver la evolución.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={bench}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Carga"]} />
                <Line type="monotone" dataKey="kg" stroke="#d71920" strokeWidth={3} dot={{ r: 4, fill: "#d71920" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Volumen de entrenamiento"
            action={
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 bg-stadio-gray-light/60 dark:bg-stadio-black p-1">
                {(["month", "week"] as Granularity[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGranularity(g)}
                    className={`rounded-md px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                      granularity === g
                        ? "bg-stadio-red text-white"
                        : "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    }`}
                  >
                    {g === "month" ? "Por meses" : "Por semanas"}
                  </button>
                ))}
              </div>
            }
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={volume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={45} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Volumen"]} />
                <Bar dataKey="kg" fill="#d71920" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Peso corporal" subtitle={`Objetivo: ${profile.targetWeight.toLocaleString("es-ES")} kg`} />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                <YAxis domain={weightDomain} tick={{ fontSize: 12, fill: "#8a8a8a" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} kg`, "Peso"]} />
                <Line type="monotone" dataKey="kg" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Comparar periodos" subtitle={`${exercise} · ${year}`} />
        <CardBody className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {periodSelectors.map((p) => (
              <div key={p.label} className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-stadio-gray">{p.label}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Select
                    value={p.from}
                    onChange={(e) => { const v = Number(e.target.value); p.setFrom(v); if (v > p.to) p.setTo(v); }}
                    aria-label={`Desde ${p.label}`}
                    className="w-full"
                  >
                    {MONTHS_FULL.map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                  </Select>
                  <span className="text-xs font-bold text-stadio-gray">→</span>
                  <Select
                    value={p.to}
                    onChange={(e) => { const v = Number(e.target.value); p.setTo(Math.max(v, p.from)); }}
                    aria-label={`Hasta ${p.label}`}
                    className="w-full"
                  >
                    {MONTHS_FULL.map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                  </Select>
                </div>
                <p className="mt-1 text-xs text-stadio-gray dark:text-white/50">
                  {MONTHS_FULL[Math.min(p.from, p.to)]} – {MONTHS_FULL[Math.max(p.from, p.to)]}
                </p>
              </div>
            ))}
          </div>

          {!statsA || !statsB ? (
            <p className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3 text-sm text-stadio-gray dark:text-white/50">
              No hay datos suficientes en uno de los periodos seleccionados. Ajusta los intervalos para poder comparar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left dark:border-white/10">
                    <th scope="col" className="py-2 pr-3 text-xs font-bold uppercase tracking-wide text-stadio-gray">Métrica</th>
                    <th scope="col" className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-stadio-gray">Periodo A</th>
                    <th scope="col" className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-stadio-gray">Periodo B</th>
                    <th scope="col" className="py-2 pl-3 text-xs font-bold uppercase tracking-wide text-stadio-gray">Diferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((r) => (
                    <tr key={r.label} className="border-b border-gray-50 last:border-0 dark:border-white/5">
                      <td className="py-2 pr-3 font-semibold text-stadio-black dark:text-white">{r.label}</td>
                      <td className="px-3 py-2 text-stadio-gray-dark dark:text-white/70">{r.a}</td>
                      <td className="px-3 py-2 text-stadio-gray-dark dark:text-white/70">{r.b}</td>
                      <td className={`py-2 pl-3 font-bold ${r.diff >= 0 ? "text-stadio-green" : "text-stadio-red"}`}>
                        {r.diff >= 0 ? "+" : ""}
                        {r.diff.toLocaleString("es-ES", { maximumFractionDigits: 1 })}
                        {r.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-stadio-black to-gray-800 dark:from-red-900/60 dark:to-stadio-black p-5 sm:p-6">
          <div className="flex items-center gap-2 text-white/70">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">STADIO AI</span>
          </div>
          <h2 className="mt-3 text-lg font-extrabold text-white">Análisis de tu progreso</h2>
          <p className="mt-1 text-sm text-white/50">
            Hemos analizado tus entrenamientos y estos son los datos más relevantes.
          </p>
        </div>
        <CardBody>
          <div className="space-y-3">
            <div className="flex gap-3 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-4">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-stadio-red" />
              <div>
                <p className="text-sm font-bold text-stadio-black dark:text-white">Estado actual</p>
                <p className="mt-0.5 text-sm text-stadio-gray-dark dark:text-white/60">
                  Objetivo: {profile.goal} · Peso: {profile.weight.toLocaleString("es-ES")} kg · Meta: {profile.targetWeight.toLocaleString("es-ES")} kg
                </p>
                <p className="mt-2 rounded-lg bg-stadio-gray-light/70 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-stadio-gray-dark dark:text-white/50">
                  {goalProgression}
                </p>
              </div>
            </div>
            {clientAIInsights.slice(0, 2).map((i) => (
              <div key={i.id} className="flex gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-4">
                <Sparkles size={18} className="mt-0.5 shrink-0 text-stadio-red" />
                <div>
                  <p className="text-sm font-bold text-stadio-black dark:text-white">{i.title}</p>
                  <p className="mt-0.5 text-sm text-stadio-gray-dark dark:text-white/60">{i.description}</p>
                  <p className="mt-2 rounded-lg bg-stadio-gray-light/70 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-stadio-gray-dark dark:text-white/50">
                    {i.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/client/ai" className="mt-4 block">
            <Button variant="secondary" className="w-full">
              VER ANÁLISIS COMPLETO <ArrowRight size={16} />
            </Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}