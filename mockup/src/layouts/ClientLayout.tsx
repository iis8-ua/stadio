import { LayoutDashboard, Dumbbell, CalendarDays, TrendingUp, User } from "lucide-react";
import { LayoutShell } from "./LayoutShell";

const navItems = [
  { to: "/client/dashboard", label: "Inicio", icon: LayoutDashboard },
  { to: "/client/training", label: "Entrenamiento", icon: Dumbbell },
  { to: "/client/progress", label: "Progreso", icon: TrendingUp },
  { to: "/client/bookings", label: "Reservas", icon: CalendarDays, permission: "reservas.reservar" },
  { to: "/client/profile", label: "Perfil", icon: User },
];

export function ClientLayout() {
  return (
    <LayoutShell
      navItems={navItems}
      title="STADIO"
      subtitle="Client Portal"
      userName="Israel"
      userRole="Cliente"
      initials="IS"
      color="#2563eb"
      profileTo="/client/profile"
    />
  );
}
