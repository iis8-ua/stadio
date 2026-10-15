import { useParams } from "react-router-dom";
import { Mail, Phone, MapPin, CalendarDays, CalendarRange, Wallet, Clock, Dumbbell } from "lucide-react";
import { Badge } from "../../components/Badge";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Avatar } from "../../components/Avatar";
import { BackButton } from "../../components/BackButton";
import { ErrorState } from "../../components/EmptyState";
import { employees, roleLabel, canTeach } from "../../data/employees";
import { classTypes } from "../../data/classes";

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function AdminEmployeeDetail() {
  const { id } = useParams();
  const e = employees.find((x) => x.id === id);
  if (!e) return <ErrorState title="Empleado no encontrado" />;

  const assignedClasses = e.classIds
    .map((cid) => classTypes.find((t) => t.id === cid))
    .filter((t): t is (typeof classTypes)[number] => Boolean(t));

  const salaryLabel =
    e.salaryType === "mensual"
      ? `${e.salary.toLocaleString("es-ES")} €/mes`
      : `${e.salary} €/hora`;

  return (
    <div className="space-y-5">
      <BackButton />

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar initials={e.initials} color={e.color} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-stadio-black dark:text-white">{e.name}</h1>
            <p className="text-sm text-stadio-gray dark:text-white/50">{e.email} · {e.phone}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={e.status === "Activo" ? "success" : "neutral"} dot>{e.status}</Badge>
              <Badge variant="info">{roleLabel(e.roles)}</Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="p-4">
            <p className="text-xs text-stadio-gray">Clases asignadas</p>
            <p className="text-lg font-extrabold text-stadio-black dark:text-white">
              {canTeach(e.roles) ? assignedClasses.length : "—"}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-xs text-stadio-gray">Periodos de vacaciones</p>
            <p className="text-lg font-extrabold text-stadio-black dark:text-white">{e.vacations.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4">
            <p className="text-xs text-stadio-gray">Salario</p>
            <p className="text-lg font-extrabold text-stadio-black dark:text-white">{salaryLabel}</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="DATOS DE CONTACTO" />
          <CardBody className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-stadio-red" />
              <span className="text-stadio-gray-dark dark:text-white/70">{e.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-stadio-red" />
              <span className="text-stadio-gray-dark dark:text-white/70">{e.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-stadio-red" />
              <span className="text-stadio-gray-dark dark:text-white/70">
                {e.address}, {e.postalCode} {e.city}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays size={16} className="text-stadio-red" />
              <span className="text-stadio-gray-dark dark:text-white/70">
                {e.sex} · {e.birthDate}
              </span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="PUESTO Y HORARIO" />
          <CardBody className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {e.roles.map((r) => (
                <Badge key={r} variant="neutral">{roleLabel([r])}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock size={16} className="text-stadio-red" />
              <span className="text-stadio-gray-dark dark:text-white/70">{e.schedule}</span>
            </div>
            {e.availability && (
              <div className="flex items-start gap-3 text-sm">
                <CalendarRange size={16} className="mt-0.5 shrink-0 text-stadio-red" />
                <span className="text-stadio-gray-dark dark:text-white/70">{e.availability}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Wallet size={16} className="text-stadio-red" />
              <span className="text-stadio-gray-dark dark:text-white/70">
                {salaryLabel} · {e.salaryType}
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      {canTeach(e.roles) && (
        <Card>
          <CardHeader title="CLASES QUE IMPARTE" action={<Badge variant="neutral">{assignedClasses.length}</Badge>} />
          <CardBody className="space-y-2">
            {assignedClasses.length === 0 ? (
              <p className="text-sm text-stadio-gray dark:text-white/50">Sin clases asignadas.</p>
            ) : (
              assignedClasses.map((ct) => (
                <div key={ct.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 dark:border-white/10">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
                    <Dumbbell size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{ct.name}</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">{ct.description}</p>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="VACACIONES" action={<Badge variant="neutral">{e.vacations.length}</Badge>} />
        <CardBody className="space-y-2">
          {e.vacations.length === 0 ? (
            <p className="text-sm text-stadio-gray dark:text-white/50">Sin vacaciones registradas.</p>
          ) : (
            e.vacations.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 dark:border-white/10">
                <span className="text-sm font-semibold text-stadio-black dark:text-white">
                  {fmtDate(v.start)} - {fmtDate(v.end)}
                </span>
                <Badge variant="warning">Vacaciones</Badge>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
