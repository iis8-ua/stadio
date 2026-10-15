import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Role } from "../../types";
import { useAuth, homeForRole } from "./authContext";

interface RequireRoleProps {
  role: Role;
  children: ReactNode;
}

/**
 * Protege una sección (RF-05):
 * - Sin sesión → redirige al inicio de sesión.
 * - Con un rol distinto → redirige al espacio del rol autenticado.
 * El acceso directo por URL a una sección no autorizada queda bloqueado.
 */
export function RequireRole({ role, children }: RequireRoleProps) {
  const { role: currentRole } = useAuth();
  const location = useLocation();

  if (currentRole === null) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (currentRole !== role) {
    return <Navigate to={homeForRole(currentRole)} replace />;
  }

  return <>{children}</>;
}
