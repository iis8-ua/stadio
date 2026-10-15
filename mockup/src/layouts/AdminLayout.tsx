import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarDays,
  Ticket,
  DoorOpen,
  CreditCard,
  Building2,
  BarChart3,
  Sparkles,
  Settings,
  User,
} from "lucide-react";
import { LayoutShell } from "./LayoutShell";

const navItems = [
  { to: "/admin/dashboard", label: "Inicio", icon: LayoutDashboard },
  { to: "/admin/clients", label: "Clientes", icon: Users, permission: "clientes.ver" },
  { to: "/admin/employees", label: "Empleados", icon: UserCog, permission: "empleados.gestionar" },
  { to: "/admin/classes", label: "Clases", icon: CalendarDays, permission: "clases.gestionar" },
  { to: "/admin/bookings", label: "Reservas", icon: Ticket, permission: "reservas.gestionar" },
  { to: "/admin/access", label: "Accesos", icon: DoorOpen, permission: "accesos.ver" },
  { to: "/admin/payments", label: "Cuotas", icon: CreditCard, permission: "cuotas.ver" },
  { to: "/admin/facilities", label: "Instalaciones", icon: Building2 },
  { to: "/admin/analytics", label: "Analítica", icon: BarChart3, permission: "analitica.ver" },
  { to: "/admin/ai", label: "IA", icon: Sparkles, permission: "ia.usar" },
  { to: "/admin/settings", label: "Configuración", icon: Settings, permission: "config.editar" },
  { to: "/admin/profile", label: "Perfil", icon: User },
];

export function AdminLayout() {
  return (
    <LayoutShell
      navItems={navItems}
      title="STADIO"
      subtitle="Admin Portal"
      userName="Laura"
      userRole="Administración"
      initials="LA"
      color="#111111"
      profileTo="/admin/profile"
    />
  );
}
