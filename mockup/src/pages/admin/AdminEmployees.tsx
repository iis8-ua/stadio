import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Ban, UserCheck, CalendarDays, X, List, CalendarRange, Clock, Wallet, Check, Search, RotateCcw, Eye } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Avatar } from "../../components/Avatar";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Confirmation } from "../../components/Confirmation";
import { Field, Input, Select } from "../../components/Input";
import { VacationCalendar } from "../../components/VacationCalendar";
import { employees, EMPLOYEE_ROLES, EMPLOYEE_ROLE_LABELS, canTeach, roleLabel } from "../../data/employees";
import { classTypes } from "../../data/classes";
import { useToast } from "../../hooks/useToast";
import type { Employee, EmployeeRole, SalaryType, VacationPeriod } from "../../types";

const SEXES: Employee["sex"][] = ["Hombre", "Mujer"];

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const HOURS = Array.from({ length: 35 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const SCHEDULE_RE = /^([A-Za-zÁÉÍÓÚáéíóúñÑ]+)-([A-Za-zÁÉÍÓÚáéíóúñÑ]+) (\d{2}:\d{2})-(\d{2}:\d{2})$/;

function parseSchedule(s: string) {
  const m = s.match(SCHEDULE_RE);
  if (!m) return null;
  return { from: m[1], to: m[2], timeFrom: m[3], timeTo: m[4] };
}

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

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

interface EmployeeForm {
  id: string | null;
  name: string;
  email: string;
  phone: string;
  sex: Employee["sex"];
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
  roles: EmployeeRole[];
  flexible: boolean;
  dayFrom: string;
  dayTo: string;
  timeFrom: string;
  timeTo: string;
  status: "Activo" | "Inactivo";
  classIds: string[];
  vacations: VacationPeriod[];
  salaryType: SalaryType;
  salary: string;
  availability: string;
}

const emptyForm = (): EmployeeForm => ({
  id: null,
  name: "",
  email: "",
  phone: "",
  sex: "Hombre",
  birthDate: "",
  address: "",
  city: "",
  postalCode: "",
  roles: [],
  flexible: false,
  dayFrom: "Lunes",
  dayTo: "Viernes",
  timeFrom: "16:00",
  timeTo: "22:00",
  status: "Activo",
  classIds: [],
  vacations: [],
  salaryType: "mensual",
  salary: "",
  availability: "",
});

export function AdminEmployees() {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [list, setList] = useState<Employee[]>(employees);
  const [view, setView] = useState<"table" | "calendar">("table");
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm());
  const [step, setStep] = useState<1 | 2>(1);
  const [deactivate, setDeactivate] = useState<Employee | null>(null);
  const [reactivate, setReactivate] = useState<Employee | null>(null);
  const [vStart, setVStart] = useState("");
  const [vEnd, setVEnd] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const setField = <K extends keyof EmployeeForm>(key: K, value: EmployeeForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleRole = (r: EmployeeRole) => {
    const has = form.roles.includes(r);
    const roles = has ? form.roles.filter((x) => x !== r) : [...form.roles, r];
    setForm((f) => ({ ...f, roles, classIds: canTeach(roles) ? f.classIds : [] }));
    if (!canTeach(roles)) setStep(1);
  };

  const toggleClass = (id: string) => {
    setForm((f) => ({
      ...f,
      classIds: f.classIds.includes(id) ? f.classIds.filter((x) => x !== id) : [...f.classIds, id],
    }));
  };

  const openCreate = () => {
    setForm(emptyForm());
    setMode("create");
    setStep(1);
    setVStart("");
    setVEnd("");
  };

  const openEdit = (e: Employee) => {
    const parsed = parseSchedule(e.schedule);
    setForm({
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone,
      sex: e.sex,
      birthDate: toISO(e.birthDate),
      address: e.address,
      city: e.city,
      postalCode: e.postalCode,
      roles: [...e.roles],
      flexible: !parsed,
      dayFrom: parsed?.from ?? "Lunes",
      dayTo: parsed?.to ?? "Viernes",
      timeFrom: parsed?.timeFrom ?? "16:00",
      timeTo: parsed?.timeTo ?? "22:00",
      status: e.status,
      classIds: [...e.classIds],
      vacations: e.vacations.map((v) => ({ ...v })),
      salaryType: e.salaryType,
      salary: String(e.salary),
      availability: e.availability ?? "",
    });
    setMode("edit");
    setStep(1);
    setVStart("");
    setVEnd("");
  };

  const close = () => {
    setMode(null);
    setStep(1);
    setVStart("");
    setVEnd("");
  };

  const addVacation = () => {
    if (!vStart || !vEnd) {
      notify("Indica inicio y fin del periodo", "warning");
      return;
    }
    if (vStart > vEnd) {
      notify("El fin no puede ser anterior al inicio", "warning");
      return;
    }
    setField("vacations", [...form.vacations, { id: `v-${Date.now()}`, start: vStart, end: vEnd }]);
    setVStart("");
    setVEnd("");
  };

  const validateStep1 = (): boolean => {
    if (!form.name.trim()) {
      notify("El nombre es obligatorio", "warning");
      return false;
    }
    if (form.roles.length === 0) {
      notify("Selecciona al menos un rol", "warning");
      return false;
    }
    if (!form.flexible && form.timeFrom >= form.timeTo) {
      notify("La hora de fin debe ser posterior al inicio", "warning");
      return false;
    }
    const salary = Number(form.salary);
    if (!Number.isFinite(salary) || salary <= 0) {
      notify("Indica un salario válido", "warning");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (validateStep1()) setStep(2);
  };

  const save = () => {
    if (!validateStep1()) return;
    const schedule = form.flexible
      ? "Flexible"
      : `${form.dayFrom}-${form.dayTo} ${form.timeFrom}-${form.timeTo}`;
    const teaching = canTeach(form.roles);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      sex: form.sex,
      birthDate: toDMY(form.birthDate),
      address: form.address.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      roles: form.roles,
      schedule,
      status: form.status,
      classIds: teaching ? form.classIds : [],
      vacations: form.vacations,
      salaryType: form.salaryType,
      salary: Number(form.salary),
      availability: form.availability.trim(),
    };
    if (mode === "edit" && form.id) {
      setList((l) => l.map((x) => (x.id === form.id ? { ...x, ...payload } : x)));
      notify("Empleado actualizado");
    } else {
      const initials = payload.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase() || "?";
      setList((l) => [...l, { id: `emp-${Date.now()}`, ...payload, initials, color: "#111111" }]);
      notify("Empleado creado");
    }
    close();
  };

  const toggleStatus = (e: Employee) => {
    setList((l) =>
      l.map((x) => (x.id === e.id ? { ...x, status: x.status === "Activo" ? "Inactivo" : "Activo" } : x))
    );
    notify(`${e.name} ${e.status === "Activo" ? "desactivado" : "activado"}`, "info");
  };

  const confirmReactivate = () => {
    if (reactivate) {
      setList((l) => l.map((x) => (x.id === reactivate.id ? { ...x, status: "Activo" } : x)));
      notify(`${reactivate.name} reactivado`);
      setReactivate(null);
    }
  };

  const fmtSalary = (e: Employee) =>
    e.salaryType === "mensual"
      ? `${e.salary.toLocaleString("es-ES")} €/mes`
      : `${e.salary} €/h`;

  const filteredList = list.filter((e) => {
    const q = query.trim().toLowerCase();
    if (q && !e.name.toLowerCase().includes(q) && !e.email.toLowerCase().includes(q)) return false;
    if (roleFilter !== "Todos" && !e.roles.includes(roleFilter as EmployeeRole)) return false;
    if (statusFilter !== "Todos" && e.status !== statusFilter) return false;
    return true;
  });

  const resetFilters = () => {
    setQuery("");
    setRoleFilter("Todos");
    setStatusFilter("Todos");
  };

  const canTeachNow = canTeach(form.roles);
  const teachingRolesLabel = form.roles.filter((r) => r === "monitor" || r === "instructor");
  const primaryLabel =
    step === 1 && canTeachNow
      ? "SIGUIENTE"
      : mode === "edit"
        ? "GUARDAR CAMBIOS"
        : "CREAR EMPLEADO";

  const primaryAction = () => {
    if (step === 1 && canTeachNow) goNext();
    else save();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Empleados</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Equipo de STADIO</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black p-1">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                view === "table"
                  ? "bg-stadio-red text-white"
                  : "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
              }`}
            >
              <List size={14} /> TABLA
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                view === "calendar"
                  ? "bg-stadio-red text-white"
                  : "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
              }`}
            >
              <CalendarRange size={14} /> CALENDARIO
            </button>
          </div>
          <Button onClick={openCreate}><Plus size={18} /> NUEVO EMPLEADO</Button>
        </div>
      </div>

      {view === "calendar" ? (
        <VacationCalendar employees={list} onSelectEmployee={(e) => navigate(`/admin/employees/${e.id}`)} />
      ) : (
      <>
      <Card>
        <CardBody className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3 lg:flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o email..." aria-label="Buscar empleados" className="pl-9" />
            </div>
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="Todos">Todos los roles</option>
              {EMPLOYEE_ROLES.map((r) => (
                <option key={r} value={r}>{EMPLOYEE_ROLE_LABELS[r]}</option>
              ))}
            </Select>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Todos">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Select>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-stadio-gray-dark hover:bg-stadio-gray-light dark:text-white/50 dark:hover:bg-white/10"
          >
            <RotateCcw size={14} /> Limpiar filtros
          </button>
        </CardBody>
      </Card>
      <Card>
        <DataTable<Employee>
          columns={[
            {
              key: "name",
              header: "Nombre",
              render: (e) => (
                <button
                  type="button"
                  onClick={() => navigate(`/admin/employees/${e.id}`)}
                  className="flex items-center gap-3 text-left"
                >
                  <Avatar initials={e.initials} color={e.color} size="sm" />
                  <div>
                    <p className="font-bold text-stadio-black hover:text-stadio-red dark:text-white">{e.name}</p>
                    <p className="text-xs text-stadio-gray">{e.email}</p>
                  </div>
                </button>
              ),
            },
            { key: "role", header: "Rol", render: (e) => roleLabel(e.roles) },
            { key: "schedule", header: "Horario", render: (e) => e.schedule },
            {
              key: "status",
              header: "Estado",
              render: (e) => <Badge variant={e.status === "Activo" ? "success" : "neutral"} dot>{e.status}</Badge>,
            },
            {
              key: "classIds",
              header: "Clases",
              render: (e) =>
                canTeach(e.roles) && e.classIds.length > 0 ? (
                  <div className="flex max-w-[240px] flex-wrap gap-1">
                    {e.classIds.map((id) => {
                      const ct = classTypes.find((t) => t.id === id);
                      return ct ? (
                        <Badge key={id} variant="neutral">
                          {ct.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <span className="text-xs text-stadio-gray">—</span>
                ),
            },
            {
              key: "salary",
              header: "Salario",
              render: (e) => <Badge variant="info"><Wallet size={12} className="mr-1 inline" />{fmtSalary(e)}</Badge>,
            },
            {
              key: "vacations",
              header: "Vacaciones",
              render: (e) =>
                e.vacations.length > 0 ? (
                  <Badge variant="neutral"><CalendarDays size={12} className="mr-1 inline" />{e.vacations.length}</Badge>
                ) : (
                  <span className="text-xs text-stadio-gray">Sin vacaciones</span>
                ),
            },
            {
              key: "actions",
              header: "Acciones",
              render: (e) => (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/admin/employees/${e.id}`)}
                    className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    aria-label="Ver empleado"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openEdit(e)}
                    className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    aria-label="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  {e.status === "Inactivo" ? (
                    <button
                      onClick={() => setReactivate(e)}
                      className="rounded-lg p-2 text-stadio-green hover:bg-green-50 dark:hover:bg-green-950/40"
                      aria-label="Reactivar"
                      title="Reactivar"
                    >
                      <UserCheck size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeactivate(e)}
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
          rows={filteredList}
        />
      </Card>
      </>
      )}

      <Modal open={mode !== null} onClose={close} title={mode === "edit" ? (form.name ? `Editar a ${form.name}` : "Editar empleado") : "Nuevo empleado"}>
        <div className="space-y-3">
          {mode !== null && (
            <div className="flex items-center gap-2">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-center text-xs font-bold transition-colors ${
                    step >= s
                      ? "bg-stadio-red/10 text-stadio-red dark:bg-stadio-red/20"
                      : "bg-stadio-gray-light/60 text-stadio-gray dark:bg-white/5 dark:text-white/40"
                  }`}
                >
                  {s === 1 ? "DATOS" : "CLASES"}
                </div>
              ))}
            </div>
          )}
          {step === 1 && (
            <>
          <div>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stadio-gray">Datos personales</span>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Field label="Nombre">
                    <Input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Nombre completo" />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="Email">
                    <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="email@stadio.com" />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="Teléfono">
                    <Input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+34..." />
                  </Field>
                </div>
                <Field label="Sexo">
                  <Select value={form.sex} onChange={(e) => setField("sex", e.target.value as Employee["sex"])}>
                    {SEXES.map((s) => <option key={s}>{s}</option>)}
                  </Select>
                </Field>
                <Field label="Fecha de nacimiento">
                  <Input type="date" value={form.birthDate} onChange={(e) => setField("birthDate", e.target.value)} />
                </Field>
              </div>
              <Field label="Dirección">
                <Input value={form.address} onChange={(e) => setField("address", e.target.value)} placeholder="Calle, número, piso" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Localidad">
                  <Input value={form.city} onChange={(e) => setField("city", e.target.value)} />
                </Field>
                <Field label="Código postal">
                  <Input value={form.postalCode} onChange={(e) => setField("postalCode", e.target.value)} />
                </Field>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-white/10 pt-3.5">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stadio-gray">Roles del puesto</span>
            <div className="flex flex-wrap gap-2">
              {EMPLOYEE_ROLES.map((r) => {
                const active = form.roles.includes(r);
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => toggleRole(r)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                      active
                        ? "border-stadio-red bg-stadio-red text-white"
                        : "border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 text-stadio-gray-dark dark:text-white/60 hover:border-stadio-red/40"
                    }`}
                  >
                    {active && <Check size={13} />}
                    {EMPLOYEE_ROLE_LABELS[r]}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-stadio-gray dark:text-white/50">
              Solo los monitores e instructores reciben clases. Un entrenador puede ser también monitor o instructor.
            </p>
          </div>

          <Field label="Horario">
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-stadio-black p-1">
              <button
                onClick={() => setField("flexible", false)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  form.flexible
                    ? "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                    : "bg-stadio-red text-white"
                }`}
              >
                <CalendarRange size={14} /> RANGO
              </button>
              <button
                onClick={() => setField("flexible", true)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  form.flexible
                    ? "bg-stadio-red text-white"
                    : "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                }`}
              >
                <Clock size={14} /> FLEXIBLE
              </button>
            </div>
          </Field>
          {form.flexible ? (
            <div className="rounded-xl border border-gray-100 dark:border-white/10 bg-stadio-gray-light/60 dark:bg-white/5 px-4 py-3">
              <p className="text-sm font-bold text-stadio-black dark:text-white">Flexible</p>
              <p className="text-xs text-stadio-gray dark:text-white/50">Sin horario fijo.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Desde (día)">
                  <Select value={form.dayFrom} onChange={(e) => setField("dayFrom", e.target.value)}>
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </Select>
                </Field>
                <Field label="Hasta (día)">
                  <Select value={form.dayTo} onChange={(e) => setField("dayTo", e.target.value)}>
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Desde (hora)">
                  <Select value={form.timeFrom} onChange={(e) => setField("timeFrom", e.target.value)}>
                    {HOURS.map((h) => <option key={h}>{h}</option>)}
                  </Select>
                </Field>
                <Field label="Hasta (hora)">
                  <Select value={form.timeTo} onChange={(e) => setField("timeTo", e.target.value)}>
                    {HOURS.map((h) => <option key={h}>{h}</option>)}
                  </Select>
                </Field>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-stadio-red/20 bg-stadio-red/5 px-3 py-2">
                <span className="text-xs font-semibold text-stadio-gray-dark dark:text-white/60">Horario resultante</span>
                <span className="text-sm font-extrabold text-stadio-red">
                  {form.dayFrom}-{form.dayTo} {form.timeFrom}-{form.timeTo}
                </span>
              </div>
            </div>
          )}
          <Field label="Disponibilidad">
            <Input
              value={form.availability}
              onChange={(e) => setField("availability", e.target.value)}
              placeholder="Ej. Mañanas y tardes, también fines de semana"
            />
          </Field>
          <Field label="Estado">
            <Select value={form.status} onChange={(e) => setField("status", e.target.value as "Activo" | "Inactivo")}>
              <option>Activo</option>
              <option>Inactivo</option>
            </Select>
          </Field>

          <div>
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
              <CalendarDays size={14} /> Vacaciones
            </span>
            <div className="space-y-2">
              {form.vacations.map((v, i) => (
                <div key={`${v.id}-${i}`} className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-white/10 px-3 py-2">
                  <span className="text-sm font-semibold text-stadio-black dark:text-white">
                    {fmtDate(v.start)} - {fmtDate(v.end)}
                  </span>
                  <button
                    onClick={() => setField("vacations", form.vacations.filter((_, idx) => idx !== i))}
                    className="rounded-lg p-1 text-stadio-red hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label="Quitar vacaciones"
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
              {form.vacations.length === 0 && (
                <p className="text-xs text-stadio-gray dark:text-white/50">No hay vacaciones registradas.</p>
              )}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Field label="Desde">
                <Input type="date" value={vStart} onChange={(e) => setVStart(e.target.value)} />
              </Field>
              <Field label="Hasta">
                <Input type="date" value={vEnd} onChange={(e) => setVEnd(e.target.value)} />
              </Field>
            </div>
            <Button variant="secondary" className="w-full" onClick={addVacation}>AÑADIR PERIODO</Button>
          </div>

          <div className="border-t border-gray-100 dark:border-white/10 pt-3.5">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
              <Wallet size={14} /> Salario
            </span>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <Select value={form.salaryType} onChange={(e) => setField("salaryType", e.target.value as SalaryType)}>
                  <option value="mensual">Mensual</option>
                  <option value="por horas">Por horas</option>
                </Select>
              </Field>
              <Field label={form.salaryType === "mensual" ? "Importe (€/mes)" : "Importe (€/hora)"}>
                <Input type="number" min={0} value={form.salary} onChange={(e) => setField("salary", e.target.value)} placeholder="0,00" />
              </Field>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stadio-red/20 bg-stadio-red/5 px-3 py-2">
              <span className="text-xs font-semibold text-stadio-gray-dark dark:text-white/60">Salario resultante</span>
              <span className="text-sm font-extrabold text-stadio-red">
                {form.salaryType === "mensual"
                  ? `${Number(form.salary) || 0} €/mes`
                  : `${Number(form.salary) || 0} €/hora`}
              </span>
            </div>
          </div>
            </>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <div className="rounded-xl border border-stadio-green/20 bg-green-50 px-4 py-3 dark:bg-green-950/40">
                <p className="text-sm font-bold text-stadio-green">Rol docente: {roleLabel(teachingRolesLabel)}</p>
                <p className="mt-0.5 text-xs text-stadio-gray-dark dark:text-white/60">
                  Marca las clases que imparte este empleado.
                </p>
              </div>
              <Field label="Clases asignadas">
                <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                  {classTypes.map((ct) => {
                    const active = form.classIds.includes(ct.id);
                    return (
                      <button
                        key={ct.id}
                        type="button"
                        onClick={() => toggleClass(ct.id)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                          active
                            ? "border-stadio-red bg-stadio-red/5 dark:bg-stadio-red/10"
                            : "border-gray-100 dark:border-white/10 hover:bg-stadio-gray-light/60 dark:hover:bg-white/5"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                            active
                              ? "border-stadio-red bg-stadio-red text-white"
                              : "border-gray-300 dark:border-white/25"
                          }`}
                        >
                          {active && <Check size={13} />}
                        </span>
<span className="min-w-0">
                        <span className="block text-sm font-bold text-stadio-black dark:text-white">{ct.name}</span>
                        <span className="block text-xs text-stadio-gray dark:text-white/50">
                          {ct.description}
                        </span>
                      </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
              <p className="text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
                {form.classIds.length} {form.classIds.length === 1 ? "clase seleccionada" : "clases seleccionadas"}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 border-t border-gray-100 dark:border-white/10 pt-4">
            {step === 1 ? (
              <Button variant="ghost" onClick={close}>CANCELAR</Button>
            ) : (
              <Button variant="secondary" onClick={() => setStep(1)}>← ATRÁS</Button>
            )}
            <Button onClick={primaryAction}>{primaryLabel}</Button>
          </div>
        </div>
      </Modal>

      <Confirmation
        open={!!deactivate}
        title="Desactivar empleado"
        message={`¿Desactivar a ${deactivate?.name}?`}
        confirmLabel="Sí, desactivar"
        onConfirm={() => { if (deactivate) toggleStatus(deactivate); setDeactivate(null); }}
        onCancel={() => setDeactivate(null)}
        danger
      />

      <Confirmation
        open={!!reactivate}
        title="Reactivar empleado"
        message={`¿Seguro que quieres reactivar a ${reactivate?.name}?`}
        confirmLabel="Sí, reactivar"
        onConfirm={confirmReactivate}
        onCancel={() => setReactivate(null)}
      />
    </div>
  );
}