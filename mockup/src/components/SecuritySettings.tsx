import { useState } from "react";
import { KeyRound, Monitor, Smartphone, Fingerprint } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Field, Input, Select } from "./Input";
import { ToggleSwitch } from "./ToggleSwitch";
import { useToast } from "../hooks/useToast";

const PASSWORD_RULES = [
  { key: "minLength", label: "Longitud mínima de 8 caracteres" },
  { key: "mixedCase", label: "Mayúsculas y minúsculas" },
  { key: "numbers", label: "Al menos un número" },
  { key: "symbols", label: "Al menos un símbolo (!@#$)" },
] as const;

type PolicyKey = (typeof PASSWORD_RULES)[number]["key"];

interface Session {
  id: string;
  device: string;
  icon: typeof Monitor;
  location: string;
  lastActive: string;
  current: boolean;
}

const INITIAL_SESSIONS: Session[] = [
  { id: "s1", device: "Chrome · macOS", icon: Monitor, location: "Alicante, ES", lastActive: "Ahora mismo", current: true },
  { id: "s2", device: "Safari · iPhone 15", icon: Smartphone, location: "Alicante, ES", lastActive: "Hace 2 h", current: false },
  { id: "s3", device: "Firefox · Windows", icon: Monitor, location: "Valencia, ES", lastActive: "Ayer", current: false },
];

