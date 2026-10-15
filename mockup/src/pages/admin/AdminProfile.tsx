import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil, Mail, Phone, MapPin, Users, UserCog, BarChart3, ArrowRight, Palette, Lock, Settings,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Modal } from "../../components/Modal";
import { Field, Input, Select } from "../../components/Input";
import { ProfileView } from "../../components/ProfileView";
import { clients, users } from "../../data/users";
import { employees } from "../../data/employees";
import { resolveGymClasses, classTypes, classSessions, dateToKey } from "../../data/classes";
import { useUserProfile, updateUserProfile } from "../../features/profile/userProfile";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";

const QUICK_LINKS = [
  { to: "/admin/clients", label: "Clientes", description: "Gestionar clientes", icon: Users },
  { to: "/admin/employees", label: "Empleados", description: "Gestionar plantilla", icon: UserCog },
  { to: "/admin/analytics", label: "Analítica", description: "Ver métricas", icon: BarChart3 },
  { to: "/admin/settings", label: "Configuración", description: "Ajustes del gimnasio", icon: Settings },
];

function toISO(dmy: string): string {
  const [d, m, y] = dmy.split("/");
  if (!d || !m || !y) return "";
  return `${y}-${m}-${d}`;
}

function toDMY(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

export function AdminProfile() {
  const admin = users.find((u) => u.role === "admin")!;
  const { notify } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const [editOpen, setEditOpen] = useState(false);
  const profile = useUserProfile("admin");
  const [draft, setDraft] = useState(profile);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });

  const todayKey = dateToKey(new Date());
  const todayClassesCount = resolveGymClasses(classTypes, classSessions).filter((c) => c.date === todayKey).length;

  const openEdit = () => {
    setDraft(profile);
    setEditOpen(true);
  };

  const saveProfile = () => {
    updateUserProfile("admin", {
      name: draft.name.trim() || profile.name,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      sex: draft.sex,
      birthDate: draft.birthDate,
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
        initials={admin.initials}
        avatar={profile.avatar}
        onAvatarSelect={(dataUrl) => {
          updateUserProfile("admin", { avatar: dataUrl });
          notify("Foto de perfil actualizada");
        }}
        onAvatarRemove={() => {
          updateUserProfile("admin", { avatar: undefined });
          notify("Foto de perfil eliminada", "info");
        }}
        onAvatarError={(message) => notify(message, "error")}
        name={profile.name}
        email={profile.email}
        badges={
          <>
            <Badge variant="success" dot>Administradora</Badge>
            <Badge variant="neutral">Acceso total</Badge>
          </>
        }
        meta={<span>{profile.city ? `${profile.city} · ` : ""}Administración de STADIO</span>}
        stats={[
          { value: String(clients.length), label: "clientes" },
          { value: String(employees.length), label: "empleados" },
          { value: String(todayClassesCount), label: "clases hoy" },
        ]}
        action={
          <Button variant="secondary" size="sm" onClick={openEdit}>
            <Pencil size={16} /> EDITAR PERFIL
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
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
            <CardHeader title="ACCESOS RÁPIDOS" />
            <CardBody className="space-y-2">
              {QUICK_LINKS.map((link) => {
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
                    <ArrowRight size={15} className="text-stadio-gray" />
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
              <Select value={draft.sex} onChange={(e) => setDraft((d) => ({ ...d, sex: e.target.value }))}>
                <option>Hombre</option>
                <option>Mujer</option>
              </Select>
            </Field>
            <Field label="Fecha de nacimiento">
              <Input
                type="date"
                value={toISO(draft.birthDate)}
                onChange={(e) => setDraft((d) => ({ ...d, birthDate: toDMY(e.target.value) }))}
              />
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
