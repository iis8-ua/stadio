import {
  Sparkles,
  Dumbbell,
  Users,
  TrendingUp,
  CalendarDays,
  Target,
  FileText,
  Lightbulb,
  CheckCircle2,
  Download,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Avatar } from "../../components/Avatar";
import {
  getTrainerClassAnalysis,
  getPersonalTrainingAnalysis,
  getTrainerClientsAnalysis,
  getClientCoaching,
  getCoachingSummary,
  getTrainerReport,
} from "../../features/ai/trainerAnalysis";
import { useToast } from "../../hooks/useToast";
import { downloadFile, toCsv, downloadJson } from "../../utils/download";

function occupancyColor(pct: number): string {
  if (pct >= 80) return "bg-stadio-green";
  if (pct >= 60) return "bg-stadio-amber";
  return "bg-stadio-red";
}

export function TrainerAI() {
  const classAnalysis = getTrainerClassAnalysis();
  const personal = getPersonalTrainingAnalysis();
  const clientsAnalysis = getTrainerClientsAnalysis();
  const coaching = getClientCoaching();
  const coachingSummary = getCoachingSummary(coaching);
  const report = getTrainerReport();
  const { notify } = useToast();

  const maxPct = Math.max(...classAnalysis.byType.map((t) => t.pct), 1);
  const recommendations = [...personal.tips, ...clientsAnalysis.tips];

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Informe del entrenador STADIO"],
      ["Clientes", report.totalClients],
      ["Clases colectivas", report.totalClasses],
      ["Ocupación media (%)", report.avgOccupancy],
      ["Rutinas", report.routines],
      ["Sesiones personales", report.personalSessions],
      ["Adherencia media (%)", coachingSummary.avgAdherence],
      [],
      ["Ocupación por clase", "Ocupación (%)", "Reservadas", "Capacidad"],
      ...classAnalysis.byType.map((t) => [t.name, t.pct, t.booked, t.capacity]),
      [],
      ["Coaching por cliente", "Adherencia (%)", "Ritmo", "Completadas", "Objetivo semanal"],
      ...coaching.map((c) => [c.client.name, c.adherencePct, c.rhythm, c.completed, c.target]),
    ];
    downloadFile("informe-entrenador-stadio.csv", toCsv(rows), "text/csv;charset=utf-8");
    notify("Informe CSV descargado", "success");
  };

  const exportJson = () => {
    downloadJson("informe-entrenador-stadio.json", {
      generado: new Date().toISOString(),
      resumen: report,
      adherenciaMedia: coachingSummary.avgAdherence,
      clases: classAnalysis.byType,
      coaching: coaching.map((c) => ({
        cliente: c.client.name,
        objetivo: c.client.goal,
        adherenciaPct: c.adherencePct,
        ritmo: c.rhythm,
        completadas: c.completed,
        objetivoSemanal: c.target,
        hallazgos: c.findings,
        recomendaciones: c.recommendations,
      })),
    });
    notify("Informe JSON descargado", "success");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Análisis inteligente</h1>
        <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
          Analizamos tus clases, tus entrenamientos personales y el progreso de tus clientes.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-stadio-black to-gray-800 dark:from-red-900/60 dark:to-stadio-black p-5 sm:p-6">
          <div className="flex items-center gap-2 text-white/70">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">STADIO AI · Coach</span>
          </div>
          <p className="mt-3 text-lg sm:text-xl font-extrabold leading-snug text-white">
            Tus clases colectivas tienen una ocupación media del{" "}
            <span className="text-red-400">{classAnalysis.avgOccupancy}%</span>.
          </p>
          <p className="mt-2 text-sm text-white/50">
            El análisis se genera automáticamente a partir de tus clases, tu planificación personal y tus clientes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="neutral">Clases: {classAnalysis.totalClasses}</Badge>
            <Badge variant="neutral">Clientes: {report.totalClients}</Badge>
            <Badge variant="neutral">Personales: {personal.totalSessions}</Badge>
            <Badge variant="neutral">Rutinas: {report.routines}</Badge>
            <Badge variant="neutral">Adherencia media: {coachingSummary.avgAdherence}%</Badge>
          </div>
          <p className="mt-3 text-sm text-white/70">{classAnalysis.finding}</p>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="lg:row-span-2">
          <CardHeader
            title="OCUPACIÓN DE TUS CLASES"
            subtitle="Clases colectivas que impartes"
            action={<CalendarDays size={18} className="text-stadio-gray" />}
          />
          <CardBody className="space-y-4">
            {classAnalysis.byType.length === 0 ? (
              <p className="text-sm text-stadio-gray dark:text-white/50">No tienes clases colectivas asignadas.</p>
            ) : (
              <>
                {classAnalysis.byType.map((t) => (
                  <div key={t.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-stadio-black dark:text-white">{t.name}</span>
                      <span className="text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
                        {t.pct}% · {t.booked}/{t.capacity}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                      <div className={`h-full rounded-full ${occupancyColor(t.pct)}`} style={{ width: `${(t.pct / maxPct) * 100}%` }} />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                    <p className="text-xs text-stadio-gray">Clase más llena</p>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">
                      {classAnalysis.best ? `${classAnalysis.best.name} · ${classAnalysis.best.pct}%` : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                    <p className="text-xs text-stadio-gray">Clase con margen</p>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">
                      {classAnalysis.worst ? `${classAnalysis.worst.name} · ${classAnalysis.worst.pct}%` : "—"}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-stadio-gray">
                <Lightbulb size={13} className="text-stadio-red" /> Recomendaciones
              </p>
              <ul className="space-y-1.5">
                {classAnalysis.tips.map((t) => (
                  <li key={t} className="flex gap-2 text-xs text-stadio-gray-dark dark:text-white/60">
                    <span className="text-stadio-red">•</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="ENTRENAMIENTOS PERSONALES"
            subtitle="Sesiones uno a uno con tus clientes"
            action={<Dumbbell size={18} className="text-stadio-gray" />}
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Sesiones personales</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{personal.totalSessions}</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Clientes atendidos</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{personal.clientsTrained}</p>
              </div>
            </div>

            {personal.byClient.length > 0 && (
              <div className="space-y-2">
                {personal.byClient.map((c) => (
                  <div key={c.name} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 p-3">
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{c.name}</p>
                    <Badge variant="info">{c.count} {c.count === 1 ? "sesión" : "sesiones"}</Badge>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm leading-relaxed text-stadio-gray-dark dark:text-white/70">{personal.finding}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="MIS CLIENTES"
            subtitle="Progreso y objetivos"
            action={<Users size={18} className="text-stadio-gray" />}
          />
          <CardBody className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-stadio-black dark:text-white">Progreso medio</span>
                <span className="text-xs font-semibold text-stadio-gray-dark dark:text-white/60">{clientsAnalysis.avgProgress}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                <div className="h-full rounded-full bg-stadio-green" style={{ width: `${clientsAnalysis.avgProgress}%` }} />
              </div>
            </div>

            {clientsAnalysis.goals.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {clientsAnalysis.goals.map((g) => (
                  <Badge key={g.goal} variant="neutral">
                    {g.goal} · {g.count}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Mayor progreso</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">
                  {clientsAnalysis.top ? `${clientsAnalysis.top.name} · ${clientsAnalysis.top.progress}%` : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">A reforzar</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">
                  {clientsAnalysis.lowest ? `${clientsAnalysis.lowest.name} · ${clientsAnalysis.lowest.progress}%` : "—"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-4">
              <div className="flex items-center gap-2 font-bold text-stadio-black dark:text-white">
                <AlertTriangle size={16} className="text-stadio-amber" />
                Punto de atención
              </div>
              <p className="mt-1 text-xs text-stadio-gray-dark dark:text-white/60">{clientsAnalysis.finding}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="INFORME DEL ENTRENADOR"
            subtitle="Resumen de tu actividad"
            action={<FileText size={18} className="text-stadio-gray" />}
          />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Clientes</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{report.totalClients}</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Clases</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{report.totalClasses}</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Ocupación</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{report.avgOccupancy}%</p>
              </div>
              <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
                <p className="text-xs text-stadio-gray">Rutinas</p>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{report.routines}</p>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
                report.isWithinShift
                  ? "border border-gray-100 dark:border-white/10"
                  : "border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20"
              }`}
            >
              {report.isWithinShift ? (
                <CheckCircle2 size={15} className="shrink-0 text-stadio-green" />
              ) : (
                <AlertTriangle size={15} className="shrink-0 text-stadio-amber" />
              )}
              <span className="text-stadio-gray-dark dark:text-white/70">
                {report.isWithinShift
                  ? "Tus actividades de hoy encajan dentro del turno asignado."
                  : "Tienes actividades fuera del turno asignado por el administrador."}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-stadio-gray-dark dark:text-white/70">{report.verdict}</p>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={exportCsv}>
                <Download size={15} /> CSV
              </Button>
              <Button variant="secondary" size="sm" onClick={exportJson}>
                <Download size={15} /> JSON
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="RITMO Y COACHING DE CLIENTES"
            subtitle="Adherencia de cada cliente y ajustes para que mejoren"
            action={<Activity size={18} className="text-stadio-gray" />}
          />
          <CardBody>
            {coaching.length === 0 ? (
              <p className="text-sm text-stadio-gray dark:text-white/50">No tienes clientes asignados.</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {coaching.map((cc) => {
                  const rhythmLabel =
                    cc.rhythm === "bueno" ? "Buen ritmo" : cc.rhythm === "irregular" ? "Irregular" : "Ritmo bajo";
                  const rhythmVariant = cc.rhythm === "bueno" ? "success" : cc.rhythm === "irregular" ? "warning" : "error";
                  return (
                    <div key={cc.client.id} className="rounded-xl border border-gray-100 dark:border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar initials={cc.client.initials} color={cc.client.color} size="sm" />
                          <div>
                            <p className="text-sm font-bold text-stadio-black dark:text-white">{cc.client.name}</p>
                            <p className="text-xs text-stadio-gray">{cc.client.goal}</p>
                          </div>
                        </div>
                        <Badge variant={rhythmVariant as "success" | "warning" | "error"} dot>{rhythmLabel}</Badge>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-stadio-gray">
                          <span>Adherencia semanal</span>
                          <span>{cc.completed}/{cc.target} · {cc.adherencePct}%</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stadio-gray-light dark:bg-white/10">
                          <div className={`h-full rounded-full ${occupancyColor(cc.adherencePct)}`} style={{ width: `${cc.adherencePct}%` }} />
                        </div>
                      </div>

                      <ul className="mt-3 space-y-1">
                        {cc.findings.map((f) => (
                          <li key={f} className="flex gap-1.5 text-xs text-stadio-gray-dark dark:text-white/60">
                            <span className="text-stadio-gray">•</span> {f}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-3 rounded-lg border border-stadio-red/20 bg-stadio-red/5 px-3 py-2">
                        <p className="mb-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-stadio-red">
                          <Lightbulb size={12} /> Qué cambiar
                        </p>
                        <ul className="space-y-1">
                          {cc.recommendations.map((r) => (
                            <li key={r} className="flex gap-1.5 text-xs text-stadio-gray-dark dark:text-white/70">
                              <span className="text-stadio-red">•</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="RECOMENDACIONES"
            subtitle="Acciones sugeridas para tu semana"
            action={<TrendingUp size={18} className="text-stadio-gray" />}
          />
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-2">
              {recommendations.map((r) => (
                <div key={r} className="flex items-start gap-2.5 rounded-xl border border-gray-100 dark:border-white/10 p-3.5">
                  <Target size={18} className="shrink-0 text-stadio-red" />
                  <p className="text-sm text-stadio-gray-dark dark:text-white/70">{r}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
