import { LayoutDashboard, Users, ClipboardList, CalendarDays, Clock, User, Sparkles } from "lucide-react";
import { LayoutShell } from "./LayoutShell";
import type { NavItem } from "../components/Sidebar";
import { useAuth, trainerProfileLabel } from "../features/auth/authContext";
import type { TrainerProfile } from "../types";

const navItems: NavItem[] = [
  { to: "/trainer/dashboard", label: "Inicio", icon: LayoutDashboard },
  { to: "/trainer/clients", label: "Clientes", icon: Users, permission: "clientes.ver", profiles: ["entrenador"] },
  { to: "/trainer/workouts", label: "Rutinas", icon: ClipboardList, profiles: ["entrenador"] },
  { to: "/trainer/classes", label: "Clases", icon: CalendarDays, permission: "clases.gestionar", profiles: ["monitor"] },
  { to: "/trainer/schedule", label: "Horarios", icon: Clock },
  { to: "/trainer/ai", label: "IA", icon: Sparkles, permission: "ia.usar" },
  { to: "/trainer/profile", label: "Perfil", icon: User },
];

export function TrainerLayout() {
  const { trainerProfile, setTrainerProfile } = useAuth();

  // Conmutador de perfil del personal docente (entrenador personal / monitor).
  const profileSwitch = (
    <label className="hidden items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 dark:border-white/15 dark:bg-white/5 sm:flex">
      <span className="text-[10px] font-bold uppercase tracking-wider text-stadio-gray">Demo</span>
      <select
        value={trainerProfile ?? "entrenador"}
        onChange={(e) => setTrainerProfile(e.target.value as TrainerProfile)}
        className="bg-transparent text-xs font-semibold text-stadio-black focus:outline-none dark:text-white"
        aria-label="Cambiar perfil del personal docente (demo)"
        title="Ayuda de demostración: en producción el perfil es único por empleado"
      >
        <option value="entrenador">Entrenador personal</option>
        <option value="monitor">Monitor/instructor</option>
      </select>
    </label>
  );

  return (
    <LayoutShell
      navItems={navItems}
      title="STADIO"
      subtitle="Coach Portal"
      userName="Carlos"
      userRole={trainerProfileLabel(trainerProfile)}
      initials="CA"
      color="#d71920"
      profileTo="/trainer/profile"
      headerExtra={profileSwitch}
    />
  );
}
