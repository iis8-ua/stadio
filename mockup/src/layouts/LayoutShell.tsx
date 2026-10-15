import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { SidebarContent } from "../components/Sidebar";
import type { NavItem } from "../components/Sidebar";
import { NotificationBell } from "../components/NotificationBell";
import { RouteAsync, ErrorBoundary } from "../components/RouteAsync";
import { ProfileMenu } from "../components/ProfileMenu";
import { ChatbotWidget } from "../components/ChatbotWidget";
import { Confirmation } from "../components/Confirmation";
import { buildNotifications } from "../data/notifications";
import { useAuth } from "../features/auth/authContext";
import { useRoles } from "../features/settings/rolePermissions";
import { useClientProfile } from "../features/profile/clientProfile";
import { useUserProfile } from "../features/profile/userProfile";
import { useTheme } from "../hooks/useTheme";
import { useSwipe } from "../hooks/useSwipe";
import { useIdleTimer } from "../hooks/useIdleTimer";

interface LayoutShellProps {
  navItems: NavItem[];
  title: string;
  subtitle?: string;
  userName: string;
  userRole: string;
  initials: string;
  color: string;
  profileTo: string;
  headerExtra?: ReactNode;
}

export function LayoutShell({
  navItems,
  title,
  subtitle,
  userName,
  userRole,
  initials,
  color,
  profileTo,
  headerExtra,
}: LayoutShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { role, logout, trainerProfile: activeTrainerProfile } = useAuth();
  const clientProfile = useClientProfile();
  const trainerProfile = useUserProfile("trainer");
  const adminProfile = useUserProfile("admin");
  const avatar =
    role === "client"
      ? clientProfile.avatar
      : role === "trainer"
        ? trainerProfile.avatar
        : role === "admin"
          ? adminProfile.avatar
          : undefined;
  // Se suscribe a los permisos para reaccionar a los cambios de configuración (RF-81).
  const roleConfigs = useRoles();
  const visibleNav = useMemo(() => {
    const permissions = roleConfigs.find((r) => r.id === role)?.permissions ?? [];
    return navItems.filter((item) => {
      if (item.permission && !permissions.includes(item.permission)) return false;
      if (item.profiles && role === "trainer") {
        return activeTrainerProfile !== null && item.profiles.includes(activeTrainerProfile);
      }
      return true;
    });
  }, [navItems, role, roleConfigs, activeTrainerProfile]);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useMemo(() => buildNotifications(role), [role]);
  const drawerSwipe = useSwipe(() => setDrawerOpen(false), () => {});

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [idleWarning, setIdleWarning] = useState(false);
  const resetIdle = useIdleTimer({
    timeoutMs: 30 * 60 * 1000,
    warnMs: 60 * 1000,
    onWarn: () => setIdleWarning(true),
    onTimeout: handleLogout,
    enabled: role !== null,
  });

  const sidebar = (
    <SidebarContent
      items={visibleNav}
      onNavigate={() => setDrawerOpen(false)}
      onLogout={handleLogout}
      userName={userName}
      userRole={userRole}
      initials={initials}
      color={color}
      avatar={avatar}
    />
  );

  return (
    <div className="min-h-screen bg-stadio-gray-light dark:bg-stadio-black">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-stadio-red focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-100 dark:border-white/10 bg-white dark:bg-stadio-black lg:block">
        {sidebar}
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-xl dark:bg-stadio-black"
            {...drawerSwipe}
          >
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-gray-100 pt-[env(safe-area-inset-top)] dark:border-white/10 bg-stadio-gray-light/80 dark:bg-stadio-black/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/70 hover:bg-stadio-gray-light dark:hover:bg-white/10 lg:hidden"
                aria-label="Abrir menú"
                aria-expanded={drawerOpen}
              >
                <Menu size={22} />
              </button>
              <div>
                <p className="text-sm sm:text-base font-extrabold tracking-tight text-stadio-black dark:text-white">
                  {title}
                </p>
                {subtitle && (
                  <p className="hidden sm:block text-xs text-stadio-gray dark:text-white/40">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {headerExtra}
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-stadio-gray-dark dark:text-white/70 hover:bg-stadio-gray-light dark:hover:bg-white/10"
                aria-label="Cambiar tema"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <NotificationBell notifications={notifications} />
              <ProfileMenu
                initials={initials}
                color={color}
                avatar={avatar}
                name={userName}
                role={userRole}
                profileTo={profileTo}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        <main id="contenido" className="px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8 lg:pt-8 lg:pb-8 max-w-7xl mx-auto">
          <ErrorBoundary key={location.pathname}>
            <RouteAsync>
              <Outlet />
            </RouteAsync>
          </ErrorBoundary>
        </main>
      </div>

      {role === "client" && <ChatbotWidget />}

      <Confirmation
        open={idleWarning}
        title="Sesión a punto de expirar"
        message="Has estado inactivo un tiempo. Tu sesión se cerrará automáticamente por seguridad."
        confirmLabel="Seguir conectado"
        cancelLabel="Cerrar sesión"
        onConfirm={() => {
          setIdleWarning(false);
          resetIdle();
        }}
        onCancel={handleLogout}
      />
    </div>
  );
}
