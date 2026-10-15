import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Ban, UserCheck, Eye, RotateCcw, Download } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import { Input, Select, Field } from "../../components/Input";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Confirmation } from "../../components/Confirmation";
import { clients } from "../../data/users";
import { findEmployeeById } from "../../data/employees";
import { getPersonalTrainerInfo } from "../../features/trainer/personalTrainer";
import { useToast } from "../../hooks/useToast";
import { downloadFile, toCsv, downloadJson } from "../../utils/download";
import type { Client } from "../../types";

const SEXES: Client["sex"][] = ["Hombre", "Mujer"];

function toISO(dmy: string): string {
  if (!dmy) return "";
  const [d, m, y] = dmy.split("/");
  if (!d || !m || !y) return "";
  return `${y}-${m}-${d}`;
}

function toDMY(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function fmtJoined(date: Date): string {
  return `${date.getDate()} ${MESES[date.getMonth()]} ${date.getFullYear()}`;
}

export function AdminClients() {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [feeFilter, setFeeFilter] = useState("Todos");
  const [trainerFilter, setTrainerFilter] = useState("Todos");
  const [list, setList] = useState<Client[]>(clients);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [draft, setDraft] = useState<Client | null>(null);
  const [deactivateClient, setDeactivateClient] = useState<Client | null>(null);
  const [reactivateClient, setReactivateClient] = useState<Client | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSex, setNewSex] = useState<Client["sex"]>("Hombre");
  const [newBirth, setNewBirth] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newPostal, setNewPostal] = useState("");
  const [newFee, setNewFee] = useState<Client["fee"]>("Pendiente");
  const [newNfc, setNewNfc] = useState("");
  const [sort, setSort] = useState("name");

  const setDraftField = <K extends keyof Client>(key: K, value: Client[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const filtered = list
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .filter((c) => statusFilter === "Todos" || c.status === statusFilter)
    .filter((c) => feeFilter === "Todos" || c.fee === feeFilter)
    .filter((c) => {
      const info = getPersonalTrainerInfo(c.id);
      if (trainerFilter === "Con entrenador personal") return Boolean(info.trainerId);
      if (trainerFilter === "Solicitado") return info.requested && !info.trainerId;
      if (trainerFilter === "Sin entrenador personal") return !info.requested;
      return true;
    })
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return a.joined.localeCompare(b.joined);
    });

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("Todos");
    setFeeFilter("Todos");
    setTrainerFilter("Todos");
    setSort("name");
  };

  // RF-50: evita asociar la misma pulsera NFC a dos clientes.
  const nfcTaken = (nfc: string, exceptId?: string) => {
    const value = nfc.trim().toUpperCase();
    if (!value) return false;
    return list.some((c) => c.id !== exceptId && (c.nfcId ?? "").trim().toUpperCase() === value);
  };

  const trainerNameOf = (c: Client) => {
    const info = getPersonalTrainerInfo(c.id);
    return info.trainerId ? findEmployeeById(info.trainerId)?.name ?? "" : "";
  };

  const exportCsv = () => {
    const rows: (string | number)[][] = [
      ["Nombre", "Email", "Teléfono", "Estado", "Cuota", "Entrenador personal", "Último acceso", "Alta", "Pulsera NFC"],
      ...filtered.map((c) => [
        c.name, c.email, c.phone, c.status === "active" ? "Activo" : "Inactivo",
        c.fee, trainerNameOf(c), c.lastAccess, c.joined, c.nfcId ?? "",
      ]),
    ];
    downloadFile("clientes-stadio.csv", toCsv(rows), "text/csv;charset=utf-8");
    notify("Clientes exportados (CSV)");
  };

  const exportJson = () => {
    downloadJson(
      "clientes-stadio.json",
      filtered.map((c) => ({
        nombre: c.name, email: c.email, telefono: c.phone,
        estado: c.status === "active" ? "Activo" : "Inactivo", cuota: c.fee,
        entrenadorPersonal: trainerNameOf(c) || null, ultimoAcceso: c.lastAccess, alta: c.joined, nfc: c.nfcId ?? null,
      }))
    );
    notify("Clientes exportados (JSON)");
  };

  const confirmDeactivate = () => {
    if (deactivateClient) {
      setList((l) => l.map((x) => (x.id === deactivateClient.id ? { ...x, status: "inactive" } : x)));
      notify(`${deactivateClient.name} desactivado`);
      setDeactivateClient(null);
    }
  };

  const confirmReactivate = () => {
    if (reactivateClient) {
      setList((l) => l.map((x) => (x.id === reactivateClient.id ? { ...x, status: "active" } : x)));
      notify(`${reactivateClient.name} reactivado`);
      setReactivateClient(null);
    }
  };

  const resetCreate = () => {
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewSex("Hombre");
    setNewBirth("");
    setNewAddress("");
    setNewCity("");
    setNewPostal("");
    setNewFee("Pendiente");
    setNewNfc("");
  };

  const createClient = () => {
    if (!newName.trim() || !newEmail.trim()) {
      notify("Completa nombre y email", "warning");
      return;
    }
    if (newNfc.trim() && nfcTaken(newNfc)) {
      notify("Esa pulsera NFC ya está asignada a otro cliente", "error");
      return;
    }
    const initials = newName.trim().split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() || "?";
    const client: Client = {
      id: `c-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      initials,
      color: "#111111",
      goal: "Salud general",
      routine: "—",
      frequency: "2 días/semana",
      sex: newSex,
      birthDate: newBirth ? toDMY(newBirth) : "",
      address: newAddress.trim(),
      city: newCity.trim(),
      postalCode: newPostal.trim(),
      weight: 0,
      targetWeight: 0,
      lastWorkout: "Nunca",
      progress: 0,
      status: "active",
      fee: newFee,
      lastAccess: "—",
      joined: fmtJoined(new Date()),
      nfcId: newNfc.trim() || undefined,
    };
    setList((l) => [...l, client]);
    setCreateOpen(false);
    resetCreate();
    notify("Cliente creado");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Clientes</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">{list.length} registros de ejemplo</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={exportCsv}><Download size={16} /> CSV</Button>
          <Button variant="secondary" onClick={exportJson}><Download size={16} /> JSON</Button>
          <Button onClick={() => setCreateOpen(true)}><Plus size={18} /> NUEVO CLIENTE</Button>
        </div>
      </div>

      <Card>
        <CardBody className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." aria-label="Buscar clientes" className="pl-9" />
            </div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </Select>
            <Select value={feeFilter} onChange={(e) => setFeeFilter(e.target.value)}>
              <option>Todos</option>
              <option>Pagada</option>
              <option>Pendiente</option>
            </Select>
            <Select value={trainerFilter} onChange={(e) => setTrainerFilter(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Con entrenador personal">Con entrenador personal</option>
              <option value="Solicitado">Solicitado</option>
              <option value="Sin entrenador personal">Sin entrenador personal</option>
            </Select>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="name">Ordenar por nombre</option>
              <option value="joined">Ordenar por alta</option>
            </Select>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-white/10">
            <p className="text-xs text-stadio-gray dark:text-white/40">
              {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}
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

        <DataTable<Client>
          columns={[
            {
              key: "name",
              header: "Nombre",
              render: (c) => (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/clients/${c.id}`)}
                  className="flex items-center gap-3 text-left"
                >
                  <Avatar initials={c.initials} color={c.color} size="sm" />
                  <div>
                    <p className="font-bold text-stadio-black hover:text-stadio-red dark:text-white">{c.name}</p>
                    <p className="text-xs text-stadio-gray">{c.email}</p>
                  </div>
                </button>
              ),
            },
            {
              key: "status",
              header: "Estado",
              render: (c) => (
                <Badge variant={c.status === "active" ? "success" : "neutral"} dot>
                  {c.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              ),
            },
            {
              key: "trainer",
              header: "Entrenador personal",
              render: (c) => {
                const info = getPersonalTrainerInfo(c.id);
                const trainer = info.trainerId ? findEmployeeById(info.trainerId) : undefined;
                if (trainer) return <Badge variant="info">{trainer.name}</Badge>;
                if (info.requested) return <Badge variant="warning" dot>Solicitado</Badge>;
                return <span className="text-xs text-stadio-gray">—</span>;
              },
            },
            {
              key: "fee",
              header: "Cuota",
              render: (c) => <Badge variant={c.fee === "Pagada" ? "success" : "warning"}>{c.fee}</Badge>,
            },
            { key: "lastAccess", header: "Último acceso", render: (c) => c.lastAccess },
            {
              key: "actions",
              header: "Acciones",
              render: (c) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/admin/clients/${c.id}`)}
                    className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    aria-label="Ver cliente"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => { setEditClient(c); setDraft({ ...c, birthDate: toISO(c.birthDate) }); }}
                    className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  {c.status === "inactive" ? (
                    <button
                      onClick={() => setReactivateClient(c)}
                      className="rounded-lg p-2 text-stadio-green hover:bg-green-50 dark:hover:bg-green-950/40"
                      aria-label="Reactivar"
                      title="Reactivar"
                    >
                      <UserCheck size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeactivateClient(c)}
                      className="rounded-lg p-2 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                      aria-label="Desactivar"
                    >
                      <Ban size={16} />
                    </button>
                  )}
                </div>
              ),
            },
          ]}
          rows={filtered}
          emptyText="No hay clientes con esos filtros."
        />
      </Card>

      <Modal open={!!editClient} onClose={() => { setEditClient(null); setDraft(null); }} title="Editar cliente">
        {draft && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Field label="Nombre">
                  <Input value={draft.name} onChange={(e) => setDraftField("name", e.target.value)} />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Email">
                  <Input type="email" value={draft.email} onChange={(e) => setDraftField("email", e.target.value)} />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Teléfono">
                  <Input value={draft.phone} onChange={(e) => setDraftField("phone", e.target.value)} />
                </Field>
              </div>
              <Field label="Sexo">
                <Select value={draft.sex} onChange={(e) => setDraftField("sex", e.target.value as Client["sex"])}>
                  {SEXES.map((s) => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Fecha de nacimiento">
                <Input type="date" value={draft.birthDate} onChange={(e) => setDraftField("birthDate", e.target.value)} />
              </Field>
            </div>
            <Field label="Dirección">
              <Input value={draft.address} onChange={(e) => setDraftField("address", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Localidad">
                <Input value={draft.city} onChange={(e) => setDraftField("city", e.target.value)} />
              </Field>
              <Field label="Código postal">
                <Input value={draft.postalCode} onChange={(e) => setDraftField("postalCode", e.target.value)} />
              </Field>
            </div>
            <Field label="Cuota">
              <Select value={draft.fee} onChange={(e) => setDraftField("fee", e.target.value as Client["fee"])}>
                <option>Pagada</option>
                <option>Pendiente</option>
              </Select>
            </Field>
            <Field label="Pulsera NFC">
              <Input value={draft.nfcId ?? ""} onChange={(e) => setDraftField("nfcId", e.target.value)} placeholder="Ej. NFC-0001" />
            </Field>
            <Button
              className="w-full"
              onClick={() => {
                if (!draft.name.trim()) {
                  notify("El nombre es obligatorio", "warning");
                  return;
                }
                if (draft.nfcId && nfcTaken(draft.nfcId, draft.id)) {
                  notify("Esa pulsera NFC ya está asignada a otro cliente", "error");
                  return;
                }
                setList((l) => l.map((x) => (x.id === draft.id ? { ...draft, birthDate: toDMY(draft.birthDate) } : x)));
                notify("Cliente actualizado");
                setEditClient(null);
                setDraft(null);
              }}
            >
              GUARDAR CAMBIOS
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={createOpen} onClose={() => { setCreateOpen(false); resetCreate(); }} title="Nuevo cliente">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Nombre">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre completo" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Email">
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@stadio.com" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Teléfono">
                <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+34..." />
              </Field>
            </div>
            <Field label="Sexo">
              <Select value={newSex} onChange={(e) => setNewSex(e.target.value as Client["sex"])}>
                {SEXES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Fecha de nacimiento">
              <Input type="date" value={newBirth} onChange={(e) => setNewBirth(e.target.value)} />
            </Field>
          </div>
          <Field label="Dirección">
            <Input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Calle, número, piso" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Localidad">
              <Input value={newCity} onChange={(e) => setNewCity(e.target.value)} />
            </Field>
            <Field label="Código postal">
              <Input value={newPostal} onChange={(e) => setNewPostal(e.target.value)} />
            </Field>
          </div>
          <Field label="Cuota">
            <Select value={newFee} onChange={(e) => setNewFee(e.target.value as Client["fee"])}>
              <option>Pagada</option>
              <option>Pendiente</option>
            </Select>
          </Field>
          <Field label="Pulsera NFC">
            <Input value={newNfc} onChange={(e) => setNewNfc(e.target.value)} placeholder="Ej. NFC-0001" />
          </Field>
          <Button className="w-full" onClick={createClient}>CREAR CLIENTE</Button>
        </div>
      </Modal>

      <Confirmation
        open={!!deactivateClient}
        title="Desactivar cliente"
        message={`¿Seguro que quieres desactivar a ${deactivateClient?.name}? Podrás reactivarlo más adelante.`}
        confirmLabel="Sí, desactivar"
        onConfirm={confirmDeactivate}
        onCancel={() => setDeactivateClient(null)}
        danger
      />

      <Confirmation
        open={!!reactivateClient}
        title="Reactivar cliente"
        message={`¿Seguro que quieres reactivar a ${reactivateClient?.name}?`}
        confirmLabel="Sí, reactivar"
        onConfirm={confirmReactivate}
        onCancel={() => setReactivateClient(null)}
      />
    </div>
  );
}