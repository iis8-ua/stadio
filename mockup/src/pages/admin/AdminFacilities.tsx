import { useRef, useState } from "react";
import { Search, Plus, Pencil, Trash2, Wrench, CheckCheck, CheckCircle2, Hammer, AlertTriangle, Eye } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/Input";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Confirmation } from "../../components/Confirmation";
import { equipment, facilityRooms, incidents } from "../../data/employees";
import type { Equipment, EquipmentStatus, FacilityRoom, Incident } from "../../types";
import { useToast } from "../../hooks/useToast";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const TYPES = ["Cardio", "Máquina", "Banco", "Libre", "Musculación", "Estiramientos"];
const STATUSES: EquipmentStatus[] = ["Disponible", "Mantenimiento", "Fuera de servicio"];
const ROOM_STATUSES: FacilityRoom["status"][] = ["Disponible", "No disponible"];
const INCIDENT_TARGETS = [...facilityRooms.map((r) => r.name), ...equipment.map((e) => e.name)];

function toTextDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${Number(d)} ${MESES[Number(m) - 1]} ${y}`;
}

function toISO(text: string): string {
  if (!text) return "";
  const [d, m, y] = text.split(" ");
  const idx = MESES.indexOf(m);
  if (!d || idx === -1 || !y) return "";
  return `${y}-${String(idx + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function todayText(): string {
  const now = new Date();
  return `${now.getDate()} ${MESES[now.getMonth()]} ${now.getFullYear()}`;
}

export function AdminFacilities() {
  const { notify } = useToast();
  const seqRef = useRef(0);
  const [list, setList] = useState<Equipment[]>(equipment);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Cardio");
  const [newStatus, setNewStatus] = useState<EquipmentStatus>("Disponible");

  const [editTarget, setEditTarget] = useState<Equipment | null>(null);
  const [draft, setDraft] = useState<Equipment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [maintainTarget, setMaintainTarget] = useState<Equipment | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Equipment | null>(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState(INCIDENT_TARGETS[0]);
  const [viewIncident, setViewIncident] = useState<Incident | null>(null);
  const [deleteIncident, setDeleteIncident] = useState<Incident | null>(null);

  const [rooms, setRooms] = useState<FacilityRoom[]>(facilityRooms);
  const [roomCreateOpen, setRoomCreateOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState("20");
  const [newRoomStatus, setNewRoomStatus] = useState<FacilityRoom["status"]>("Disponible");
  const [editRoom, setEditRoom] = useState<FacilityRoom | null>(null);
  const [roomDraft, setRoomDraft] = useState<FacilityRoom | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<FacilityRoom | null>(null);

  const [incidentsList, setIncidentsList] = useState<Incident[]>(incidents);

  const reportIncident = () => {
    if (!title.trim()) {
      notify("Indica un nombre para la incidencia", "warning");
      return;
    }
    if (!desc.trim()) {
      notify("Describe la incidencia", "warning");
      return;
    }
    const inc: Incident = {
      id: `i-${++seqRef.current}`,
      title: title.trim(),
      description: desc.trim(),
      location,
      status: "Abierta",
      date: todayText(),
    };
    setIncidentsList((l) => [inc, ...l]);
    resetReport();
    notify("Incidencia registrada");
  };

  const resetReport = () => {
    setReportOpen(false);
    setTitle("");
    setDesc("");
    setLocation(INCIDENT_TARGETS[0]);
  };

  const setIncidentStatus = (inc: Incident, next: Incident["status"]) => {
    setIncidentsList((l) => l.map((x) => (x.id === inc.id ? { ...x, status: next } : x)));
    notify(next === "Resuelta" ? `${inc.title}: incidencia resuelta` : `${inc.title}: en proceso`);
  };

  const resetRoomCreate = () => {
    setNewRoomName("");
    setNewRoomCapacity("20");
    setNewRoomStatus("Disponible");
  };

  const createRoom = () => {
    if (!newRoomName.trim()) {
      notify("Indica el nombre de la sala", "warning");
      return;
    }
    const room: FacilityRoom = {
      id: `r-${++seqRef.current}`,
      name: newRoomName.trim(),
      capacity: Math.max(1, Number(newRoomCapacity) || 1),
      status: newRoomStatus,
    };
    setRooms((l) => [...l, room]);
    setRoomCreateOpen(false);
    resetRoomCreate();
    notify("Sala creada");
  };

  const statusBadge = (s: EquipmentStatus) => {
    if (s === "Disponible") return <Badge variant="success" dot>Disponible</Badge>;
    if (s === "Mantenimiento") return <Badge variant="warning" dot>Mantenimiento</Badge>;
    return <Badge variant="error" dot>Fuera de servicio</Badge>;
  };

  const filtered = list
    .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
    .filter((e) => typeFilter === "Todos" || e.type === typeFilter)
    .filter((e) => statusFilter === "Todos" || e.status === statusFilter)
    .sort((a, b) => a.name.localeCompare(b.name));

  const pendingMaintenance = list.filter((e) => e.status !== "Disponible");

  const resetCreate = () => {
    setNewName("");
    setNewType("Cardio");
    setNewStatus("Disponible");
  };

  const createEquipment = () => {
    if (!newName.trim()) {
      notify("Indica el nombre del equipo", "warning");
      return;
    }
    const eq: Equipment = {
      id: `eq-${++seqRef.current}`,
      name: newName.trim(),
      type: newType,
      location: "",
      status: newStatus,
      lastMaintenance: newStatus === "Disponible" ? todayText() : "Sin registrar",
    };
    setList((l) => [...l, eq]);
    setCreateOpen(false);
    resetCreate();
    notify("Equipo añadido");
  };

  const updateStatus = (eq: Equipment, next: EquipmentStatus, msg: string) => {
    setList((l) =>
      l.map((x) =>
        x.id === eq.id
          ? { ...x, status: next, lastMaintenance: next === "Disponible" ? todayText() : x.lastMaintenance }
          : x
      )
    );
    notify(msg);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Instalaciones</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Máquinas, salas y mantenimiento</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReportOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-stadio-amber/60 bg-stadio-amber/10 px-4 text-sm font-semibold text-stadio-amber transition-colors hover:bg-stadio-amber/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stadio-amber/40"
          >
            <AlertTriangle size={16} /> Reportar incidencia
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-black dark:text-white">{list.length}</p><p className="text-xs text-stadio-gray">máquinas</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-green">{list.filter((e) => e.status === "Disponible").length}</p><p className="text-xs text-stadio-green">disponibles</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-amber">{list.filter((e) => e.status === "Mantenimiento").length}</p><p className="text-xs text-stadio-amber">en mantenimiento</p></CardBody></Card>
        <Card><CardBody className="p-4"><p className="text-2xl font-extrabold text-stadio-red">{list.filter((e) => e.status === "Fuera de servicio").length}</p><p className="text-xs text-stadio-gray">fuera de servicio</p></CardBody></Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader
            title="Salas"
            action={
              <Button size="sm" onClick={() => setRoomCreateOpen(true)}><Plus size={14} /> Añadir sala</Button>
            }
          />
          <CardBody className="space-y-2">
            {rooms.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <div>
                  <p className="text-sm font-bold text-stadio-black dark:text-white">{r.name}</p>
                  <p className="text-xs text-stadio-gray">Capacidad: {r.capacity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={r.status === "Disponible" ? "success" : "warning"} dot>{r.status}</Badge>
                  <button
                    onClick={() => { setEditRoom(r); setRoomDraft(r); }}
                    className="rounded-lg p-1.5 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    aria-label="Editar sala"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteRoom(r)}
                    className="rounded-lg p-1.5 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label="Eliminar sala"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Mantenimiento" subtitle={`${pendingMaintenance.length} equipos requieren atención`} />
          <CardBody className="space-y-2">
            {pendingMaintenance.length === 0 && (
              <p className="rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 p-6 text-center text-sm text-stadio-gray dark:text-white/50">
                Todos los equipos están operativos.
              </p>
            )}
            {pendingMaintenance.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-stadio-black dark:text-white">{e.name}</p>
                  <p className="text-xs text-stadio-gray">{e.type} · Último: {e.lastMaintenance}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setReviewTarget(e)}
                >
                  <CheckCheck size={14} /> Revisado
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Incidencias" />
          <CardBody className="space-y-2">
            {incidentsList.map((inc) => (
              <div key={inc.id} className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{inc.title}</p>
                    <p className="text-xs text-stadio-gray">{inc.location} · {inc.date}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-stadio-gray-dark dark:text-white/60">{inc.description}</p>
                  </div>
                  <Badge variant={inc.status === "Resuelta" ? "success" : inc.status === "En proceso" ? "warning" : "error"} dot>
                    {inc.status}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button size="sm" variant="secondary" onClick={() => setViewIncident(inc)}>
                    <Eye size={13} /> Ver
                  </Button>
                  <Button size="sm" variant="secondary" disabled={inc.status === "En proceso"} onClick={() => setIncidentStatus(inc, "En proceso")}>
                    <Hammer size={13} /> En proceso
                  </Button>
                  <Button size="sm" variant="secondary" disabled={inc.status === "Resuelta"} onClick={() => setIncidentStatus(inc, "Resuelta")}>
                    <CheckCircle2 size={13} /> Resuelta
                  </Button>
                  <button
                    onClick={() => setDeleteIncident(inc)}
                    className="ml-auto rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label="Eliminar incidencia"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Equipamiento" action={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus size={14} /> Nuevo equipo</Button>} />
        <CardBody className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." aria-label="Buscar equipos" className="pl-9" />
            </div>
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option>Todos</option>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>Todos</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </div>
        </CardBody>

        <DataTable<Equipment>
          columns={[
            { key: "name", header: "Máquina", render: (e) => <p className="font-bold text-stadio-black dark:text-white">{e.name}</p> },
            { key: "type", header: "Tipo", render: (e) => e.type },
            { key: "status", header: "Estado", render: (e) => statusBadge(e.status) },
            { key: "last", header: "Último mantenimiento", render: (e) => e.lastMaintenance },
            {
              key: "actions",
              header: "Acciones",
              render: (e) => (
                <div className="flex items-center gap-1">
                  {e.status === "Disponible" ? (
                    <button
                      onClick={() => setMaintainTarget(e)}
                      className="rounded-lg p-2 text-stadio-amber hover:bg-amber-50 dark:hover:bg-amber-950/40"
                      aria-label="Enviar a mantenimiento"
                      title="Enviar a mantenimiento"
                    >
                      <Wrench size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setReviewTarget(e)}
                      className="rounded-lg p-2 text-stadio-green hover:bg-green-50 dark:hover:bg-green-950/40"
                      aria-label="Marcar como revisado"
                      title="Marcar como revisado"
                    >
                      <CheckCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => { setEditTarget(e); setDraft({ ...e, lastMaintenance: toISO(e.lastMaintenance) }); }}
                    className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(e)}
                    className="rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ),
            },
          ]}
          rows={filtered}
          emptyText="No hay equipos con esos filtros."
        />
      </Card>

      <Modal open={createOpen} onClose={() => { setCreateOpen(false); resetCreate(); }} title="Nuevo equipo">
        <div className="space-y-3">
          <Field label="Máquina">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. Cinta de correr #5" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <Select value={newType} onChange={(e) => setNewType(e.target.value)}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Estado">
              <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value as EquipmentStatus)}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
          <Button className="w-full" onClick={createEquipment}>AÑADIR EQUIPO</Button>
        </div>
      </Modal>

      <Modal open={!!editTarget} onClose={() => { setEditTarget(null); setDraft(null); }} title="Editar equipo">
        {draft && (
          <div className="space-y-3">
            <Field label="Máquina">
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <Select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Estado">
                <Select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as EquipmentStatus })}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Último mantenimiento">
              <Input type="date" value={draft.lastMaintenance} onChange={(e) => setDraft({ ...draft, lastMaintenance: e.target.value })} />
            </Field>
            <Button
              className="w-full"
              onClick={() => {
                if (!draft.name.trim()) {
                  notify("El nombre es obligatorio", "warning");
                  return;
                }
                setList((l) =>
                  l.map((x) =>
                    x.id === draft.id
                      ? { ...draft, lastMaintenance: draft.lastMaintenance ? toTextDate(draft.lastMaintenance) : "Sin registrar" }
                      : x
                  )
                );
                notify("Equipo actualizado");
                setEditTarget(null);
                setDraft(null);
              }}
            >
              GUARDAR CAMBIOS
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={reportOpen} onClose={resetReport} title="Nueva incidencia">
        <div className="space-y-3">
          <Field label="Nombre">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Cinta #2 hace ruido" />
          </Field>
          <Field label="Descripción">
            <Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe el problema detectado…" />
          </Field>
          <Field label="Material / Sala afectado">
            <Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <optgroup label="Salas">
                {facilityRooms.map((r) => <option key={r.id}>{r.name}</option>)}
              </optgroup>
              <optgroup label="Equipos">
                {equipment.map((e) => <option key={e.id}>{e.name}</option>)}
              </optgroup>
            </Select>
          </Field>
          <Button className="w-full" onClick={reportIncident}>REGISTRAR INCIDENCIA</Button>
        </div>
      </Modal>

      <Modal open={roomCreateOpen} onClose={() => { setRoomCreateOpen(false); resetRoomCreate(); }} title="Nueva sala">
        <div className="space-y-3">
          <Field label="Nombre">
            <Input value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="Ej. Sala D" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacidad">
              <Input type="number" value={newRoomCapacity} onChange={(e) => setNewRoomCapacity(e.target.value)} />
            </Field>
            <Field label="Estado">
              <Select value={newRoomStatus} onChange={(e) => setNewRoomStatus(e.target.value as FacilityRoom["status"])}>
                {ROOM_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
          <Button className="w-full" onClick={createRoom}>CREAR SALA</Button>
        </div>
      </Modal>

      <Modal open={!!editRoom} onClose={() => { setEditRoom(null); setRoomDraft(null); }} title="Editar sala">
        {roomDraft && (
          <div className="space-y-3">
            <Field label="Nombre">
              <Input value={roomDraft.name} onChange={(e) => setRoomDraft({ ...roomDraft, name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Capacidad">
                <Input type="number" value={String(roomDraft.capacity)} onChange={(e) => setRoomDraft({ ...roomDraft, capacity: Math.max(1, Number(e.target.value) || 1) })} />
              </Field>
              <Field label="Estado">
                <Select value={roomDraft.status} onChange={(e) => setRoomDraft({ ...roomDraft, status: e.target.value as FacilityRoom["status"] })}>
                  {ROOM_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!roomDraft.name.trim()) {
                  notify("El nombre es obligatorio", "warning");
                  return;
                }
                setRooms((l) => l.map((x) => (x.id === roomDraft.id ? roomDraft : x)));
                notify("Sala actualizada");
                setEditRoom(null);
                setRoomDraft(null);
              }}
            >
              GUARDAR CAMBIOS
            </Button>
          </div>
        )}
      </Modal>

      <Confirmation
        open={!!deleteRoom}
        title="Eliminar sala"
        message={`¿Eliminar la sala "${deleteRoom?.name}"?`}
        confirmLabel="Eliminar"
        onConfirm={() => { if (deleteRoom) setRooms((l) => l.filter((r) => r.id !== deleteRoom.id)); setDeleteRoom(null); notify("Sala eliminada", "info"); }}
        onCancel={() => setDeleteRoom(null)}
        danger
      />

      <Modal open={!!viewIncident} onClose={() => setViewIncident(null)} title={viewIncident?.title ?? ""}>
        {viewIncident && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-stadio-gray">
              <span>{viewIncident.location}</span>
              <span>·</span>
              <span>{viewIncident.date}</span>
              <span>·</span>
              <Badge variant={viewIncident.status === "Resuelta" ? "success" : viewIncident.status === "En proceso" ? "warning" : "error"} dot>{viewIncident.status}</Badge>
            </div>
            <div className="rounded-xl bg-stadio-gray-light/50 dark:bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-stadio-gray mb-1.5">Descripción</p>
              <p className="text-sm text-stadio-gray-dark dark:text-white/80">{viewIncident.description}</p>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setViewIncident(null)}>CERRAR</Button>
          </div>
        )}
      </Modal>

      <Confirmation
        open={!!deleteIncident}
        title="Eliminar incidencia"
        message={`¿Eliminar la incidencia "${deleteIncident?.title}"?`}
        confirmLabel="Eliminar"
        onConfirm={() => { if (deleteIncident) setIncidentsList((l) => l.filter((x) => x.id !== deleteIncident.id)); setDeleteIncident(null); notify("Incidencia eliminada", "info"); }}
        onCancel={() => setDeleteIncident(null)}
        danger
      />

      <Confirmation
        open={!!maintainTarget}
        title="Enviar a mantenimiento"
        message={`¿Marcar "${maintainTarget?.name}" como en mantenimiento?`}
        confirmLabel="Sí, enviar"
        onConfirm={() => { if (maintainTarget) updateStatus(maintainTarget, "Mantenimiento", `${maintainTarget.name} enviado a mantenimiento`); setMaintainTarget(null); }}
        onCancel={() => setMaintainTarget(null)}
        danger
      />

      <Confirmation
        open={!!reviewTarget}
        title="Marcar como revisado"
        message={`¿El equipo "${reviewTarget?.name}" queda operativo? Se actualizará la fecha de mantenimiento.`}
        confirmLabel="Sí, revisado"
        onConfirm={() => { if (reviewTarget) updateStatus(reviewTarget, "Disponible", `${reviewTarget.name} marcado como revisado`); setReviewTarget(null); }}
        onCancel={() => setReviewTarget(null)}
      />

      <Confirmation
        open={!!deleteTarget}
        title="Eliminar equipo"
        message={`¿Eliminar "${deleteTarget?.name}" del inventario?`}
        confirmLabel="Eliminar"
        onConfirm={() => { if (deleteTarget) setList((l) => l.filter((e) => e.id !== deleteTarget.id)); setDeleteTarget(null); notify("Equipo eliminado", "info"); }}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  );
}