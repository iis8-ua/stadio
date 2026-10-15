import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { Avatar } from "./Avatar";
import type { TrainerProfile } from "../types";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Permiso necesario para mostrar el elemento (RF-81). */
  permission?: string;
  /** Sub-rol del personal docente que puede ver el elemento (solo portal de entrenador). */
  profiles?: TrainerProfile[];
}

interface SidebarProps {
  items: NavItem[];
  onNavigate?: () => void;
  onLogout: () => void;
  userName: string;
  userRole: string;
  initials: string;
  color: string;
  avatar?: string;
}

export function SidebarContent({
  items,
  onNavigate,
  onLogout,
  userName,
  userRole,
  initials,
  avatar,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5 pb-4">
        <NavLink to="/" onClick={onNavigate}>
          <Logo />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3" aria-label="Navegación principal">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors mb-1 ${
                  isActive
                    ? "bg-stadio-red text-white shadow-sm shadow-red-200 dark:shadow-red-900/40"
                    : "text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/5 hover:text-stadio-black dark:hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 dark:border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <Avatar initials={initials} src={avatar} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-stadio-black dark:text-white">
              {userName}
            </p>
            <p className="truncate text-xs capitalize text-stadio-gray dark:text-white/40">
              {userRole}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/60 hover:bg-stadio-gray-light dark:hover:bg-white/10"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
