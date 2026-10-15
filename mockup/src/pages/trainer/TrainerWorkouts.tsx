import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Dumbbell, CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Confirmation } from "../../components/Confirmation";
import { AssignRoutineModal } from "../../components/AssignRoutineModal";
import { getTrainerRoutines, deleteTrainerRoutine } from "../../features/routines/trainerRoutines";
import { clients } from "../../data/users";
import { CURRENT_TRAINER_ID, getAssignedTrainerId } from "../../features/trainer/personalTrainer";
import { useToast } from "../../hooks/useToast";
import type { Workout } from "../../types";

export function TrainerWorkouts() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [, setTick] = useState(0);
  const [assignFor, setAssignFor] = useState<Workout | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);

  const routines = getTrainerRoutines();
  const myClients = clients.filter((c) => getAssignedTrainerId(c.id) === CURRENT_TRAINER_ID);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteTrainerRoutine(deleteTarget.id);
    notify(`Rutina "${deleteTarget.name}" eliminada`, "info");
    setDeleteTarget(null);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Biblioteca de rutinas</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Crea rutinas y asígnalas a tus clientes</p>
        </div>
        <Button onClick={() => navigate("/trainer/workouts/new")}>
          <Plus size={18} /> NUEVA RUTINA
        </Button>
      </div>

      {routines.length === 0 ? (
        <Card>
          <CardBody className="py-10 text-center text-sm text-stadio-gray dark:text-white/50">
            Todavía no tienes rutinas. Crea la primera.
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {routines.map((w) => (
            <Card key={w.id}>
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{w.name}</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">Objetivo: {w.goal}</p>
                  </div>
                  <Badge variant="neutral">{w.frequency}</Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-stadio-gray-dark dark:text-white/60">
                  <span className="inline-flex items-center gap-1"><Dumbbell size={14} /> {w.exercises.length} ejercicios</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {w.exercises.slice(0, 4).map((e) => (
                    <Badge key={e.id} variant="neutral">{e.name}</Badge>
                  ))}
                  {w.exercises.length > 4 && <Badge variant="neutral">+{w.exercises.length - 4}</Badge>}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button size="sm" onClick={() => setAssignFor(w)}>
                    <CalendarPlus size={15} /> ASIGNAR
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/trainer/workouts/new?edit=${w.id}`)}>
                    <Pencil size={15} /> EDITAR
                  </Button>
                  <button
                    onClick={() => setDeleteTarget(w)}
                    className="ml-auto rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label={`Eliminar rutina ${w.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <AssignRoutineModal
        open={assignFor !== null}
        onClose={() => setAssignFor(null)}
        clients={myClients.map((c) => ({ id: c.id, name: c.name }))}
        routines={routines.map((r) => ({ id: r.id, name: r.name }))}
        presetRoutineId={assignFor?.id}
        onAssigned={() => notify("Rutina asignada")}
      />

      <Confirmation
        open={deleteTarget !== null}
        title="Eliminar rutina"
        message={`¿Seguro que quieres eliminar la rutina "${deleteTarget?.name}" de tu biblioteca?`}
        confirmLabel="ELIMINAR"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
