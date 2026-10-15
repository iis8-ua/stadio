import { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, CreditCard, Activity, DoorOpen, Settings, Palette, Bell, ArrowRight, Scale, Target, Lock, MapPin, CalendarDays, TrendingUp, UserCheck, Landmark, Trash2, Mail, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { Modal } from "../../components/Modal";
import { Confirmation } from "../../components/Confirmation";
import { Field, Input, Select } from "../../components/Input";
import { Avatar } from "../../components/Avatar";
import { ToggleSwitch } from "../../components/ToggleSwitch";
import { currentClient } from "../../data/users";
import { findEmployeeById } from "../../data/employees";
import { accessRecords } from "../../data/payments";
import { getBookings } from "../../features/bookings/clientBookings";
import { getClientProfile, updateClientProfile, maskIban, isValidIban, verifyClientEmail } from "../../features/profile/clientProfile";
import { AvatarUpload } from "../../components/AvatarUpload";
import {
  cancelPersonalTrainer,
  getPersonalTrainerInfo,
  requestPersonalTrainer,
} from "../../features/trainer/personalTrainer";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";

type ReminderKey = "training" | "classes" | "fees" | "weekly";

const REMINDER_OPTIONS: { key: ReminderKey; label: string; description: string; icon: typeof Activity }[] = [
  { key: "training", label: "Entrenamientos", description: "Recuérdame registrar mis entrenamientos", icon: Activity },
  { key: "classes", label: "Clases reservadas", description: "Aviso antes de cada clase que tengo reservada", icon: CalendarDays },
  { key: "fees", label: "Cuota mensual", description: "Aviso cuando la cuota esté pendiente", icon: CreditCard },
  { key: "weekly", label: "Resumen semanal", description: "Resumen de mi actividad cada semana", icon: TrendingUp },
];

export function ClientProfile() {
  const [editOpen, setEditOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const initial = getClientProfile();
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [address, setAddress] = useState(initial.address);
  const [city, setCity] = useState(initial.city);
  const [postalCode, setPostalCode] = useState(initial.postalCode);
  const [weight, setWeight] = useState(String(initial.weight));
  const [targetWeight, setTargetWeight] = useState(String(initial.targetWeight));
  const [goal, setGoal] = useState(initial.goal);
  const [frequency, setFrequency] = useState(initial.frequency);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [reminders, setReminders] = useState<{ enabled: boolean } & Record<ReminderKey, boolean>>({
    enabled: true,
    training: true,
    classes: true,
    fees: true,
    weekly: false,
  });
  const [reminderLead, setReminderLead] = useState("30");
  const [cancelTrainerOpen, setCancelTrainerOpen] = useState(false);
  const [, setPtTick] = useState(0);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [bankHolder, setBankHolder] = useState(initial.bankAccount?.holder ?? initial.name);
  const [bankIban, setBankIban] = useState(initial.bankAccount?.iban ?? "");
  const [bankAutoCharge, setBankAutoCharge] = useState(initial.bankAccount?.autoCharge ?? false);
  const [, setBankTick] = useState(0);
  const { notify } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const toggleRemindersEnabled = () => {
    const enabled = !reminders.enabled;
    setReminders((r) => ({ ...r, enabled }));
    notify(enabled ? "Recordatorios activados" : "Recordatorios desactivados", enabled ? "success" : "info");
  };

  const toggleReminder = (key: ReminderKey) => {
    setReminders((r) => ({ ...r, [key]: !r[key] }));
  };

  const profile = getClientProfile();

  const bankAccount = profile.bankAccount;

  const lastAccess = accessRecords[0];

  const personalTrainer = getPersonalTrainerInfo(currentClient.id);
  const trainer = personalTrainer.trainerId ? findEmployeeById(personalTrainer.trainerId) : undefined;

  const contractTrainer = () => {
    requestPersonalTrainer(currentClient.id);
    setPtTick((t) => t + 1);
    notify("Entrenador personal solicitado");
  };

  const cancelTrainer = () => {
    cancelPersonalTrainer(currentClient.id);
    setCancelTrainerOpen(false);
    setPtTick((t) => t + 1);
    notify("Te has dado de baja del entrenador personal", "info");
  };

  const saveProfile = () => {
    const emailChanged = email.trim().toLowerCase() !== profile.email.trim().toLowerCase();
    updateClientProfile({
      name,
      email,
      phone,
      address,
      city,
      postalCode,
      ...(emailChanged ? { emailVerified: false } : {}),
    });
    setEditOpen(false);
    notify(emailChanged ? "Perfil actualizado. Verifica tu nuevo correo." : "Perfil actualizado");
  };

  const startVerify = () => {
    setVerifyCode("");
    setVerifyOpen(true);
    notify("Te hemos enviado un código de verificación a tu correo");
  };

  const confirmVerify = () => {
    if (verifyCode.trim().length < 4) {
      notify("Introduce el código de verificación", "warning");
      return;
    }
    verifyClientEmail();
    setVerifyOpen(false);
    notify("Correo verificado correctamente");
  };

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notify("Rellena todos los campos", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("Las contraseñas no coinciden", "error");
      return;
    }
    if (newPassword.length < 6) {
      notify("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    notify("Contraseña cambiada correctamente");
  };

  const saveActivity = () => {
    updateClientProfile({
      weight: Number(weight) || profile.weight,
      targetWeight: Number(targetWeight) || profile.targetWeight,
      goal,
      frequency,
    });
    setActivityOpen(false);
    notify("Actividad actualizada");
  };

  const openActivity = () => {
    setWeight(String(profile.weight));
    setTargetWeight(String(profile.targetWeight));
    setGoal(profile.goal);
    setFrequency(profile.frequency);
    setActivityOpen(true);
  };

  const openBank = () => {
    const acc = getClientProfile().bankAccount;
    setBankHolder(acc?.holder ?? profile.name);
    setBankIban(acc?.iban ?? "");
    setBankAutoCharge(acc?.autoCharge ?? false);
    setBankOpen(true);
  };

  const saveBank = () => {
    if (!bankHolder.trim()) {
      notify("Indica el titular de la cuenta", "error");
      return;
    }
    if (!isValidIban(bankIban)) {
      notify("El IBAN no es válido", "error");
      return;
    }
    updateClientProfile({
      bankAccount: {
        holder: bankHolder.trim(),
        iban: bankIban.replace(/\s+/g, "").toUpperCase(),
        autoCharge: bankAutoCharge,
      },
    });
    setBankOpen(false);
    setBankTick((t) => t + 1);
    notify("Datos bancarios guardados");
  };

  const removeBank = () => {
    updateClientProfile({ bankAccount: undefined });
    setBankOpen(false);
    setBankTick((t) => t + 1);
    notify("Cuenta bancaria eliminada", "info");
  };

  const goals = ["Hipertrofia", "Fuerza", "Resistencia", "Pérdida de grasa", "CrossFit", "Salud general", "Tonificación"];
  const freqs = ["1 día/semana", "2 días/semana", "3 días/semana", "4 días/semana", "5 días/semana", "6 días/semana", "7 días/semana"];

  return (
    <div className="space-y-5">
      <Card>
        <CardBody className="flex flex-col items-center py-6 sm:flex-row sm:items-center sm:gap-6">
          <AvatarUpload
            initials={currentClient.initials}
            src={profile.avatar}
            size="lg"
            onSelect={(dataUrl) => {
              updateClientProfile({ avatar: dataUrl });
              notify("Foto de perfil actualizada");
            }}
            onRemove={() => {
              updateClientProfile({ avatar: undefined });
              notify("Foto de perfil eliminada", "info");
            }}
            onError={(message) => notify(message, "error")}
          />
          <div className="mt-4 text-center sm:mt-0 sm:text-left sm:flex-1">
            <h1 className="text-xl font-extrabold text-stadio-black dark:text-white">{profile.name}</h1>
            <p className="text-sm text-stadio-gray dark:text-white/50">{profile.email}</p>
            <p className="text-sm text-stadio-gray dark:text-white/50">{profile.phone}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-stadio-gray dark:text-white/50">
              <span>{profile.sex}</span>
              <span>·</span>
              <span>{profile.birthDate}</span>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="mt-4 sm:mt-0" onClick={() => setEditOpen(true)}>
            <Pencil size={16} /> EDITAR PERFIL
          </Button>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardBody className="p-4">
            <Activity size={18} className="text-stadio-red" />
            <p className="mt-2 text-lg font-extrabold text-stadio-black dark:text-white">Actividad</p>
            <div className="mt-2 space-y-1 text-xs text-stadio-gray-dark dark:text-white/60">
              <p>Objetivo: <span className="font-semibold text-stadio-black dark:text-white">{profile.goal}</span></p>
              <p>Peso actual: <span className="font-semibold text-stadio-black dark:text-white">{profile.weight.toLocaleString("es-ES")} kg</span></p>
              <p>Peso objetivo: <span className="font-semibold text-stadio-black dark:text-white">{profile.targetWeight.toLocaleString("es-ES")} kg</span></p>
              <p>Frecuencia: <span className="font-semibold text-stadio-black dark:text-white">{profile.frequency}</span></p>
            </div>
            <button onClick={openActivity} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-stadio-red hover:underline">
              Editar actividad <ArrowRight size={13} />
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <DoorOpen size={18} className="text-stadio-red" />
            <p className="mt-2 text-lg font-extrabold text-stadio-black dark:text-white">Accesos</p>
            <div className="mt-2 space-y-1 text-xs text-stadio-gray-dark dark:text-white/60">
              <p>12 accesos en agosto</p>
              <p>Último: {lastAccess.day} {lastAccess.date} · {lastAccess.entry}</p>
            </div>
            <Link to="/client/profile/access" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-stadio-red hover:underline">
              Ver accesos <ArrowRight size={13} />
            </Link>
          </CardBody>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardBody className="p-4">
            <CreditCard size={18} className="text-stadio-red" />
            <p className="mt-2 text-lg font-extrabold text-stadio-black dark:text-white">Cuotas</p>
            <div className="mt-2 space-y-1 text-xs text-stadio-gray-dark dark:text-white/60">
              <p>Agosto 2026 · <span className="font-semibold text-stadio-green">Pagada</span></p>
              <p>
                {profile.bankAccount?.autoCharge
                  ? "Cobro automático activo"
                  : "Próximo cargo: 01/09/2026"}
              </p>
            </div>
            <Link to="/client/profile/payments" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-stadio-red hover:underline">
              Ver historial <ArrowRight size={13} />
            </Link>
          </CardBody>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardBody className="p-4">
            <CalendarDays size={18} className="text-stadio-red" />
            <p className="mt-2 text-lg font-extrabold text-stadio-black dark:text-white">Reservas</p>
            <div className="mt-2 space-y-1 text-xs text-stadio-gray-dark dark:text-white/60">
              <p>{getBookings().length} reservas en 2026</p>
              <p>Próxima: <span className="font-semibold text-stadio-black dark:text-white">{getBookings()[0].className} · {getBookings()[0].date}</span></p>
            </div>
            <Link to="/client/profile/bookings" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-stadio-red hover:underline">
              Ver historial <ArrowRight size={13} />
            </Link>
          </CardBody>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader
            title="CORREO ELECTRÓNICO"
            action={
              <Badge variant={profile.emailVerified ? "success" : "warning"} dot>
                {profile.emailVerified ? "Verificado" : "Sin verificar"}
              </Badge>
            }
          />
          <CardBody>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${profile.emailVerified ? "bg-stadio-green-bg text-stadio-green dark:bg-green-950/50" : "bg-stadio-amber/10 text-stadio-amber"}`}>
                  {profile.emailVerified ? <ShieldCheck size={20} /> : <Mail size={20} />}
                </span>
                <div>
                  <p className="text-sm font-bold text-stadio-black dark:text-white">{profile.email}</p>
                  <p className="text-xs text-stadio-gray dark:text-white/50">
                    {profile.emailVerified
                      ? "Tu correo está verificado. Ya puedes reservar clases y pagar tu cuota."
                      : "Verifica tu correo para poder reservar clases y pagar tu cuota (RF-97)."}
                  </p>
                </div>
              </div>
              {!profile.emailVerified && (
                <Button size="sm" onClick={startVerify}>VERIFICAR CORREO</Button>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader
            title="DATOS BANCARIOS"
            action={
              <Badge variant={bankAccount ? (bankAccount.autoCharge ? "success" : "neutral") : "warning"} dot>
                {bankAccount
                  ? bankAccount.autoCharge
                    ? "Cobro automático activo"
                    : "Cuenta configurada"
                  : "Sin configurar"}
              </Badge>
            }
          />
          <CardBody>
            {bankAccount ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-stadio-red/10 text-stadio-red">
                    <Landmark size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{bankAccount.holder}</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">{maskIban(bankAccount.iban)}</p>
                    <p className="mt-0.5 text-xs text-stadio-gray dark:text-white/50">
                      {bankAccount.autoCharge
                        ? "La cuota se cobrará automáticamente en la fecha de vencimiento."
                        : "Cobro automático desactivado: paga la cuota manualmente."}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={openBank}>
                  <Pencil size={15} /> EDITAR
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-stadio-amber/10 text-stadio-amber">
                    <Landmark size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">Sin cuenta bancaria</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">
                      Añade tu cuenta para activar el cobro automático de la cuota.
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={openBank}>AÑADIR CUENTA</Button>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader
            title="ENTRENADOR PERSONAL"
            action={
              <Badge variant={trainer ? "success" : personalTrainer.requested ? "warning" : "neutral"} dot>
                {trainer ? "Asignado" : personalTrainer.requested ? "Pendiente de asignación" : "No contratado"}
              </Badge>
            }
          />
          <CardBody>
            {trainer ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials={trainer.initials} color={trainer.color} size="md" />
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">{trainer.name}</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">{trainer.email} · {trainer.phone}</p>
                    {personalTrainer.since && (
                      <p className="mt-0.5 text-xs text-stadio-gray dark:text-white/50">
                        Entrenador personal desde {personalTrainer.since}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="danger" size="sm" onClick={() => setCancelTrainerOpen(true)}>
                  DARSE DE BAJA
                </Button>
              </div>
            ) : personalTrainer.requested ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-stadio-amber/10 text-stadio-amber">
                    <UserCheck size={20} />
                  </span>
                  <p className="text-sm text-stadio-gray-dark dark:text-white/60">
                    Has solicitado un entrenador personal. En breve se te asignará uno.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCancelTrainerOpen(true)}>
                  CANCELAR SOLICITUD
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-stadio-red/10 text-stadio-red">
                    <UserCheck size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">Contrata un entrenador personal</p>
                    <p className="text-xs text-stadio-gray dark:text-white/50">
                      Seguimiento y entrenamientos personalizados adaptados a ti.
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={contractTrainer}>
                  CONTRATAR ENTRENADOR PERSONAL
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardHeader title="CONFIGURACIÓN" action={<Settings size={18} className="text-stadio-gray" />} />
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-white/10 p-4">
              <div className="flex items-center gap-3">
                <Palette size={20} className="text-stadio-gray" />
                <div>
                  <p className="text-sm font-bold text-stadio-black dark:text-white">Modo oscuro</p>
                  <p className="text-xs text-stadio-gray">Cambia la apariencia de la aplicación</p>
                </div>
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
            <div className="rounded-xl border border-gray-100 dark:border-white/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-stadio-gray" />
                  <div>
                    <p className="text-sm font-bold text-stadio-black dark:text-white">Recordatorios</p>
                    <p className="text-xs text-stadio-gray">Notificaciones de entrenamientos y clases</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={reminders.enabled ? "success" : "neutral"}>
                    {reminders.enabled ? "Activas" : "Desactivadas"}
                  </Badge>
                  <ToggleSwitch checked={reminders.enabled} onChange={toggleRemindersEnabled} label="Activar recordatorios" />
                </div>
              </div>

              {reminders.enabled && (
                <div className="mt-3 space-y-1 border-t border-gray-100 pt-3 dark:border-white/10">
                  {REMINDER_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <div key={opt.key} className="flex items-center justify-between gap-3 py-2">
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} className="text-stadio-gray" />
                          <div>
                            <p className="text-sm font-semibold text-stadio-black dark:text-white">{opt.label}</p>
                            <p className="text-xs text-stadio-gray">{opt.description}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          checked={reminders[opt.key]}
                          onChange={() => toggleReminder(opt.key)}
                          label={opt.label}
                        />
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <div>
                      <p className="text-sm font-semibold text-stadio-black dark:text-white">Antelación</p>
                      <p className="text-xs text-stadio-gray">Con cuánto tiempo avisarte</p>
                    </div>
                    <Select value={reminderLead} onChange={(e) => setReminderLead(e.target.value)} className="w-36">
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="1440">1 día</option>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-3">
          <CardBody className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-stadio-red" />
              <p className="text-lg font-extrabold text-stadio-black dark:text-white">Cambiar contraseña</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Contraseña actual">
                <Input type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
              </Field>
              <Field label="Nueva contraseña">
                <Input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
              </Field>
              <Field label="Confirmar contraseña">
                <Input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </Field>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-stadio-gray hover:text-stadio-black dark:hover:text-white transition-colors"
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

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar perfil">
        <div className="space-y-3">
          <Field label="Nombre">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Teléfono">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sexo">
              <Input value={initial.sex} disabled className="bg-gray-50 dark:bg-white/5" />
            </Field>
            <Field label="Fecha de nacimiento">
              <Input value={initial.birthDate} disabled className="bg-gray-50 dark:bg-white/5" />
            </Field>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-white/10 p-3">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-stadio-red" />
              <p className="text-sm font-bold text-stadio-black dark:text-white">Dirección</p>
            </div>
            <div className="space-y-3">
              <Field label="Dirección">
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, piso" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Localidad">
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </Field>
                <Field label="Código postal">
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </Field>
              </div>
            </div>
          </div>
          <Button className="w-full" onClick={saveProfile}>GUARDAR CAMBIOS</Button>
        </div>
      </Modal>

      <Modal open={activityOpen} onClose={() => setActivityOpen(false)} title="Editar actividad">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Peso actual (kg)">
              <div className="relative">
                <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
                <Scale size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
              </div>
            </Field>
            <Field label="Peso objetivo (kg)">
              <Input type="number" step="0.1" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} />
            </Field>
          </div>
          <Field label="Objetivo">
            <div className="relative">
              <Select value={goal} onChange={(e) => setGoal(e.target.value)} className="pr-9">
                {goals.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
              <Target size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
            </div>
          </Field>
          <Field label="Frecuencia de entrenamiento">
            <Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              {freqs.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </Select>
          </Field>
          <p className="text-xs text-stadio-gray dark:text-white/50">
            El peso, el objetivo y la frecuencia se usan para actualizar tu análisis de progreso y la IA.
          </p>
          <Button className="w-full" onClick={saveActivity}>GUARDAR CAMBIOS</Button>
        </div>
      </Modal>

      <Modal open={bankOpen} onClose={() => setBankOpen(false)} title="Datos bancarios">
        <div className="space-y-3">
          <Field label="Titular de la cuenta">
            <Input value={bankHolder} onChange={(e) => setBankHolder(e.target.value)} placeholder="Nombre y apellidos" />
          </Field>
          <Field label="IBAN">
            <Input value={bankIban} onChange={(e) => setBankIban(e.target.value)} placeholder="ES91 2100 0418 4502 0005 1332" />
          </Field>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-4">
            <div className="pr-3">
              <p className="text-sm font-bold text-stadio-black dark:text-white">Cobro automático</p>
              <p className="text-xs text-stadio-gray dark:text-white/50">
                Autorizo el cargo de la cuota mensual en la fecha de vencimiento.
              </p>
            </div>
            <ToggleSwitch checked={bankAutoCharge} onChange={() => setBankAutoCharge((v) => !v)} label="Cobro automático" />
          </div>
          <p className="text-xs text-stadio-gray dark:text-white/50">
            La domiciliación se simula en el front hasta integrar la pasarela de pago.
          </p>
          <Button className="w-full" onClick={saveBank}>GUARDAR DATOS BANCARIOS</Button>
          {bankAccount && (
            <Button variant="ghost" className="w-full" onClick={removeBank}>
              <Trash2 size={15} /> ELIMINAR CUENTA
            </Button>
          )}
        </div>
      </Modal>

      <Modal open={verifyOpen} onClose={() => setVerifyOpen(false)} title="Verificar correo electrónico">
        <div className="space-y-3">
          <p className="text-sm text-stadio-gray dark:text-white/60">
            Hemos enviado un código de verificación a{" "}
            <span className="font-semibold text-stadio-black dark:text-white">{profile.email}</span>. Introdúcelo para verificar tu correo.
          </p>
          <Field label="Código de verificación">
            <Input value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} placeholder="123456" />
          </Field>
          <Button className="w-full" onClick={confirmVerify}>CONFIRMAR CÓDIGO</Button>
          <Button variant="ghost" className="w-full" onClick={() => notify("Código reenviado a tu correo")}>
            REENVIAR CÓDIGO
          </Button>
        </div>
      </Modal>

      <Confirmation
        open={cancelTrainerOpen}
        title="Darse de baja del entrenador personal"
        message="¿Seguro que quieres darte de baja del entrenador personal? Dejarás de tener seguimiento personalizado."
        confirmLabel="DARME DE BAJA"
        danger
        onConfirm={cancelTrainer}
        onCancel={() => setCancelTrainerOpen(false)}
      />
    </div>
  );
}