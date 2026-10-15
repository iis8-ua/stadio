import { useSyncExternalStore } from "react";
import type { Role } from "../../types";

/**
 * Roles y permisos (RF-81). Store en memoria que permite que los permisos
 * configurados por el administrador se apliquen al menú de la aplicación.
 */

export interface Permission {
  id: string;
  label: string;
  description: string;
  group: string;
}

export interface RolePermissionConfig {
  id: Role;
  name: string;
  description: string;
  permissions: string[];
}

export const PERMISSIONS: Permission[] = [
  { id: "clientes.ver", label: "Ver clientes", description: "Consultar fichas y datos de clientes", group: "Clientes y empleados" },
  { id: "clientes.gestionar", label: "Gestionar clientes", description: "Crear, editar y dar de baja clientes", group: "Clientes y empleados" },
  { id: "empleados.gestionar", label: "Gestionar empleados", description: "Añadir empleados y asignar horarios", group: "Clientes y empleados" },
  { id: "clases.gestionar", label: "Gestionar clases", description: "Crear y editar clases y sesiones", group: "Clases y reservas" },
  { id: "reservas.gestionar", label: "Gestionar reservas", description: "Ver y modificar reservas de clientes", group: "Clases y reservas" },
  { id: "reservas.reservar", label: "Reservar clases", description: "Apuntarse a las clases disponibles", group: "Clases y reservas" },
  { id: "accesos.ver", label: "Ver accesos", description: "Consultar entradas y salidas", group: "Accesos y cuotas" },
  { id: "accesos.gestionar", label: "Gestionar accesos", description: "Controlar tornos y registrar accesos", group: "Accesos y cuotas" },
  { id: "cuotas.ver", label: "Ver cuotas", description: "Consultar cuotas y pagos", group: "Accesos y cuotas" },
  { id: "cuotas.gestionar", label: "Gestionar pagos", description: "Registrar cobros y enviar recordatorios", group: "Accesos y cuotas" },
  { id: "analitica.ver", label: "Ver analítica", description: "Acceder a informes y métricas", group: "Analítica y configuración" },
  { id: "ia.usar", label: "Usar IA", description: "Generar recomendaciones e insights", group: "Analítica y configuración" },
  { id: "config.editar", label: "Editar configuración", description: "Modificar datos del gimnasio y horarios", group: "Analítica y configuración" },
  { id: "roles.gestionar", label: "Gestionar roles y permisos", description: "Editar los permisos de cada rol", group: "Analítica y configuración" },
];

export const PERMISSION_GROUPS = [...new Set(PERMISSIONS.map((p) => p.group))];

export const DEFAULT_ROLES: RolePermissionConfig[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Acceso total a la administración del gimnasio",
    permissions: PERMISSIONS.map((p) => p.id),
  },
  {
    id: "trainer",
    name: "Entrenador",
    description: "Gestión de clientes, clases y seguimiento",
    permissions: ["clientes.ver", "clases.gestionar", "reservas.gestionar", "accesos.ver", "cuotas.ver", "analitica.ver", "ia.usar"],
  },
  {
    id: "client",
    name: "Cliente",
    description: "Acceso a su entrenamiento, reservas y perfil",
    permissions: ["reservas.reservar", "accesos.ver", "cuotas.ver", "ia.usar"],
  },
];

let roles: RolePermissionConfig[] = DEFAULT_ROLES.map((r) => ({ ...r, permissions: [...r.permissions] }));
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeRoles(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getRoles(): RolePermissionConfig[] {
  return roles;
}

export function updateRoleConfig(id: Role, patch: { name?: string; permissions?: string[] }): void {
  roles = roles.map((r) => (r.id === id ? { ...r, ...patch } : r));
  emit();
}

/** Hook reactivo para leer la configuración de roles y permisos. */
export function useRoles(): RolePermissionConfig[] {
  return useSyncExternalStore(subscribeRoles, getRoles, getRoles);
}

/** ¿Tiene el rol el permiso indicado? Sin permiso requerido, siempre sí. */
export function hasPermission(role: Role | null, permission?: string): boolean {
  if (!permission) return true;
  if (!role) return false;
  const config = roles.find((r) => r.id === role);
  return Boolean(config?.permissions.includes(permission));
}
