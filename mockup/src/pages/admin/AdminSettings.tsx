import { useState } from "react";
import type { ReactNode } from "react";
import {
  Building2, Users, Clock, CreditCard, Plug, ShieldCheck, Palette, Save, Bell,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Field, Input } from "../../components/Input";
import { ToggleSwitch } from "../../components/ToggleSwitch";
import { ScheduleSettings } from "../../components/ScheduleSettings";
import { RolesPermissions } from "../../components/RolesPermissions";
import { IntegrationsSettings } from "../../components/IntegrationsSettings";
import { SecuritySettings } from "../../components/SecuritySettings";
import { Confirmation } from "../../components/Confirmation";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";
import { getGymSettings, updateGymSettings } from "../../features/settings/gymSettings";
import type { NotificationPrefs } from "../../features/settings/gymSettings";

interface Section {
  icon: typeof Clock;
  title: string;
  body: ReactNode;
  className?: string;
}

const NOTIFICATION_OPTIONS: { key: keyof NotificationPrefs; label: string; description: string }[] = [
  { key: "quotaReminder", label: "Recordatorio de cuota", description: "Avisar cuando la cuota está próxima a vencer" },
  { key: "classReminder", label: "Recordatorio de clases", description: "Avisar antes de las clases reservadas" },
  { key: "weeklySummary", label: "Resumen semanal", description: "Enviar un resumen de actividad cada semana" },
  { key: "channelEmail", label: "Canal: email", description: "Enviar las notificaciones por correo electrónico" },
  { key: "channelPush", label: "Canal: push", description: "Enviar notificaciones push a la aplicación" },
];

export function AdminSettings() {
  const { notify } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const initial = getGymSettings();

  const [confirmSave, setConfirmSave] = useState(false);
  const [name, setName] = useState(initial.name);
  const [city, setCity] = useState(initial.city);
  const [address, setAddress] = useState(initial.address);
  const [phone, setPhone] = useState(initial.phone);
  const [capacity, setCapacity] = useState(String(initial.capacity));
  const [membershipFee, setMembershipFee] = useState(String(initial.membershipFee));
  const [billingDay, setBillingDay] = useState(initial.billingDay);
  const [notifications, setNotifications] = useState<NotificationPrefs>(initial.notifications);

  const toggleNotification = (key: keyof NotificationPrefs) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }));

  const saveSettings = () => {
    updateGymSettings({
      name: name.trim() || initial.name,
      city: city.trim(),
      address: address.trim(),
      phone: phone.trim(),
      capacity: Math.max(1, Number(capacity) || initial.capacity),
      membershipFee: Math.max(0, Number(membershipFee) || initial.membershipFee),
      billingDay,
      notifications,
    });
    notify("Configuración guardada");
  };

  const sections: Section[] = [
    {
      icon: Building2,
      title: "Datos del gimnasio",
      body: (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Capacidad (personas)"><Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} /></Field>
          <Field label="Ciudad"><Input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
          <Field label="Dirección"><Input value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
          <Field label="Teléfono"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        </div>
      ),
    },
    {
      icon: CreditCard,
      title: "Cuota mensual",
      body: (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Importe mensual (€)">
              <div className="relative">
                <Input type="number" min={0} value={membershipFee} onChange={(e) => setMembershipFee(e.target.value)} />
              </div>
            </Field>
            <p className="text-xs text-stadio-gray dark:text-white/50 sm:pb-2.5">
              Se cobrará el <b className="text-stadio-black dark:text-white">día {billingDay}</b> de cada mes.
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
              Día de cobro · común a todos los meses
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setBillingDay(d)}
                  aria-pressed={billingDay === d}
                  className={`grid h-9 place-items-center rounded-lg text-sm font-semibold transition-colors ${
                    billingDay === d
                      ? "bg-stadio-red text-white"
                      : "bg-stadio-gray-light text-stadio-gray-dark hover:bg-gray-200 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-stadio-gray dark:text-white/40">
              Calendario común a todos los meses: el día seleccionado se repite en cada cobro.
            </p>
          </div>

          <Button variant="secondary" onClick={() => { setConfirmSave(true); }}>Guardar cuota</Button>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Notificaciones",
      body: (
        <div className="space-y-2">
          {NOTIFICATION_OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3"
            >
              <div>
                <p className="text-sm font-bold text-stadio-black dark:text-white">{opt.label}</p>
                <p className="text-xs text-stadio-gray dark:text-white/50">{opt.description}</p>
              </div>
              <ToggleSwitch
                checked={notifications[opt.key]}
                onChange={() => toggleNotification(opt.key)}
                label={opt.label}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Clock,
      title: "Horarios",
      className: "lg:col-span-2",
      body: <ScheduleSettings />,
    },
    {
      icon: Plug,
      title: "Integraciones",
      body: <IntegrationsSettings />,
    },
    {
      icon: ShieldCheck,
      title: "Seguridad",
      body: <SecuritySettings />,
    },
    {
      icon: Users,
      title: "Roles y permisos",
      body: <RolesPermissions />,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">Configuración</h1>
          <p className="mt-1 text-sm text-stadio-gray dark:text-white/50">Administración de STADIO</p>
        </div>
        <Button onClick={() => { setConfirmSave(true); }}>
          <Save size={18} /> GUARDAR CAMBIOS
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className={s.className}>
              <CardHeader title={s.title} action={<Icon size={18} className="text-stadio-gray" />} />
              <CardBody>{s.body}</CardBody>
            </Card>
          );
        })}

        <Card>
          <CardHeader title="Preferencias" action={<Palette size={18} className="text-stadio-gray" />} />
          <CardBody>
            <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 p-4">
              <div>
                <p className="text-sm font-bold text-stadio-black dark:text-white">Modo oscuro</p>
                <p className="text-xs text-stadio-gray">Cambia la apariencia de la aplicación</p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative h-6 w-11 rounded-full bg-stadio-gray-light dark:bg-white/10 transition-colors"
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
      </div>

      <Confirmation
        open={confirmSave}
        title="Guardar configuración"
        message="Los cambios se guardarán localmente en esta demo y estarán disponibles para las funcionalidades que usan la configuración."
        confirmLabel="Guardar"
        onConfirm={() => { setConfirmSave(false); saveSettings(); }}
        onCancel={() => setConfirmSave(false)}
      />
    </div>
  );
}
