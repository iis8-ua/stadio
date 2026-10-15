import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil, Mail, Phone, MapPin, Users, Dumbbell, ClipboardList, Clock,
  Palette, Lock, ArrowRight, CalendarDays,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Modal } from "../../components/Modal";
import { Field, Input } from "../../components/Input";
import { ProfileView } from "../../components/ProfileView";
import { classTypes } from "../../data/classes";
import { clients } from "../../data/users";
import { findEmployeeById, roleLabel } from "../../data/employees";
import { getTrainerRoutines } from "../../features/routines/trainerRoutines";
import { getScheduleForDate } from "../../features/schedule/trainerSchedule";
import { CURRENT_TRAINER_ID, getAssignedTrainerId } from "../../features/trainer/personalTrainer";
import { useAuth } from "../../features/auth/authContext";
import { useUserProfile, updateUserProfile } from "../../features/profile/userProfile";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";
import type { TrainerProfile } from "../../types";

const QUICK_LINKS: { to: string; label: string; description: string; icon: LucideIcon; profiles: TrainerProfile[] }[] = [
  { to: "/trainer/clients", label: "Mis clientes", description: "Seguimiento y rutinas", icon: Users, profiles: ["entrenador"] },
  { to: "/trainer/workouts", label: "Biblioteca de rutinas", description: "Crea y asigna rutinas", icon: ClipboardList, profiles: ["entrenador"] },
  { to: "/trainer/classes", label: "Mis clases", description: "Clases y materiales", icon: CalendarDays, profiles: ["monitor"] },
  { to: "/trainer/schedule", label: "Horarios", description: "Tu planificación semanal", icon: CalendarDays, profiles: ["entrenador", "monitor"] },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function mondayOf(d: Date): Date {
  const day = (d.getDay() + 6) % 7;
  const out = new Date(d);
  out.setDate(d.getDate() - day);
  out.setHours(12, 0, 0, 0);
  return out;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(d.getDate() + n);
  return out;
}

export function TrainerProfile() {
  const trainer = findEmployeeById(CURRENT_TRAINER_ID);
  const { notify } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const { trainerProfile } = useAuth();
  const isMonitor = trainerProfile === "monitor";
  const quickLinks = QUICK_LINKS.filter((l) => l.profiles.includes(trainerProfile ?? "entrenador"));

  const [editOpen, setEditOpen] = useState(false);
  const profile = useUserProfile("trainer");
  const [draft, setDraft] = useState(profile);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });

  const myClients = clients.filter((c) => getAssignedTrainerId(c.id) === CURRENT_TRAINER_ID);
  const assignedClasses = trainer
    ? classTypes.filter((t) => trainer.classIds.includes(t.id))
    : [];
  const routines = getTrainerRoutines();

  const weekStart = mondayOf(new Date());
  const weekSessions = Array.from({ length: 7 }, (_, i) => getScheduleForDate(toIso(addDays(weekStart, i))))
    .reduce((acc, list) => acc + list.length, 0);

  const stats = isMonitor
    ? [
        { value: String(assignedClasses.length), label: "clases" },
        { value: String(weekSessions), label: "sesiones/semana" },
      ]
    : [
        { value: String(myClients.length), label: "clientes" },
        { value: String(routines.length), label: "rutinas" },
      ];

  const openEdit = () => {
    setDraft(profile);
    setEditOpen(true);
  };

  const saveProfile = () => {
    updateUserProfile("trainer", {
      name: draft.name.trim() || profile.name,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
      city: draft.city.trim(),
      postalCode: draft.postalCode.trim(),
    });
    setEditOpen(false);
    notify("Perfil actualizado");
  };

  const changePassword = () => {
    if (!password.current || !password.next || !password.confirm) {
      notify("Rellena todos los campos", "error");
      return;
    }
    if (password.next !== password.confirm) {
      notify("Las contraseñas no coinciden", "error");
      return;
    }
    if (password.next.length < 6) {
      notify("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    setPassword({ current: "", next: "", confirm: "" });
    setShowPassword(false);
    notify("Contraseña cambiada correctamente");
  };

  return (
    <>
      <ProfileView
        initials={trainer?.initials ?? "EN"}
        avatar={profile.avatar}
        onAvatarSelect={(dataUrl) => {
          updateUserProfile("trainer", { avatar: dataUrl });
          notify("Foto de perfil actualizada");
        }}
        onAvatarRemove={() => {
          updateUserProfile("trainer", { avatar: undefined });
          notify("Foto de perfil eliminada", "info");
        }}
        onAvatarError={(message) => notify(message, "error")}
        name={profile.name}
        email={profile.email}
        badges={
          <>
            <Badge variant={trainer?.status === "Activo" ? "success" : "neutral"} dot>
              {trainer?.status === "Activo" ? (isMonitor ? "Monitor activo" : "Entrenador activo") : "Inactivo"}
            </Badge>
            {trainer && <Badge variant="neutral">{roleLabel(trainer.roles)}</Badge>}
          </>
        }
        meta={
          <span>
            {profile.city ? `${profile.city} · ` : ""}STADIO
          </span>
        }
        stats={stats}
        action={
          <Button variant="secondary" size="sm" onClick={openEdit}>
            <Pencil size={16} /> EDITAR PERFIL
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="DATOS DE CONTACTO" />
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-stadio-red" />
                <span className="text-stadio-gray-dark dark:text-white/70">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-stadio-red" />
                <span className="text-stadio-gray-dark dark:text-white/70">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-stadio-red" />
                <span className="text-stadio-gray-dark dark:text-white/70">
                  {profile.address ? `${profile.address}, ${profile.postalCode} ${profile.city}` : "—"}
                </span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="DATOS PROFESIONALES" />
            <CardBody className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Dumbbell size={16} className="text-stadio-red" />
                <div>
                  <p className="text-xs text-stadio-gray">Rol</p>
                  <p className="font-semibold text-stadio-black dark:text-white">
                    {trainer ? roleLabel(trainer.roles) : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-stadio-red" />
                <div>
                  <p className="text-xs text-stadio-gray">Horario (asignado por el administrador)</p>
                  <p className="font-semibold text-stadio-black dark:text-white">{trainer?.schedule ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays size={16} className="text-stadio-red" />
                <div>
                  <p className="text-xs text-stadio-gray">Sesiones esta semana</p>
                  <p className="font-semibold text-stadio-black dark:text-white">{weekSessions}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {isMonitor && (
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
                        <p className="truncate text-xs text-stadio-gray dark:text-white/50">{ct.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          )}

          {!isMonitor && (
            <Card>
              <CardHeader title="MIS CLIENTES" action={<Badge variant="neutral">{myClients.length}</Badge>} />
              <CardBody className="space-y-2">
                {myClients.length === 0 ? (
                  <p className="text-sm text-stadio-gray dark:text-white/50">Todavía no tienes clientes asignados.</p>
                ) : (
                  myClients.map((c) => (
                    <Link
                      key={c.id}
                      to={`/trainer/clients/${c.id}`}
                      className="flex items-center justify-between rounded-xl border border-gray-100 p-3 transition-colors hover:border-stadio-red/40 dark:border-white/10"
                    >
                      <div>
                        <p className="text-sm font-bold text-stadio-black dark:text-white">{c.name}</p>
                        <p className="text-xs text-stadio-gray dark:text-white/50">{c.goal}</p>
                      </div>
                      <ArrowRight size={15} className="text-stadio-gray" />
                    </Link>
                  ))
                )}
              </CardBody>
            </Card>
          )}

          <Card className="lg:col-span-2">
            <CardHeader title="ACCESOS RÁPIDOS" />
            <CardBody className="grid gap-2 sm:grid-cols-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-stadio-gray-light/60 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-stadio-black dark:text-white">{link.label}</span>
                      <span className="block text-xs text-stadio-gray dark:text-white/50">{link.description}</span>
                    </span>
                  </Link>
                );
              })}
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="PREFERENCIAS" action={<Palette size={18} className="text-stadio-gray" />} />
            <CardBody>
              <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4 dark:border-white/10">
                <div>
                  <p className="text-sm font-bold text-stadio-black dark:text-white">Modo oscuro</p>
                  <p className="text-xs text-stadio-gray">Cambia la apariencia de la aplicación</p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="relative h-6 w-11 rounded-full bg-stadio-gray-light transition-colors dark:bg-white/10"
                  aria-label="Cambiar tema"
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      isDark ? "left-5 bg-stadio-red" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardBody className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-stadio-red" />
                <p className="text-lg font-extrabold text-stadio-black dark:text-white">Cambiar contraseña</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Contraseña actual">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password.current}
                    onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="Nueva contraseña">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password.next}
                    onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))}
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="Confirmar contraseña">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password.confirm}
                    onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                    placeholder="••••••••"
                  />
                </Field>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs text-stadio-gray transition-colors hover:text-stadio-black dark:hover:text-white"
                >
                  {showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
                </button>
                <Button size="sm" onClick={changePassword}>
                  <Lock size={14} /> CAMBIAR CONTRASEÑA
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </ProfileView>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar perfil">
        <div className="space-y-3">
          <Field label="Nombre">
            <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          </Field>
          <Field label="Email">
            <Input type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
          </Field>
          <Field label="Teléfono">
            <Input value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sexo">
              <Input value={draft.sex} disabled className="bg-gray-50 dark:bg-white/5" />
            </Field>
            <Field label="Fecha de nacimiento">
              <Input value={draft.birthDate} disabled className="bg-gray-50 dark:bg-white/5" />
            </Field>
          </div>
          <Field label="Dirección">
            <Input value={draft.address} onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))} placeholder="Calle, número, piso" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Localidad">
              <Input value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} />
            </Field>
            <Field label="Código postal">
              <Input value={draft.postalCode} onChange={(e) => setDraft((d) => ({ ...d, postalCode: e.target.value }))} />
            </Field>
          </div>
          <Button className="w-full" onClick={saveProfile}>GUARDAR CAMBIOS</Button>
        </div>
      </Modal>
    </>
  );
}
