import { useParams } from "react-router-dom";
import { Timer, Flame, Dumbbell, CheckCircle2 } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { BackButton } from "../../components/BackButton";
import { ErrorState } from "../../components/EmptyState";
import { getTrainingById } from "../../features/training/trainingHistory";
import { SetsTable } from "../../components/SetsTable";
import type { ExerciseSet } from "../../types";

function Stat({ icon: Icon, label, value }: { icon: typeof Timer; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <Icon size={18} className="text-stadio-red" />
      <p className="mt-2 text-xs text-stadio-gray">{label}</p>
      <p className="text-sm font-extrabold text-stadio-black dark:text-white">{value}</p>
    </div>
  );
}

export function ClientTrainingSessionDetail() {
  const { id } = useParams();
  const session = id ? getTrainingById(id) : undefined;

  if (!session) return <ErrorState title="Sesión no encontrada" />;

  const dateLabel = (() => {
    const d = new Date(`${session.date}T12:00:00`);
    const s = d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  const formatNumber = (n: number) => n.toLocaleString("es-ES");
  const totalSets = session.exercises.reduce((a, e) => a + e.sets, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <BackButton />

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-stadio-red to-red-800 p-5">
          <Badge variant="neutral">{session.goal}</Badge>
          <h1 className="mt-3 text-2xl font-extrabold text-white">{session.routine}</h1>
          <p className="mt-1 text-sm text-white/70">{dateLabel} · {session.time}</p>
        </div>

        <CardBody className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Timer} label="Duración" value={`${session.duration} min`} />
            <Stat icon={Dumbbell} label="Volumen" value={`${formatNumber(session.volume)} kg`} />
            <Stat icon={Flame} label="Calorías" value={`${formatNumber(session.calories)} kcal`} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-stadio-black dark:text-white">Ejercicios</h3>
              <span className="text-xs text-stadio-gray dark:text-white/40">
                {session.exercises.length} ejercicios · {totalSets} series
              </span>
            </div>
            <div className="space-y-3">
              {session.exercises.map((ex, i) => {
                const sets: ExerciseSet[] = Array.from({ length: ex.sets }, (_, j) => ({
                  id: `${session.id}-${i}-${j}`,
                  weight: ex.weight > 0 ? String(ex.weight) : "",
                  reps: ex.reps,
                  rest: "",
                  rir: "",
                  rpe: "",
                }));
                return (
                  <div
                    key={`${session.id}-${ex.name}-${i}`}
                    className="rounded-xl border border-gray-100 p-4 dark:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
                        <CheckCircle2 size={16} />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-stadio-black dark:text-white">{ex.name}</p>
                        <p className="text-xs text-stadio-gray dark:text-white/50">
                          {ex.sets} series{ex.weight > 0 ? ` · @ ${formatNumber(ex.weight)} kg` : " · peso corporal"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <SetsTable sets={sets} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
