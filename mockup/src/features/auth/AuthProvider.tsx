import { useState } from "react";
import type { ReactNode } from "react";
import type { Role, TrainerProfile } from "../../types";
import { AuthContext } from "./authContext";

const ROLE_KEY = "stadio.role";
const PROFILE_KEY = "stadio.trainerProfile";

function isRole(value: unknown): value is Role {
  return value === "client" || value === "trainer" || value === "admin";
}

function isTrainerProfile(value: unknown): value is TrainerProfile {
  return value === "entrenador" || value === "monitor";
}

function readStored<T>(key: string, check: (v: unknown) => v is T): T | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(key);
    return check(value) ? value : null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Punto de entrada del rol autenticado según su destino (RF-03). */
export function AuthProvider({ children }: { children: ReactNode }) {
  // El rol se persiste para mantener la sesión al recargar la página (RF-01/RF-05).
  const [role, setRole] = useState<Role | null>(() => readStored(ROLE_KEY, isRole));
  // Sub-rol del personal docente (entrenador personal vs monitor/instructor).
  const [trainerProfile, setTrainerProfileState] = useState<TrainerProfile | null>(() =>
    readStored(PROFILE_KEY, isTrainerProfile)
  );

  const login = (r: Role, profile?: TrainerProfile) => {
    setRole(r);
    writeStored(ROLE_KEY, r);

    if (r === "trainer") {
      const next = profile ?? trainerProfile ?? "entrenador";
      setTrainerProfileState(next);
      writeStored(PROFILE_KEY, next);
    } else {
      setTrainerProfileState(null);
      writeStored(PROFILE_KEY, null);
    }
  };

  const setTrainerProfile = (profile: TrainerProfile) => {
    setTrainerProfileState(profile);
    writeStored(PROFILE_KEY, profile);
  };

  const logout = () => {
    setRole(null);
    setTrainerProfileState(null);
    writeStored(ROLE_KEY, null);
    writeStored(PROFILE_KEY, null);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        trainerProfile: role === "trainer" ? trainerProfile ?? "entrenador" : null,
        login,
        setTrainerProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
