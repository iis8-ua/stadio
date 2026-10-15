import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Search, Plus, Check, Ban, RotateCcw, CalendarDays, Ticket, Eye } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Input, Select, Field } from "../../components/Input";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Confirmation } from "../../components/Confirmation";
import { Pagination } from "../../components/Pagination";
import { ClassDetailModal } from "../../components/ClassDetailModal";
import { useAdminBookings, addAdminBooking, updateBookingStatus } from "../../data/adminBookings";
import type { AdminBooking, AdminBookingStatus } from "../../data/adminBookings";
import { resolveGymClasses, classTypes, classSessions, fmtDayShort } from "../../data/classes";
import { clients } from "../../data/users";
import { findEmployeeByName } from "../../data/employees";
import { useToast } from "../../hooks/useToast";
import type { GymClass } from "../../types";

const PAGE_SIZE = 8;
const STATUSES: AdminBookingStatus[] = ["Confirmada", "Pendiente", "Finalizada", "Cancelada"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
type Mode = "Todos" | "Día" | "Mes" | "Año";
const MODES: Mode[] = ["Todos", "Día", "Mes", "Año"];

const statusVariant = (s: AdminBookingStatus) =>
  s === "Confirmada" ? "success" : s === "Pendiente" ? "warning" : s === "Finalizada" ? "info" : "error";

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
  color: "#111",
};

