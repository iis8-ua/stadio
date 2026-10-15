import { useNavigate } from "react-router-dom";
import { Search, RotateCcw } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import { Input, Select } from "../../components/Input";
import { EmptyState } from "../../components/EmptyState";
import { clients } from "../../data/users";
import { CURRENT_TRAINER_ID, getAssignedTrainerId } from "../../features/trainer/personalTrainer";
import { useState } from "react";

export function TrainerClients() {
  const [query, setQuery] = useState("");
  const [goalFilter, setGoalFilter] = useState("Todos");
  const [sort, setSort] = useState("progress-desc");
  const navigate = useNavigate();

  const myClients = clients.filter((c) => getAssignedTrainerId(c.id) === CURRENT_TRAINER_ID);
  const goals = [...new Set(myClients.map((c) => c.goal))].sort();

  const filtered = myClients
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .filter((c) => goalFilter === "Todos" || c.goal === goalFilter)
    .sort((a, b) => (sort === "progress-asc" ? a.progress - b.progress : b.progress - a.progress));

  const resetFilters = () => {
    setQuery("");
    setGoalFilter("Todos");
    setSort("progress-desc");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Mis clientes</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">
            {myClients.length} clientes asignados
          </p>
        </div>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3 lg:flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar cliente..." aria-label="Buscar cliente" className="pl-10" />
            </div>
            <Select value={goalFilter} onChange={(e) => setGoalFilter(e.target.value)}>
              <option value="Todos">Todos los objetivos</option>
              {goals.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="progress-desc">Progreso: mayor a menor</option>
              <option value="progress-asc">Progreso: menor a mayor</option>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <p className="text-xs text-stadio-gray dark:text-white/40">
              {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stadio-gray-dark hover:text-stadio-red dark:text-white/50"
            >
              <RotateCcw size={13} /> Limpiar filtros
            </button>
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card><CardBody><EmptyState title="No se encontraron clientes" message="Prueba con otros filtros." /></CardBody></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/trainer/clients/${c.id}`)}
              className="text-left rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-4 shadow-sm hover:border-stadio-red/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar initials={c.initials} color={c.color} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{c.name}</p>
                  <p className="truncate text-xs text-stadio-gray dark:text-white/50">{c.goal}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-stadio-gray-dark dark:text-white/50">
                <p>Rutina: <span className="font-semibold">{c.routine}</span></p>
                <p>Último entrenamiento: {c.lastWorkout}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="info">Progreso {c.progress}%</Badge>
                <span className="text-xs font-semibold text-stadio-gray">{c.frequency}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
