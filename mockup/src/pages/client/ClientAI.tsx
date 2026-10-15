import {
  Sparkles,
  Dumbbell,
  TrendingUp,
  HeartPulse,
  CalendarRange,
  Target,
  FileText,
  HeartHandshake,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Download,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { getClientProfile } from "../../features/profile/clientProfile";
import {
  getMuscleBalance,
  getLoadProgression,
  getRecoveryAnalysis,
  getWeeklyPlanning,
  getGoalBalance,
  getEvolutionReport,
} from "../../features/ai/clientAnalysis";
import { useToast } from "../../hooks/useToast";
import { downloadFile, toCsv, downloadJson } from "../../utils/download";

export function ClientAI() {
  const profile = getClientProfile();
  const muscles = getMuscleBalance();
  const progressions = getLoadProgression();
  const recovery = getRecoveryAnalysis();
  const planning = getWeeklyPlanning();
  const goalBalance = getGoalBalance();
  const report = getEvolutionReport();
  const { notify } = useToast();

  const buildReport = () => ({
    generado: new Date().toISOString(),
    resumen: {
      sesiones: report.totalSessions,
      volumenTotalKg: report.totalVolume,
      volumenPorSesionKg: report.avgVolumePerSession,
      adherenciaPct: report.adherencePct,
    },
    progresionCargas: progressions.map((p) => ({
      ejercicio: p.name,
      meses: p.months,
      cargasKg: p.weights,
      variacionPct: Number(p.deltaPct.toFixed(1)),
    })),
  });

  const downloadCsv = () => {
    const rows: (string | number)[][] = [
      ["Informe de evolución STADIO"],
      ["Métrica", "Valor"],
      ["Sesiones", report.totalSessions],
      ["Volumen total (kg)", report.totalVolume],
      ["Volumen por sesión (kg)", report.avgVolumePerSession],
      ["Adherencia (%)", report.adherencePct],
      [],
      ["Ejercicio", "Carga inicial (kg)", "Carga final (kg)", "Variación (%)"],
      ...progressions.map((p) => [p.name, p.weights[0] ?? "", p.weights[p.weights.length - 1] ?? "", p.deltaPct.toFixed(1)]),
    ];
    downloadFile("informe-evolucion-stadio.csv", toCsv(rows), "text/csv;charset=utf-8");
    notify("Informe CSV descargado", "success");
  };

  const downloadJsonReport = () => {
    downloadJson("informe-evolucion-stadio.json", buildReport());
    notify("Informe JSON descargado", "success");
  };

  const press = progressions.find((p) => p.name === "Press banca");
  const pressDelta = press?.deltaPct ?? 0;
  const maxShare = Math.max(...muscles.stats.map((s) => s.share), 1);

  const goalLine =
    profile.goal === "Pérdida de grasa"
      ? `Estás a ${Math.max(0, profile.weight - profile.targetWeight).toLocaleString("es-ES")} kg de tu peso objetivo de ${profile.targetWeight.toLocaleString("es-ES")} kg.`
      : `Tu peso actual de ${profile.weight.toLocaleString("es-ES")} kg se mantiene alineado con tu objetivo de ${profile.goal}.`;

  const habits = [
    "Duerme entre 7 y 8 horas para consolidar la adaptación muscular.",
    "Mantén una hidratación constante antes, durante y después del entreno.",
    "Calienta 10 minutos con activación previa a cada sesión.",
    "Registra cada serie con peso y repeticiones para que la IA pueda analizarlo.",
    "Respeta los descansos entre sesiones para no acumular fatiga.",
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Análisis inteligente</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
          Analizamos tus entrenamientos, cargas y recuperación para ayudarte a mejorar.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-stadio-black to-gray-800 dark:from-red-900/60 dark:to-stadio-black p-5 sm:p-6">
          <div className="flex items-center gap-2 text-white/70">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">STADIO AI</span>
          </div>
          <p className="mt-3 text-lg sm:text-xl font-extrabold leading-snug text-white">
            Tu press banca ha mejorado un <span className="text-red-400">{Math.abs(pressDelta).toFixed(0)}%</span> en el
            último trimestre.
          </p>
          <p className="mt-2 text-sm text-white/50">
            El análisis se genera automáticamente a partir de tu historial de sesiones registradas.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="neutral">Objetivo: {profile.goal}</Badge>
            <Badge variant="neutral">{profile.weight.toLocaleString("es-ES")} kg</Badge>
            <Badge variant="neutral">Meta: {profile.targetWeight.toLocaleString("es-ES")} kg</Badge>
            <Badge variant="neutral">Adherencia: {report.adherencePct}%</Badge>
          </div>
          <p className="mt-3 text-sm text-white/70">{goalLine}</p>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="lg:row-span-2">
          <CardHeader title="EQUILIBRIO MUSCULAR" subtitle="Grupos poco trabajados y desequilibrios" action={<Dumbbell size={18} className="text-stadio-gray" />} />
          <CardBody className="space-y-4">
            {muscles.stats.map((s) => (
              <div key={s.muscle}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-stadio-black dark:text-white">{s.muscle}</span>
                  <span className="text-xs font-semibold text-stadio-gray-dark dark:text-white/60">{s.share.toFixed(1)}%</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${
                      s.status === "bajo" ? "bg-stadio-amber" : s.status === "fuerte" ? "bg-stadio-red" : "bg-stadio-gray-dark dark:bg-white/50"
                    }`}
                    style={{ width: `${(s.share / maxShare) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Trabajo de empuje</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{muscles.pushSets} sets</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Trabajo de tirón</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{muscles.pullSets} sets</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-4">
              <div className="flex items-center gap-2 font-bold text-stadio-black dark:text-white">
                <AlertTriangle size={16} className="text-stadio-amber" />
                Grupos poco trabajados
              </div>
              {muscles.lowGroups.length > 0 ? (
                <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">
                  {muscles.lowGroups.join(", ")} reciben menos estímulo que el resto.
                </p>
              ) : (
                <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">Todos los grupos reciben estímulo suficiente.</p>
              )}
            </div>

            <p className="text-sm leading-relaxed text-stadio-gray-dark dark:text-white/70">{muscles.finding}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="PROGRESIÓN DE CARGAS" subtitle="Aumentos progresivos y estancamientos" action={<TrendingUp size={18} className="text-stadio-gray" />} />
          <CardBody className="space-y-3">
            {progressions.map((p) => (
              <div key={p.name} className="rounded-xl border border-gray-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-stadio-black dark:text-white">{p.name}</p>
                  <Badge variant={p.status === "progresando" ? "success" : "warning"}>
                    {p.status === "progresando" ? "Progresando" : "Estancado"}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stadio-gray-dark dark:text-white/60">
                  {p.months.map((m, i) => (
                    <span key={m}>
                      {m}: <span className="font-bold text-stadio-black dark:text-white">{p.weights[i]} kg</span>
                    </span>
                  ))}
                  <span className="font-semibold text-stadio-green">Δ {p.deltaPct.toFixed(1)}%</span>
                </div>
                <p className="mt-2 text-xs text-stadio-gray dark:text-white/50">
                  Siguiente objetivo: <span className="font-bold text-stadio-red">{p.suggested} kg</span>
                </p>
                <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">{p.note}</p>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="RECUPERACIÓN" subtitle="Riesgo de sobreentrenamiento y descanso" action={<HeartPulse size={18} className="text-stadio-gray" />} />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Sesiones/semana</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">
                  {recovery.avgSessionsPerWeek.toFixed(1)}
                  <span className="text-xs font-normal text-stadio-gray"> / {recovery.targetSessionsPerWeek}</span>
                </p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Vol/sesión</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{recovery.avgVolumePerSession.toLocaleString("es-ES")} kg</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Duración</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{recovery.avgDuration} min</p>
              </div>
            </div>

            <div className="space-y-2">
              {recovery.findings.map((f, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 rounded-xl p-3 text-xs leading-relaxed ${
                    i === 0 && (recovery.overtraining || recovery.underTraining)
                      ? "border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20"
                      : "border border-gray-100 dark:border-white/10"
                  }`}
                >
                  {i === 0 ? (
                    <AlertTriangle size={15} className="shrink-0 text-stadio-amber" />
                  ) : (
                    <CheckCircle2 size={15} className="shrink-0 text-stadio-green" />
                  )}
                  <span className="text-stadio-gray-dark dark:text-white/70">{f}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stadio-gray mb-2">
                <Lightbulb size={13} className="text-stadio-red" /> Cómo mejorar
              </p>
              <ul className="space-y-1.5">
                {recovery.tips.map((t) => (
                  <li key={t} className="flex gap-2 text-xs text-stadio-gray-dark dark:text-white/60">
                    <span className="text-stadio-red">•</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="PLANIFICACIÓN SEMANAL" subtitle="Frecuencia real frente a tu plan" action={<CalendarRange size={18} className="text-stadio-gray" />} />
          <CardBody className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-stadio-black dark:text-white">Cumplimiento de frecuencia</span>
                <span className="text-xs font-semibold text-stadio-gray-dark dark:text-white/60">{planning.coveredPct}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                <div
                  className={`h-full rounded-full ${planning.coveredPct >= 80 ? "bg-stadio-green" : planning.coveredPct >= 60 ? "bg-stadio-amber" : "bg-stadio-red"}`}
                  style={{ width: `${planning.coveredPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Real</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{planning.realFrequency.toFixed(1)}/sem</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Plan</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{planning.targetFrequency}/sem</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Descanso</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{planning.restDays} días</p>
              </div>
            </div>

            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stadio-gray mb-2">
                <Lightbulb size={13} className="text-stadio-red" /> Recomendaciones
              </p>
              <ul className="space-y-1.5">
                {planning.tips.map((t) => (
                  <li key={t} className="flex gap-2 text-xs text-stadio-gray-dark dark:text-white/60">
                    <span className="text-stadio-red">•</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:row-span-2">
          <CardHeader title="EQUILIBRIO SEGÚN TU OBJETIVO" subtitle="Coherencia entre entrenamiento y meta" action={<Target size={18} className="text-stadio-gray" />} />
          <CardBody className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info">Objetivo: {goalBalance.goal}</Badge>
              <Badge variant={goalBalance.alignedPct >= 70 ? "success" : "warning"}>
                {goalBalance.alignedPct}% alineado
              </Badge>
            </div>
            <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-4 text-sm">
              <p className="font-bold text-stadio-black dark:text-white">{goalBalance.aligned}/{goalBalance.total} sesiones</p>
              <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/70">orientadas a tu objetivo en el último mes</p>
            </div>
            <p className="text-sm leading-relaxed text-stadio-gray-dark dark:text-white/70">{goalBalance.verdict}</p>
            <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4">
              <p className="text-xs leading-relaxed text-stadio-gray-dark dark:text-white/70">
                <span className="font-bold text-stadio-blue">Recomendación: </span>
                {goalBalance.recommendation}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="INFORME DE EVOLUCIÓN" subtitle="Resumen personalizado del trimestre" action={<FileText size={18} className="text-stadio-gray" />} />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Sesiones</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{report.totalSessions}</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Volumen total</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{(report.totalVolume / 1000).toFixed(1)} t</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Vol/sesión</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{report.avgVolumePerSession.toLocaleString("es-ES")} kg</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Adherencia</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{report.adherencePct}%</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stadio-gray-dark dark:text-white/70">{report.verdict}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={downloadCsv}>
                <Download size={15} /> CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={downloadJsonReport}>
                <Download size={15} /> JSON
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="HÁBITOS Y RENDIMIENTO" subtitle="Sugerencias para mantener un entrenamiento saludable" action={<HeartHandshake size={18} className="text-stadio-gray" />} />
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-2">
              {habits.map((h) => (
                <div key={h} className="flex items-start gap-2.5 rounded-xl border border-gray-100 dark:border-white/10 p-3.5">
                  <CheckCircle2 size={18} className="shrink-0 text-stadio-green" />
                  <p className="text-sm text-stadio-gray-dark dark:text-white/70">{h}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}