const actionBtn =
  "rounded-lg p-2 text-stadio-gray-dark transition-colors hover:bg-stadio-gray-light dark:text-white/60 dark:hover:bg-white/10";

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export function AdminBookings() {
  const { notify } = useToast();
  const navigate = useNavigate();

  const bookings = useAdminBookings();
  const gymClasses = useMemo(() => resolveGymClasses(classTypes, classSessions), []);
  const classById = useMemo(() => new Map(gymClasses.map((c) => [c.id, c])), [gymClasses]);
  const activeClients = useMemo(() => clients.filter((c) => c.status === "active"), []);
  const classOptions = useMemo(() => [...new Set(gymClasses.map((c) => c.name))].sort(), [gymClasses]);

  const now = useMemo(() => new Date(), []);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todas");
  const [classFilter, setClassFilter] = useState("Todas");
  const [mode, setMode] = useState<Mode>("Mes");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [day, setDay] = useState(now.getDate());
  const [page, setPage] = useState(1);

  const [detailClass, setDetailClass] = useState<GymClass | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AdminBooking | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newClient, setNewClient] = useState("");
  const [newClass, setNewClass] = useState("");

  const years = useMemo(() => {
    const set = [...new Set(bookings.map((b) => Number(b.date.slice(0, 4))))];
    return (set.length > 0 ? set : [now.getFullYear()]).sort((a, b) => b - a);
  }, [bookings, now]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (q && !b.clientName.toLowerCase().includes(q) && !b.className.toLowerCase().includes(q)) return false;
      if (status !== "Todas" && b.status !== status) return false;
      if (classFilter !== "Todas" && b.className !== classFilter) return false;
      if (mode !== "Todos") {
        const [y, m, d] = b.date.split("-").map(Number);
        if (y !== year) return false;
        if (mode === "Mes" || mode === "Día") {
          if (m - 1 !== month) return false;
        }
        if (mode === "Día" && d !== day) return false;
      }
      return true;
    });
  }, [bookings, query, status, classFilter, mode, year, month, day]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const kpis = useMemo(
    () => ({
      total: filtered.length,
      confirmadas: filtered.filter((b) => b.status === "Confirmada").length,
      pendientes: filtered.filter((b) => b.status === "Pendiente").length,
      canceladas: filtered.filter((b) => b.status === "Cancelada").length,
    }),
    [filtered],
  );

  const occupancy = useMemo(() => {
    const ids = [...new Set(filtered.map((b) => b.classId))];
    return ids
      .map((id) => classById.get(id))
      .filter((c): c is GymClass => Boolean(c) && c!.capacity > 0)
      .map((c) => {
        const [, mm, dd] = c.date.split("-");
        return { gymClass: c, name: `${c.name} ${dd}/${mm}`, pct: Math.round((c.booked / c.capacity) * 100) };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);
  }, [filtered, classById]);

  const upcomingClasses = useMemo(() => {
    const key = (() => {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    })();
    const list = gymClasses
      .filter((c) => c.date >= key)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    return (list.length > 0 ? list : gymClasses).slice(0, 60);
  }, [gymClasses, now]);

  const changeMonth = (m: number) => {
    setMonth(m);
    setDay((d) => Math.min(d, daysInMonth(year, m)));
    setPage(1);
  };
  const changeYear = (y: number) => {
    setYear(y);
    setDay((d) => Math.min(d, daysInMonth(y, month)));
    setPage(1);
  };

  const resetFilters = () => {
    setQuery("");
    setStatus("Todas");
    setClassFilter("Todas");
    setMode("Mes");
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setDay(now.getDate());
    setPage(1);
  };

  const confirmBooking = (b: AdminBooking) => {
    updateBookingStatus(b.id, "Confirmada");
    notify(`Reserva de ${b.clientName} confirmada`);
  };

  const doCancel = () => {
    if (!cancelTarget) return;
    updateBookingStatus(cancelTarget.id, "Cancelada");
    notify(`Reserva de ${cancelTarget.clientName} cancelada`, "info");
    setCancelTarget(null);
  };

  const createBooking = () => {
    const client = activeClients.find((c) => c.id === newClient);
    const gymClass = classById.get(newClass);
    if (!client || !gymClass) {
      notify("Selecciona un cliente y una clase", "warning");
      return;
    }
    addAdminBooking({
      id: `manual-${client.id}-${gymClass.id}-${bookings.length}`,
      clientId: client.id,
      clientName: client.name,
      classId: gymClass.id,
      className: gymClass.name,
      trainer: gymClass.trainer,
      room: gymClass.room,
      date: gymClass.date,
      time: gymClass.time,
      status: "Confirmada",
    });
    notify(`Reserva creada para ${client.name}`);
    setCreateOpen(false);
    setNewClient("");
    setNewClass("");
  };

  const maxDay = daysInMonth(year, month);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Reservas</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Gestión de reservas de clases y ocupación</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={18} /> NUEVA RESERVA
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardBody className="p-4"><div className="flex items-center gap-2 text-stadio-gray"><Ticket size={16} /><p className="text-xs font-bold uppercase tracking-wider">Reservas</p></div><p className="mt-2 text-2xl font-extrabold text-stadio-black dark:text-white">{kpis.total}</p></CardBody></Card>
        <Card><CardBody className="p-4"><div className="flex items-center gap-2 text-stadio-green"><Check size={16} /><p className="text-xs font-bold uppercase tracking-wider">Confirmadas</p></div><p className="mt-2 text-2xl font-extrabold text-stadio-black dark:text-white">{kpis.confirmadas}</p></CardBody></Card>
        <Card><CardBody className="p-4"><div className="flex items-center gap-2 text-stadio-amber"><CalendarDays size={16} /><p className="text-xs font-bold uppercase tracking-wider">Pendientes</p></div><p className="mt-2 text-2xl font-extrabold text-stadio-black dark:text-white">{kpis.pendientes}</p></CardBody></Card>
        <Card><CardBody className="p-4"><div className="flex items-center gap-2 text-stadio-red"><Ban size={16} /><p className="text-xs font-bold uppercase tracking-wider">Canceladas</p></div><p className="mt-2 text-2xl font-extrabold text-stadio-black dark:text-white">{kpis.canceladas}</p></CardBody></Card>
      </div>

      <Card>
        <CardBody className="space-y-3">
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Buscar por cliente o clase…"
                aria-label="Buscar por cliente o clase"
                className="pl-9"
              />
            </div>
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Estado">
              <option>Todas</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </Select>
            <Select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setPage(1); }} aria-label="Clase">
              <option>Todas</option>
              {classOptions.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 p-1 dark:border-white/10">
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setPage(1); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      mode === m
                        ? "bg-stadio-red text-white"
                        : "text-stadio-gray-dark hover:bg-stadio-gray-light dark:text-white/60 dark:hover:bg-white/10"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {mode !== "Todos" && (
                <select
                  value={year}
                  onChange={(e) => changeYear(Number(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stadio-black outline-none focus:border-stadio-red dark:border-white/10 dark:bg-stadio-black dark:text-white"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
              {(mode === "Mes" || mode === "Día") && (
                <select
                  value={month}
                  onChange={(e) => changeMonth(Number(e.target.value))}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stadio-black outline-none focus:border-stadio-red dark:border-white/10 dark:bg-stadio-black dark:text-white"
                >
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              )}
              {mode === "Día" && (
                <select
                  value={Math.min(day, maxDay)}
                  onChange={(e) => { setDay(Number(e.target.value)); setPage(1); }}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-stadio-black outline-none focus:border-stadio-red dark:border-white/10 dark:bg-stadio-black dark:text-white"
                >
                  {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3">
              <p className="text-xs text-stadio-gray dark:text-white/40">
                {filtered.length} {filtered.length === 1 ? "reserva" : "reservas"}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stadio-gray-dark hover:text-stadio-red dark:text-white/50"
              >
                <RotateCcw size={13} /> Limpiar filtros
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Card>
            <CardHeader title="RESERVAS" subtitle="Pulsa una reserva para gestionarla" />
            <DataTable<AdminBooking>
              columns={[
                {
                  key: "client",
                  header: "Cliente",
                  render: (b) => (
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/clients/${b.clientId}`)}
                      className="font-bold text-stadio-black hover:text-stadio-red dark:text-white"
                    >
                      {b.clientName}
                    </button>
                  ),
                },
                {
                  key: "class",
                  header: "Clase",
                  render: (b) => {
                    const gymClass = classById.get(b.classId);
                    return (
                      <button
                        type="button"
                        onClick={() => { if (gymClass) setDetailClass(gymClass); }}
                        className="text-left"
                      >
                        <span className="block font-semibold text-stadio-black hover:text-stadio-red dark:text-white">{b.className}</span>
                        <span className="block text-xs text-stadio-gray">{b.room}</span>
                      </button>
                    );
                  },
                },
                { key: "date", header: "Fecha", render: (b) => <span className="text-stadio-gray-dark dark:text-white/70">{fmtDayShort(b.date)} · {b.time}</span> },
                {
                  key: "trainer",
                  header: "Monitor/instructor",
                  render: (b) => {
                    const emp = findEmployeeByName(b.trainer);
                    return emp ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/employees/${emp.id}`)}
                        className="font-semibold text-stadio-black hover:text-stadio-red dark:text-white"
                      >
                        {b.trainer}
                      </button>
                    ) : (
                      <span>{b.trainer}</span>
                    );
                  },
                },
                { key: "status", header: "Estado", render: (b) => <Badge variant={statusVariant(b.status)} dot>{b.status}</Badge> },
                {
                  key: "actions",
                  header: "Acciones",
                  render: (b) => (
                    <div className="flex items-center gap-1">
                      {b.status === "Pendiente" && (
                        <button type="button" onClick={() => confirmBooking(b)} className={`${actionBtn} hover:text-stadio-green`} aria-label="Confirmar" title="Confirmar">
                          <Check size={16} />
                        </button>
                      )}
                      {(b.status === "Confirmada" || b.status === "Pendiente") && (
                        <button type="button" onClick={() => setCancelTarget(b)} className={`${actionBtn} hover:text-stadio-red`} aria-label="Cancelar" title="Cancelar">
                          <Ban size={16} />
                        </button>
                      )}
                      <button type="button" onClick={() => navigate(`/admin/bookings/${b.id}`)} className={actionBtn} aria-label="Ver reserva" title="Ver reserva">
                        <Eye size={16} />
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={paged}
              emptyText="No hay reservas con estos filtros."
            />
          </Card>

          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>

        <Card>
          <CardHeader title="OCUPACIÓN POR CLASE" subtitle="Según la vista actual" />
          <CardBody>
            {occupancy.length === 0 ? (
              <p className="text-sm text-stadio-gray dark:text-white/50">No hay clases en la vista.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={Math.max(200, occupancy.length * 44)}>
                  <BarChart data={occupancy} layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Ocupación"]} />
                    <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={20}>
                      {occupancy.map((d) => (
                        <Cell
                          key={d.gymClass.id}
                          className="cursor-pointer"
                          onClick={() => setDetailClass(d.gymClass)}
                          fill={d.pct > 85 ? "#d71920" : d.pct > 60 ? "#f59e0b" : "#16a34a"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="mt-2 text-xs text-stadio-gray dark:text-white/40">
                  Pulsa una barra para ver el detalle de la clase.
                </p>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <ClassDetailModal gymClass={detailClass} onClose={() => setDetailClass(null)} />

      <Confirmation
        open={!!cancelTarget}
        title="Cancelar reserva"
        message={cancelTarget ? `¿Cancelar la reserva de ${cancelTarget.clientName} en ${cancelTarget.className}?` : ""}
        confirmLabel="Sí, cancelar"
        onConfirm={doCancel}
        onCancel={() => setCancelTarget(null)}
        danger
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nueva reserva">
        <div className="space-y-3">
          <Field label="Cliente">
            <Select value={newClient} onChange={(e) => setNewClient(e.target.value)}>
              <option value="">Selecciona un cliente…</option>
              {activeClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Clase">
            <Select value={newClass} onChange={(e) => setNewClass(e.target.value)}>
              <option value="">Selecciona una clase…</option>
              {upcomingClasses.map((c) => <option key={c.id} value={c.id}>{c.name} · {fmtDayShort(c.date)} {c.time}</option>)}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={createBooking} disabled={!newClient || !newClass}>Crear reserva</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
