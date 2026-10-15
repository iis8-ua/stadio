import type { Employee, EmployeeRole, Equipment, FacilityRoom, Incident } from "../types";

export const EMPLOYEE_ROLES: EmployeeRole[] = [
  "entrenador",
  "monitor",
  "instructor",
  "personal",
  "recepcion",
  "limpieza",
];

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  entrenador: "Entrenador",
  monitor: "Monitor",
  instructor: "Instructor",
  personal: "Entrenador personal",
  recepcion: "Recepción",
  limpieza: "Limpieza",
};

export const TEACHING_ROLES: EmployeeRole[] = ["monitor", "instructor"];

export function canTeach(roles: EmployeeRole[]): boolean {
  return roles.some((r) => TEACHING_ROLES.includes(r));
}

export function roleLabel(roles: EmployeeRole[]): string {
  if (roles.length === 0) return "—";
  return roles.map((r) => EMPLOYEE_ROLE_LABELS[r]).join(" · ");
}

export const employees: Employee[] = [
  { id: "emp1", name: "Carlos Ruiz", email: "carlos@stadio.com", phone: "+34 611 000 001", sex: "Hombre", birthDate: "12/05/1988", address: "Calle Alcalá 40", city: "Madrid", postalCode: "28014", roles: ["entrenador", "instructor"], schedule: "Lunes-Viernes 16:00-22:00", availability: "Tardes de lunes a viernes", status: "Activo", classIds: ["spinning"], initials: "CR", color: "#d71920", vacations: [{ id: "v1", start: "2026-08-12", end: "2026-08-26" }], salaryType: "mensual", salary: 1650 },
  { id: "emp2", name: "Diego Torres", email: "diego@stadio.com", phone: "+34 611 000 002", sex: "Hombre", birthDate: "03/09/1991", address: "Gran Vía 22", city: "Madrid", postalCode: "28013", roles: ["entrenador", "instructor"], schedule: "Martes-Sábado 08:00-14:00", availability: "Mañanas de martes a sábado", status: "Activo", classIds: ["hiit", "boxeo", "crossfit"], initials: "DT", color: "#2563eb", vacations: [], salaryType: "mensual", salary: 1750 },
  { id: "emp3", name: "Marta López", email: "marta@stadio.com", phone: "+34 611 000 003", sex: "Mujer", birthDate: "27/01/1994", address: "Calle Fuencarral 60", city: "Madrid", postalCode: "28004", roles: ["instructor", "monitor"], schedule: "Lunes, Miércoles, Viernes", status: "Activo", classIds: ["yoga", "pilates"], initials: "ML", color: "#16a34a", vacations: [{ id: "v2", start: "2026-09-05", end: "2026-09-19" }], salaryType: "por horas", salary: 14 },
  { id: "emp4", name: "Sara Jiménez", email: "sara@stadio.com", phone: "+34 611 000 004", sex: "Mujer", birthDate: "19/07/1990", address: "Paseo del Prado 12", city: "Madrid", postalCode: "28014", roles: ["instructor"], schedule: "Miércoles 20:30", status: "Activo", classIds: ["zumba"], initials: "SJ", color: "#db2777", vacations: [{ id: "v3", start: "2026-09-08", end: "2026-09-12" }], salaryType: "por horas", salary: 12 },
  { id: "emp5", name: "José Ramírez", email: "jose@stadio.com", phone: "+34 611 000 005", sex: "Hombre", birthDate: "08/03/1982", address: "Calle de Atocha 30", city: "Madrid", postalCode: "28012", roles: ["recepcion"], schedule: "Lunes-Viernes 07:00-15:00", status: "Activo", classIds: [], initials: "JR", color: "#0891b2", vacations: [{ id: "v4", start: "2026-07-01", end: "2026-07-15" }], salaryType: "mensual", salary: 1300 },
  { id: "emp6", name: "Elena Castro", email: "elena@stadio.com", phone: "+34 611 000 006", sex: "Mujer", birthDate: "25/11/1996", address: "Calle de Embajadores 52", city: "Madrid", postalCode: "28012", roles: ["limpieza"], schedule: "Lunes-Domingo", status: "Inactivo", classIds: [], initials: "EC", color: "#7c3aed", vacations: [], salaryType: "por horas", salary: 11 },
  { id: "emp7", name: "Raúl Ortega", email: "raul@stadio.com", phone: "+34 611 000 007", sex: "Hombre", birthDate: "14/06/1986", address: "Calle del Pez 8", city: "Madrid", postalCode: "28004", roles: ["personal"], schedule: "Flexible", status: "Activo", classIds: [], initials: "RO", color: "#f59e0b", vacations: [], salaryType: "por horas", salary: 18 },
  { id: "emp8", name: "Nuria Vidal", email: "nuria@stadio.com", phone: "+34 611 000 008", sex: "Mujer", birthDate: "02/10/1993", address: "Calle de Fuencarral 90", city: "Madrid", postalCode: "28004", roles: ["recepcion"], schedule: "Martes-Sábado 15:00-22:00", status: "Activo", classIds: [], initials: "NV", color: "#059669", vacations: [{ id: "v5", start: "2026-12-20", end: "2027-01-02" }], salaryType: "mensual", salary: 1350 },
];

