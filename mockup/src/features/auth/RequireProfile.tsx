import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { TrainerProfile } from "../../types";
import { useAuth } from "./authContext";

interface RequireProfileProps {
  profile: TrainerProfile;
  children: ReactNode;
}

/**
 * Restringe una sección del portal de entrenador al sub-rol del personal docente:
 * el entrenador personal solo accede a clientes y rutinas; el monitor/instructor,
 * a las clases. El acceso directo por URL queda bloqueado (RF-05).
 */
export function RequireProfile({ profile, children }: RequireProfileProps) {
  const { role, trainerProfile } = useAuth();

  if (role === "trainer" && trainerProfile !== profile) {
    return <Navigate to="/trainer/dashboard" replace />;
  }

  return <>{children}</>;
}
