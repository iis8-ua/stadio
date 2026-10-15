import { createContext, useContext } from "react";
import type { Role, TrainerProfile } from "../../types";

export interface AuthContextValue {
  role: Role | null;
  /** Sub-rol del personal docente cuando `role === "trainer"`. */
  trainerProfile: TrainerProfile | null;
  login: (role: Role, trainerProfile?: TrainerProfile) => void;
  setTrainerProfile: (profile: TrainerProfile) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  role: null,
  trainerProfile: null,
  login: () => {},
  setTrainerProfile: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

/** Ruta inicial del espacio correspondiente a cada rol (RF-03). */
export function homeForRole(role: Role): string {
  if (role === "trainer") return "/trainer/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/client/dashboard";
}

/** Etiqueta legible del sub-rol del personal docente. */
export function trainerProfileLabel(profile: TrainerProfile | null): string {
  return profile === "monitor" ? "Monitor/instructor" : "Entrenador personal";
}