export const equipment: Equipment[] = [
  { id: "eq1", name: "Press de banca olímpico", type: "Banco", location: "Zona pesas", status: "Disponible", lastMaintenance: "15 Ago 2026" },
  { id: "eq2", name: "Cinta de correr #1", type: "Cardio", location: "Zona cardio", status: "Disponible", lastMaintenance: "20 Ago 2026" },
  { id: "eq3", name: "Remo máquina", type: "Cardio", location: "Zona cardio", status: "Mantenimiento", lastMaintenance: "10 Ago 2026" },
  { id: "eq4", name: "Prensa de piernas 45º", type: "Máquina", location: "Zona pierna", status: "Disponible", lastMaintenance: "25 Jul 2026" },
  { id: "eq5", name: "Polea alta", type: "Máquina", location: "Zona pesas", status: "Fuera de servicio", lastMaintenance: "02 Ago 2026" },
  { id: "eq6", name: "Elíptica #2", type: "Cardio", location: "Zona cardio", status: "Disponible", lastMaintenance: "18 Ago 2026" },
  { id: "eq7", name: "Set de mancuernas 2-40kg", type: "Libre", location: "Zona pesas", status: "Disponible", lastMaintenance: "05 Ago 2026" },
  { id: "eq8", name: "Bicicleta estática #4", type: "Cardio", location: "Sala spinning", status: "Mantenimiento", lastMaintenance: "12 Ago 2026" },
];

export const facilityRooms: FacilityRoom[] = [
  { id: "r1", name: "Sala A", capacity: 30, status: "No disponible" },
  { id: "r2", name: "Sala B", capacity: 25, status: "Disponible" },
  { id: "r3", name: "Sala C", capacity: 40, status: "No disponible" },
  { id: "r4", name: "Box CrossFit", capacity: 22, status: "Disponible" },
  { id: "r5", name: "Sala spinning", capacity: 20, status: "Disponible" },
  { id: "r6", name: "Ring de boxeo", capacity: 16, status: "Disponible" },
];

export const incidents: Incident[] = [
  { id: "i1", title: "Sonido sala spinning distorsionado", description: "El audio se corta a volúmenes altos desde hace varios días.", location: "Sala spinning", status: "En proceso", date: "05 Sep 2026" },
  { id: "i2", title: "Polea alta con cable desgastado", description: "El cable sufre desgaste visible y conviene revisarlo antes del próximo uso.", location: "Polea alta", status: "Abierta", date: "07 Sep 2026" },
  { id: "i3", title: "Fuga de agua en vestuarios", description: "Pequeña fuga junto al lavabo del vestuario 2, moja el suelo.", location: "Vestuario 2", status: "Resuelta", date: "28 Ago 2026" },
  { id: "i4", title: "Cinta #3 no arranca", description: "La cinta de correr se queda en standby y no responde al arranque.", location: "Cinta de correr #1", status: "En proceso", date: "06 Sep 2026" },
];

export function findEmployeeByName(name: string): Employee | undefined {
  const n = name.trim().toLowerCase();
  if (!n) return undefined;
  return (
    employees.find((e) => e.name.toLowerCase() === n) ??
    employees.find((e) => e.name.toLowerCase().startsWith(n)) ??
    employees.find((e) => e.name.toLowerCase().includes(n))
  );
}

export function findEmployeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

/** Empleados que pueden ejercer como entrenador personal. */
export function getPersonalTrainers(): Employee[] {
  return employees.filter(
    (e) => e.status === "Activo" && (e.roles.includes("personal") || e.roles.includes("entrenador"))
  );
}

const DAY_INDEX: Record<string, number> = {
  Lunes: 0, Martes: 1, "Miércoles": 2, Jueves: 3, Viernes: 4, "Sábado": 5, Domingo: 6,
};
const SCHEDULE_RANGE_RE = /^([A-Za-zÁÉÍÓÚáéíóúñÑ]+)-([A-Za-zÁÉÍÓÚáéíóúñÑ]+) (\d{2}:\d{2})-(\d{2}:\d{2})$/;

/**
 * Devuelve el turno de trabajo (entrada/salida) del empleado para una fecha,
 * según el horario que le asignó el administrador. `undefined` si no aplica.
 */
export function getShiftForDate(employee: Employee | undefined, dateIso: string): { from: string; to: string } | undefined {
  if (!employee) return undefined;
  const match = employee.schedule.match(SCHEDULE_RANGE_RE);
  if (!match) return undefined;
  const fromIdx = DAY_INDEX[match[1]];
  const toIdx = DAY_INDEX[match[2]];
  if (fromIdx === undefined || toIdx === undefined) return undefined;
  const day = (new Date(`${dateIso}T12:00:00`).getDay() + 6) % 7;
  const inRange = fromIdx <= toIdx ? day >= fromIdx && day <= toIdx : day >= fromIdx || day <= toIdx;
  if (!inRange) return undefined;
  return { from: match[3], to: match[4] };
}
