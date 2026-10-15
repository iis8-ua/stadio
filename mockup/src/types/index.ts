export type Role = "client" | "trainer" | "admin";

/**
 * Sub-rol del personal docente dentro del acceso de entrenador:
 * - `entrenador`: entrenador personal (clientes y rutinas).
 * - `monitor`: monitor/instructor (clases y materiales).
 */
export type TrainerProfile = "entrenador" | "monitor";

export type SalaryType = "mensual" | "por horas";

export type EmployeeRole =
  | "entrenador"
  | "monitor"
  | "instructor"
  | "personal"
  | "recepcion"
  | "limpieza";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  initials: string;
  color?: string;
}

export type MembershipStatus = "active" | "inactive";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  color?: string;
  goal: string;
  routine: string;
  frequency: string;
  sex: "Hombre" | "Mujer";
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
  weight: number;
  targetWeight: number;
  lastWorkout: string;
  progress: number;
  status: MembershipStatus;
  fee: "Pagada" | "Pendiente";
  lastAccess: string;
  joined: string;
  nfcId?: string;
}

export interface ExerciseSet {
  id: string;
  weight: string;
  reps: string;
  rest: string;
  rir: string;
  rpe: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  description?: string;
  /** Instrucciones completas de ejecución (importadas de wger). */
  instructions?: string;
  /** Equipamiento necesario, separado por comas. */
  equipment?: string;
  /** Ruta local de la imagen del ejercicio (p. ej. /exercises/12.webp). */
  image?: string;
  /** Identificador del ejercicio en la API externa (wger). */
  externalId?: string;
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  name: string;
  muscle: string;
  notes?: string;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  name: string;
  goal: string;
  frequency: string;
  exercises: RoutineExercise[];
  trainerId?: string;
}

export interface RoutineAssignment {
  id: string;
  clientId: string;
  routineId: string;
  routineName: string;
  date: string;
}

/** Relación cliente ↔ entrenador personal (servicio contratado y asignado). */
export interface PersonalTrainerInfo {
  requested: boolean;
  trainerId?: string;
  since?: string;
}

/** Actividad de la agenda del entrenador (equivalente a ActividadEntrenador). */
export interface ScheduleEntry {
  id: string;
  date: string;
  start: string;
  end: string;
  title: string;
  room: string;
}

export type PaymentStatus = "Pagada" | "Pendiente";

export interface Payment {
  id: string;
  month: string;
  status: PaymentStatus;
  date?: string;
}

/** Método de acceso. Hoy solo existe la pulsera NFC (leída en el torno);
 *  se deja como union por si en el futuro se añaden otros métodos. */
export type AccessMethod = "Pulsera NFC";

export interface AccessRecord {
  id: string;
  day: string;
  date: string;
  entry: string;
  exit?: string;
  method: AccessMethod;
}

export interface GymClass {
  id: string;
  name: string;
  day: string;
  date: string;
  time: string;
  duration: string;
  trainer: string;
  room: string;
  capacity: number;
  booked: number;
  description: string;
  materials?: string[];
}

export interface ClassType {
  id: string;
  name: string;
  description: string;
}

export interface ClassSession {
  id: string;
  classTypeId: string;
  date: string;
  time: string;
  duration: string;
  trainer: string;
  room: string;
  capacity: number;
  materials?: string[];
  booked: number;
}

export interface Booking {
  id: string;
  classId: string;
  className: string;
  day: string;
  date: string;
  time: string;
  trainer: string;
  month: string;
  status: "confirmed" | "past" | "cancelled";
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  data: string;
  recommendation: string;
  type: "positive" | "warning" | "info";
}

export interface VacationPeriod {
  id: string;
  start: string;
  end: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  sex: "Hombre" | "Mujer";
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
  roles: EmployeeRole[];
  schedule: string;
  /** Disponibilidad declarada del entrenador (RF-19). */
  availability?: string;
  status: "Activo" | "Inactivo";
  classIds: string[];
  initials: string;
  color?: string;
  vacations: VacationPeriod[];
  salaryType: SalaryType;
  salary: number;
}

export type EquipmentStatus = "Disponible" | "Mantenimiento" | "Fuera de servicio";

export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: EquipmentStatus;
  lastMaintenance: string;
}

export interface FacilityRoom {
  id: string;
  name: string;
  capacity: number;
  status: "Disponible" | "No disponible";
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  status: "Abierta" | "En proceso" | "Resuelta";
  date: string;
}

export interface AccessLog {
  id: string;
  time: string;
  user: string;
  type: "Entrada" | "Salida";
  status: "Completado" | "Pendiente";
}

export interface AdminKPI {
  id: string;
  label: string;
  value: string;
  change: number;
}
