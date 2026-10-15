import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Moon, Sun, User as UserIcon, ShieldCheck, Dumbbell, CalendarDays } from "lucide-react";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Field, Input } from "../components/Input";
import { useAuth, homeForRole } from "../features/auth/authContext";
import type { Role, TrainerProfile } from "../types";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../hooks/useTheme";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const { role, login } = useAuth();
  const { notify } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Si ya hay sesión activa, se redirige al espacio del rol (RF-03).
  useEffect(() => {
    if (role) navigate(homeForRole(role), { replace: true });
  }, [role, navigate]);

  const [recoverOpen, setRecoverOpen] = useState(false);
  const [recoverStep, setRecoverStep] = useState<1 | 2>(1);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const openRecover = () => {
    setRecoverEmail(email);
    setRecoverStep(1);
    setNewPass("");
    setConfirmPass("");
    setRecoverOpen(true);
  };

  const sendRecoverLink = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recoverEmail.trim())) {
      notify("Introduce un correo válido", "warning");
      return;
    }
    notify("Te hemos enviado un enlace de recuperación a tu correo");
    setRecoverStep(2);
  };

  const resetPassword = () => {
    if (newPass.length < 6) {
      notify("La contraseña debe tener al menos 6 caracteres", "warning");
      return;
    }
    if (newPass !== confirmPass) {
      notify("Las contraseñas no coinciden", "warning");
      return;
    }
    setRecoverOpen(false);
    notify("Contraseña actualizada. Ya puedes iniciar sesión");
  };

  const completeLogin = (role: Role, profile?: TrainerProfile) => {
    login(role, profile);
    if (role === "client") navigate("/client/dashboard");
    else if (role === "trainer") navigate("/trainer/dashboard");
    else navigate("/admin/dashboard");
  };

  // El administrador requiere un segundo factor (RF-96): se simula un código TOTP.
  const enterAs = (role: Role, profile?: TrainerProfile) => {
    if (role === "admin") {
      setTwoFactorCode("");
      setTwoFactorOpen(true);
      return;
    }
    completeLogin(role, profile);
  };

  const confirmTwoFactor = () => {
    if (twoFactorCode.trim().length < 4) {
      notify("Introduce el código de verificación", "warning");
      return;
    }
    setTwoFactorOpen(false);
    completeLogin("admin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enterAs("client");
  };

  const demoButtons: { key: string; role: Role; profile?: TrainerProfile; label: string; icon: typeof UserIcon }[] = [
    { key: "client", role: "client", label: "Entrar como cliente", icon: UserIcon },
    { key: "trainer-entrenador", role: "trainer", profile: "entrenador", label: "Entrar como entrenador personal", icon: Dumbbell },
    { key: "trainer-monitor", role: "trainer", profile: "monitor", label: "Entrar como monitor/instructor", icon: CalendarDays },
    { key: "admin", role: "admin", label: "Entrar como administrador", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-stadio-gray-light dark:bg-stadio-black relative flex">
      <button
        onClick={toggleTheme}
        className="absolute right-4 top-4 rounded-lg p-2 text-stadio-gray-dark dark:text-white/70 hover:bg-white/60 dark:hover:bg-white/10"
        aria-label="Cambiar tema"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="flex w-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo withText={false} size={120} />
          </div>
          <h1 className="text-center text-2xl font-extrabold tracking-tight text-stadio-black dark:text-white">
            Bienvenido de nuevo
          </h1>
          <p className="mt-1 text-center text-sm text-stadio-gray dark:text-white/50">
            Inicia sesión para continuar en STADIO
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 py-2.5 pl-10 pr-3 text-sm text-stadio-black dark:text-white placeholder:text-stadio-gray focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stadio-gray-dark dark:text-white/60">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stadio-gray" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 py-2.5 pl-10 pr-10 text-sm text-stadio-black dark:text-white placeholder:text-stadio-gray focus:outline-none focus:ring-2 focus:ring-red-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stadio-gray hover:text-stadio-gray-dark"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-stadio-gray-dark dark:text-white/60">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-stadio-red focus:ring-red-500"
                />
                Recordarme
              </label>
              <button type="button" onClick={openRecover} className="font-semibold text-stadio-red hover:underline">
                ¿Has olvidado tu contraseña?
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full">
              INICIAR SESIÓN
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="text-xs font-medium text-stadio-gray">O entra como demo</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          </div>

          <div className="space-y-2.5">
            {demoButtons.map((b) => {
              const Icon = b.icon;
              return (
                <button
                  key={b.key}
                  onClick={() => enterAs(b.role, b.profile)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 py-2.5 text-sm font-semibold text-stadio-black dark:text-white hover:border-stadio-red/40 hover:bg-stadio-gray-light dark:hover:bg-white/10 transition-colors"
                >
                  <Icon size={18} />
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Modal open={twoFactorOpen} onClose={() => setTwoFactorOpen(false)} title="Verificación en dos pasos">
        <div className="space-y-3">
          <p className="text-sm text-stadio-gray dark:text-white/60">
            Introduce el código de tu app de autenticación para entrar como administrador.
          </p>
          <Field label="Código de verificación">
            <Input value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="123456" />
          </Field>
          <Button className="w-full" onClick={confirmTwoFactor}>VERIFICAR Y ENTRAR</Button>
          <p className="text-center text-xs text-stadio-gray dark:text-white/50">Demo: sirve cualquier código de 6 dígitos.</p>
        </div>
      </Modal>

      <Modal open={recoverOpen} onClose={() => setRecoverOpen(false)} title="Recuperar contraseña">
        {recoverStep === 1 ? (
          <div className="space-y-3">
            <p className="text-sm text-stadio-gray dark:text-white/60">
              Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <Field label="Correo electrónico">
              <Input type="email" value={recoverEmail} onChange={(e) => setRecoverEmail(e.target.value)} placeholder="tu@email.com" />
            </Field>
            <Button className="w-full" onClick={sendRecoverLink}>ENVIAR ENLACE DE RECUPERACIÓN</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-stadio-gray dark:text-white/60">
              Enlace verificado. Establece tu nueva contraseña.
            </p>
            <Field label="Nueva contraseña">
              <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="••••••••" />
            </Field>
            <Field label="Confirmar contraseña">
              <Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="••••••••" />
            </Field>
            <Button className="w-full" onClick={resetPassword}>CAMBIAR CONTRASEÑA</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