export function SecuritySettings() {
  const { notify } = useToast();
  const [twoFactor, setTwoFactor] = useState(true);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [autoLogout, setAutoLogout] = useState("30");
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [policy, setPolicy] = useState<Record<PolicyKey, boolean>>({
    minLength: true,
    mixedCase: true,
    numbers: true,
    symbols: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");

  const score = PASSWORD_RULES.filter((r) => policy[r.key]).length;
  const strength: { label: string; variant: "error" | "warning" | "success"; bar: string } =
    score <= 1
      ? { label: "Débil", variant: "error", bar: "bg-stadio-red" }
      : score === 2
        ? { label: "Media", variant: "warning", bar: "bg-stadio-amber" }
        : score === 3
          ? { label: "Fuerte", variant: "success", bar: "bg-stadio-green" }
          : { label: "Muy fuerte", variant: "success", bar: "bg-stadio-green" };

  const togglePolicy = (key: PolicyKey) => {
    setPolicy((p) => ({ ...p, [key]: !p[key] }));
  };

  const closeSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    setSessions((list) => list.filter((s) => s.id !== id));
    if (session) notify(`Sesión de ${session.device} cerrada`, "info");
  };

  const randomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const part = () =>
      Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${part()}-${part()}`;
  };

  const openRecovery = () => {
    setRecoveryCodes((codes) => (codes.length ? codes : Array.from({ length: 8 }, randomCode)));
    setRecoveryOpen(true);
  };

  const regenerateRecovery = () => {
    setRecoveryCodes(Array.from({ length: 8 }, randomCode));
    notify("Códigos de recuperación regenerados");
  };

  const closePasswordModal = () => {    setShowPassword(false);
    setPassword({ current: "", next: "", confirm: "" });
    setPasswordError("");
  };

  const savePassword = () => {
    const minLength = policy.minLength ? 8 : 4;
    if (!password.current || !password.next || !password.confirm) {
      setPasswordError("Rellena todos los campos.");
    } else if (password.next.length < minLength) {
      setPasswordError(`La nueva contraseña debe tener al menos ${minLength} caracteres.`);
    } else if (password.next !== password.confirm) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
    } else {
      notify("Contraseña actualizada", "success");
      closePasswordModal();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 dark:border-white/10">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stadio-red/10 text-stadio-red">
          <Fingerprint size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-stadio-black dark:text-white">Verificación en dos pasos</p>
          <p className="text-xs text-stadio-gray dark:text-white/50">
            {twoFactor ? "Activa · se pide un código al iniciar sesión" : "Desactivada · menos segura"}
          </p>
        </div>
        <ToggleSwitch
          checked={twoFactor}
          onChange={() => {
            setTwoFactor((v) => !v);
            notify(twoFactor ? "Verificación en dos pasos desactivada" : "Verificación en dos pasos activada", twoFactor ? "info" : "success");
          }}
          label="Verificación en dos pasos"
        />
      </div>

      {twoFactor && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 dark:border-white/10">
          <div>
            <p className="text-sm font-bold text-stadio-black dark:text-white">Códigos de recuperación</p>
            <p className="text-xs text-stadio-gray dark:text-white/50">
              Úsalos si pierdes el acceso a tu app de autenticación (cada uno sirve una vez)
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={openRecovery}>
            <KeyRound size={14} /> {recoveryCodes.length ? "VER CÓDIGOS" : "GENERAR"}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 p-3 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-stadio-black dark:text-white">Política de contraseñas</p>
          <Badge variant={strength.variant}>{strength.label}</Badge>
        </div>
        <div className="mt-3 space-y-2">
          {PASSWORD_RULES.map((rule) => (
            <div key={rule.key} className="flex items-center justify-between gap-3">
              <span className="text-xs text-stadio-gray-dark dark:text-white/60">{rule.label}</span>
              <ToggleSwitch checked={policy[rule.key]} onChange={() => togglePolicy(rule.key)} label={rule.label} />
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < score ? strength.bar : "bg-stadio-gray-light dark:bg-white/10"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 dark:border-white/10">
        <div>
          <p className="text-sm font-bold text-stadio-black dark:text-white">Cierre de sesión automático</p>
          <p className="text-xs text-stadio-gray dark:text-white/50">Tras un periodo de inactividad</p>
        </div>
        <Select value={autoLogout} onChange={(e) => setAutoLogout(e.target.value)} className="w-36">
          <option value="15">15 minutos</option>
          <option value="30">30 minutos</option>
          <option value="60">1 hora</option>
          <option value="0">Nunca</option>
        </Select>
      </div>

      <Button variant="secondary" className="w-full" onClick={() => setShowPassword(true)}>
        <KeyRound size={16} /> Cambiar contraseña
      </Button>

      <div className="rounded-xl border border-gray-100 p-3 dark:border-white/10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-stadio-black dark:text-white">Sesiones activas</p>
          <Badge variant="neutral">{sessions.length}</Badge>
        </div>
        <div className="mt-2 space-y-2">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2 dark:border-white/10">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-stadio-gray-light text-stadio-gray-dark dark:bg-white/10 dark:text-white/60">
                  <Icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-stadio-black dark:text-white">
                    {s.device}
                    {s.current && <span className="ml-1 font-semibold text-stadio-green">· Actual</span>}
                  </p>
                  <p className="text-[11px] text-stadio-gray dark:text-white/40">
                    {s.location} · {s.lastActive}
                  </p>
                </div>
                {!s.current && (
                  <button
                    type="button"
                    onClick={() => closeSession(s.id)}
                    className="text-xs font-semibold text-stadio-red hover:underline"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={showPassword} onClose={closePasswordModal} title="Cambiar contraseña">
        <div className="space-y-3">
          <Field label="Contraseña actual">
            <Input
              type="password"
              value={password.current}
              onChange={(e) => setPassword((p) => ({ ...p, current: e.target.value }))}
            />
          </Field>
          <Field label="Nueva contraseña">
            <Input
              type="password"
              value={password.next}
              onChange={(e) => setPassword((p) => ({ ...p, next: e.target.value }))}
            />
          </Field>
          <Field label="Repetir nueva contraseña">
            <Input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
            />
          </Field>
          {passwordError && <p className="text-xs font-semibold text-stadio-red">{passwordError}</p>}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={closePasswordModal}>Cancelar</Button>
            <Button onClick={savePassword}>Guardar</Button>
          </div>
        </div>
      </Modal>

      <Modal open={recoveryOpen} onClose={() => setRecoveryOpen(false)} title="Códigos de recuperación">
        <div className="space-y-3">
          <p className="text-sm text-stadio-gray dark:text-white/60">
            Guarda estos códigos en un lugar seguro. Cada uno permite acceder una sola vez si pierdes la app de autenticación.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {recoveryCodes.map((c) => (
              <code
                key={c}
                className="rounded-lg border border-gray-100 dark:border-white/10 bg-stadio-gray-light dark:bg-white/5 px-3 py-2 text-center text-xs font-bold text-stadio-black dark:text-white"
              >
                {c}
              </code>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={regenerateRecovery}>REGENERAR</Button>
            <Button className="flex-1" onClick={() => setRecoveryOpen(false)}>HECHO</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
