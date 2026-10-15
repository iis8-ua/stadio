import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Target, CalendarRange, Dumbbell, Plus, History, Trash2, Pencil, UserCheck } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Confirmation } from "../../components/Confirmation";
import { TrainingHistory } from "../../components/TrainingHistory";
import { getActiveRoutine, getClientRoutines, setActiveRoutine, deleteClientRoutine } from "../../features/routines/clientRoutines";
import { getClientAssignedRoutine, setSelectedRoutineId } from "../../features/routines/activeRoutine";
import { SetsTable } from "../../components/SetsTable";
import { currentClient } from "../../data/users";
import { fmtShortDate } from "../../data/classes";
import { useToast } from "../../hooks/useToast";
import type { Workout } from "../../types";

export function ClientTraining() {
  const assigned = getClientAssignedRoutine(currentClient.id);
  const routines = getClientRoutines();
  const [activeId, setActiveId] = useState(assigned ? assigned.routine.id : getActiveRoutine().id);
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null);
  const navigate = useNavigate();
  const { notify } = useToast();

  const isAssignedActive = Boolean(assigned && activeId === assigned.routine.id);
  const active =
    isAssignedActive && assigned ? assigned.routine : routines.find((w) => w.id === activeId) ?? routines[0];

  useEffect(() => {
    setSelectedRoutineId(active.id);
  }, [active.id]);

  const selectRoutine = (id: string) => {
    if (assigned && id === assigned.routine.id) {
      setActiveId(id);
      notify(`Rutina asignada: ${assigned.routine.name}`);
      return;
    }
    setActiveRoutine(id);
    setActiveId(id);
    const r = routines.find((w) => w.id === id);
    notify(`Rutina activa: ${r?.name}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteClientRoutine(deleteTarget.id);
    notify(`Rutina ${deleteTarget.name} eliminada`);
    setActiveId(assigned ? assigned.routine.id : getActiveRoutine().id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Mi rutina</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
            Tu planificación y también puedes crear tus propias rutinas
          </p>
        </div>
        <Link to="/client/training/new">
          <Button variant="secondary" size="sm">
            <Plus size={16} /> CREAR MI RUTINA
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {assigned && (
          <span
            className={`inline-flex items-center rounded-full py-1 transition-colors ${
              isAssignedActive
                ? "bg-stadio-red text-white"
                : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/15 text-stadio-gray-dark dark:text-white/60 hover:border-stadio-red/40"
            }`}
          >
            <button
              onClick={() => selectRoutine(assigned.routine.id)}
              className="inline-flex items-center gap-1.5 pl-4 pr-2 py-0.5 text-xs font-semibold text-left"
            >
              {assigned.routine.name}
              <UserCheck size={12} aria-label="Asignada por tu entrenador" />
            </button>
          </span>
        )}
        {routines.map((w) => (
          <span
            key={w.id}
            className={`inline-flex items-center rounded-full py-1 transition-colors ${
              w.id === activeId && !isAssignedActive
                ? "bg-stadio-red text-white"
                : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/15 text-stadio-gray-dark dark:text-white/60 hover:border-stadio-red/40"
            }`}
          >
            <button
              onClick={() => selectRoutine(w.id)}
              className="pl-4 pr-1 py-0.5 text-xs font-semibold text-left"
            >
              {w.name}
            </button>
            <button
              onClick={() => navigate(`/client/training/new?edit=${w.id}`)}
              className={`mr-1 rounded-full p-1.5 transition-colors ${
                w.id === activeId && !isAssignedActive
                  ? "text-white/70 hover:bg-white/20"
                  : "text-stadio-gray hover:text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/30"
              }`}
              aria-label={`Editar rutina ${w.name}`}
            >
              <Pencil size={12} />
            </button>
            {routines.length > 1 && (
              <button
                onClick={() => setDeleteTarget(w)}
                className={`mr-1 ml-1 rounded-full p-1.5 transition-colors ${
                  w.id === activeId && !isAssignedActive
                    ? "text-white/70 hover:bg-white/20"
                    : "text-stadio-gray hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-stadio-red"
                }`}
                aria-label={`Eliminar rutina ${w.name}`}
              >
                <Trash2 size={12} />
              </button>
            )}
          </span>
        ))}
      </div>

      <Card>
        <CardHeader
          title={active.name}
          subtitle={
            isAssignedActive && assigned
              ? `Asignada por tu entrenador · ${fmtShortDate(assigned.date)}`
              : "Entrenamiento activo"
          }
          action={
            isAssignedActive ? <Badge variant="info" dot>Asignada</Badge> : <Badge variant="success" dot>Activa</Badge>
          }
        />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
              <Target size={18} className="text-stadio-red" />
              <p className="mt-2 text-xs text-stadio-gray">Objetivo</p>
              <p className="text-sm font-bold text-stadio-black dark:text-white">{active.goal}</p>
            </div>
            <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
              <CalendarRange size={18} className="text-stadio-red" />
              <p className="mt-2 text-xs text-stadio-gray">Frecuencia</p>
              <p className="text-sm font-bold text-stadio-black dark:text-white">{active.frequency}</p>
            </div>
            <div className="rounded-xl bg-stadio-gray-light dark:bg-white/5 p-3">
              <Dumbbell size={18} className="text-stadio-red" />
              <p className="mt-2 text-xs text-stadio-gray">Ejercicios</p>
              <p className="text-sm font-bold text-stadio-black dark:text-white">{active.exercises.length}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stadio-black dark:text-white">Ejercicios</h3>
            <span className="text-xs text-stadio-gray">Peso · Reps · Descanso · RIR · RPE</span>
          </div>

          <div className="space-y-3">
            {active.exercises.map((ex, i) => (
              <div
                key={`${active.id}-${ex.id}-${i}`}
                className="rounded-xl border border-gray-100 dark:border-white/10 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-stadio-red/10 text-sm font-bold text-stadio-red">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{ex.name}</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">
                      {ex.muscle} · {ex.sets.length} series
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <SetsTable sets={ex.sets} />
                </div>
              </div>
            ))}
          </div>

          <Link to="/client/training/workout" className="block">
            <Button size="lg" className="w-full">
              <Play size={18} />
              EMPEZAR ENTRENAMIENTO
            </Button>
          </Link>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="ENTRENAMIENTOS FINALIZADOS"
          subtitle="Tu historial de sesiones al detalle, mes a mes"
          action={<History size={18} className="text-stadio-gray" />}
        />
        <CardBody>
          <TrainingHistory />
        </CardBody>
      </Card>

      <Confirmation
        open={deleteTarget !== null}
        title="Borrar rutina"
        message={`¿Seguro que quieres eliminar la rutina "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="BORRAR"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
