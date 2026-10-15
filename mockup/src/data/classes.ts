import type { Booking, ClassSession, ClassType, GymClass } from "../types";

export const classTypes: ClassType[] = [
  {
    id: "spinning",
    name: "Spinning",
    description:
      "Clase de ciclismo indoor de alta intensidad enfocada a mejorar la resistencia cardiovascular. Incluye sprints y subidas con música motivadora.",
  },
  {
    id: "yoga",
    name: "Yoga",
    description:
      "Sesión de yoga para mejorar la flexibilidad, equilibrio y reducción del estrés. Ideal para todos los niveles.",
  },
  {
    id: "hiit",
    name: "HIIT",
    description:
      "Entrenamiento interválico de alta intensidad. Quema calorías de forma eficiente con ejercicios funcionales.",
  },
  {
    id: "pilates",
    name: "Pilates",
    description:
      "Trabajo de core y postura mediante el método Pilates. Mejora la estabilidad y el control corporal.",
  },
  {
    id: "boxeo",
    name: "Boxeo",
    description:
      "Clase de boxeo con sacos y trabajo técnico. Desarrolla condición física, coordinación y potencia.",
  },
  {
    id: "crossfit",
    name: "CrossFit",
    description:
      "WOD diario con levantamientos y ejercicios funcionales. Intensidad moderada-alta.",
  },
  {
    id: "zumba",
    name: "Zumba",
    description:
      "Clase de baile con coreografías latinas. Una forma divertida de quemar calorías y mejorar la coordinación.",
  },
];

export const DAY_LETTERS: Record<number, string> = { 0: "D", 1: "L", 2: "M", 3: "X", 4: "J", 5: "V", 6: "S" };

const WEEKDAY_INDEX: Record<string, number> = { L: 1, M: 2, X: 3, J: 4, V: 5, S: 6 };

const WEEKDAY_LABEL = [
  "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado",
];

const MONTH_LABEL = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function dateToKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function dayLetterFromDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return DAY_LETTERS[new Date(y, m - 1, d).getDay()];
}

export function dayNumberFromDate(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export function fmtShortDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${WEEKDAY_LABEL[new Date(y, m - 1, d).getDay()]} ${d} ${MONTH_LABEL[m - 1]}`;
}

/** "2026-10-07" -> "OCTUBRE 2026" */
export function fmtMonthYear(date: string): string {
  const [y, m] = date.split("-").map(Number);
  return `${MONTH_LABEL[m - 1].toUpperCase()} ${y}`;
}

export function fmtDayShort(date: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${d} ${["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][m - 1]}`;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function datesForWeekday(year: number, month: number, weekday: string): string[] {
  const wd = WEEKDAY_INDEX[weekday];
  if (wd === undefined) return [];
  const out: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month, d).getDay() === wd) out.push(`${year}-${pad2(month + 1)}-${pad2(d)}`);
  }
  return out;
}

const SESSION_DEFAULTS: Record<
  string,
  { time: string; duration: string; trainer: string; trainerAlt: string; room: string; roomAlt: string; capacity: number; materials: string[] }
> = {
  spinning: {
    time: "18:30",
    duration: "45 min",
    trainer: "Carlos",
    trainerAlt: "Sara",
    room: "Sala A",
    roomAlt: "Sala C",
    capacity: 20,
    materials: ["Bicicletas indoor", "Calzado de ciclismo", "Sistema de audio"],
  },
  yoga: {
    time: "20:00",
    duration: "60 min",
    trainer: "Marta",
    trainerAlt: "Sara",
    room: "Sala B",
    roomAlt: "Sala A",
    capacity: 25,
    materials: ["Esterillas", "Bloques de yoga", "Correas"],
  },
  hiit: {
    time: "19:00",
    duration: "30 min",
    trainer: "Diego",
    trainerAlt: "Carlos",
    room: "Sala C",
    roomAlt: "Sala A",
    capacity: 24,
    materials: ["Kettlebells", "Cuerdas de batalla", "Cajones", "Bosu"],
  },
  pilates: {
    time: "17:30",
    duration: "50 min",
    trainer: "Marta",
    trainerAlt: "Sara",
    room: "Sala B",
    roomAlt: "Box",
    capacity: 20,
    materials: ["Colchonetas", "Pelotas de Pilates", "Aros"],
  },
  boxeo: {
    time: "19:30",
    duration: "50 min",
    trainer: "Diego",
    trainerAlt: "Carlos",
    room: "Ring",
    roomAlt: "Box",
    capacity: 16,
    materials: ["Guantes", "Vendas", "Sacos boxeo", "Manoplas"],
  },
  crossfit: {
    time: "10:00",
    duration: "60 min",
    trainer: "Diego",
    trainerAlt: "Carlos",
    room: "Box",
    roomAlt: "Sala C",
    capacity: 22,
    materials: ["Barras olímpicas", "Discos", "Cuerdas", "Cajones", "Rack"],
  },
  zumba: {
    time: "20:30",
    duration: "60 min",
    trainer: "Sara",
    trainerAlt: "Marta",
    room: "Sala C",
    roomAlt: "Sala B",
    capacity: 30,
    materials: ["Sistema de audio", "Mancuernas ligeras"],
  },
};

export const GENERATED_MONTHS = [
  { year: 2026, month: 8 },
  { year: 2026, month: 9 },
];

export function generateSessions(
  classTypeId: string,
  weekdays: string[],
  months: { year: number; month: number }[],
  def: { time: string; duration: string; trainer: string; room: string; capacity: number; materials?: string[] },
  booked = 0
): ClassSession[] {
  const out: ClassSession[] = [];
  for (const { year, month } of months) {
    for (const weekday of weekdays) {
      for (const date of datesForWeekday(year, month, weekday)) {
        out.push({
          id: `${classTypeId}-${date}`,
          classTypeId,
          date,
          time: def.time,
          duration: def.duration,
          trainer: def.trainer,
          room: def.room,
          capacity: def.capacity,
          materials: def.materials,
          booked,
        });
      }
    }
  }
  return out;
}

const INITIAL_DAYS: Record<string, string[]> = {
  spinning: ["L", "V"],
  yoga: ["L"],
  hiit: ["M"],
  pilates: ["X"],
  boxeo: ["J"],
  crossfit: ["S"],
  zumba: ["X"],
};

function buildClassSessions(): ClassSession[] {
  const out: ClassSession[] = [];
  for (const t of classTypes) {
    const def = SESSION_DEFAULTS[t.id];
    const days = INITIAL_DAYS[t.id];
    if (!def || !days) continue;
    for (const { year, month } of GENERATED_MONTHS) {
      for (const weekday of days) {
        for (const date of datesForWeekday(year, month, weekday)) {
          const id = `${t.id}-${date}`;
          const rand = mulberry32(hash(id));
          const useAlt = rand() < 0.3;
          const booked = Math.min(def.capacity, 1 + Math.floor(rand() * (def.capacity + 1)));
          out.push({
            id,
            classTypeId: t.id,
            date,
            time: def.time,
            duration: def.duration,
            trainer: useAlt ? def.trainerAlt : def.trainer,
            room: useAlt ? def.roomAlt : def.room,
            capacity: def.capacity,
            materials: def.materials,
            booked,
          });
        }
      }
    }
  }
  return out;
}

export const classSessions: ClassSession[] = buildClassSessions();

export function sessionById(id: string): ClassSession | undefined {
  return classSessions.find((s) => s.id === id);
}

export function resolveGymClasses(
  types: ClassType[],
  sessions: ClassSession[]
): GymClass[] {
  return sessions.map((s) => {
    const t = types.find((c) => c.id === s.classTypeId);
    return {
      id: s.id,
      name: t ? t.name : s.classTypeId,
      day: dayLetterFromDate(s.date),
      date: s.date,
      time: s.time,
      duration: s.duration,
      trainer: s.trainer,
      room: s.room,
      capacity: s.capacity,
      booked: s.booked,
      description: t ? t.description : "",
      materials: s.materials,
    };
  });
}

export const bookings: Booking[] = [
  {
    id: "b1",
    classId: "spinning-2026-09-21",
    className: "Spinning",
    day: "L",
    date: "2026-09-21",
    time: "18:30",
    trainer: "Carlos",
    month: "SEPTIEMBRE 2026",
    status: "confirmed",
  },
  {
    id: "b2",
    classId: "spinning-2026-09-25",
    className: "Spinning",
    day: "V",
    date: "2026-09-25",
    time: "18:30",
    trainer: "Carlos",
    month: "SEPTIEMBRE 2026",
    status: "confirmed",
  },
  {
    id: "b10",
    classId: "hiit-2026-09-01",
    className: "HIIT",
    day: "M",
    date: "2026-09-01",
    time: "19:00",
    trainer: "Diego",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
  {
    id: "b5",
    classId: "spinning-2026-09-14",
    className: "Spinning",
    day: "L",
    date: "2026-09-14",
    time: "18:30",
    trainer: "Carlos",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
  {
    id: "b3",
    classId: "boxeo-2026-09-03",
    className: "Boxeo",
    day: "J",
    date: "2026-09-03",
    time: "19:30",
    trainer: "Diego",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
  {
    id: "b6",
    classId: "zumba-2026-09-02",
    className: "Zumba",
    day: "X",
    date: "2026-09-02",
    time: "20:30",
    trainer: "Sara",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
  {
    id: "b7",
    classId: "crossfit-2026-09-05",
    className: "CrossFit",
    day: "S",
    date: "2026-09-05",
    time: "10:00",
    trainer: "Diego",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
  {
    id: "b4",
    classId: "pilates-2026-09-09",
    className: "Pilates",
    day: "X",
    date: "2026-09-09",
    time: "17:30",
    trainer: "Marta",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
  {
    id: "b8",
    classId: "yoga-2026-09-07",
    className: "Yoga",
    day: "L",
    date: "2026-09-07",
    time: "20:00",
    trainer: "Marta",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
  {
    id: "b9",
    classId: "hiit-2026-09-08",
    className: "HIIT",
    day: "M",
    date: "2026-09-08",
    time: "19:00",
    trainer: "Diego",
    month: "SEPTIEMBRE 2026",
    status: "past",
  },
];

export interface EnrolledMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

const MEMBER_POOL: EnrolledMember[] = [
  { id: "m1", name: "Israel Quintero", initials: "IS", color: "#2563eb" },
  { id: "m2", name: "María García", initials: "MG", color: "#16a34a" },
  { id: "m3", name: "Javier López", initials: "JL", color: "#f59e0b" },
  { id: "m4", name: "Sara Martínez", initials: "SM", color: "#d71920" },
  { id: "m5", name: "Pedro Sánchez", initials: "PS", color: "#7c3aed" },
  { id: "m6", name: "Ana Ruiz", initials: "AR", color: "#0891b2" },
  { id: "m7", name: "Diego Fernández", initials: "DF", color: "#db2777" },
  { id: "m8", name: "Lucía Navarro", initials: "LN", color: "#059669" },
  { id: "m9", name: "Miguel Peña", initials: "MP", color: "#0ea5e9" },
  { id: "m10", name: "Carmen Vidal", initials: "CV", color: "#9333ea" },
  { id: "m11", name: "Pablo Gómez", initials: "PG", color: "#e11d48" },
  { id: "m12", name: "Laura Serrano", initials: "LS", color: "#14b8a6" },
  { id: "m13", name: "David Ortega", initials: "DO", color: "#6366f1" },
  { id: "m14", name: "Elena Ramos", initials: "ER", color: "#f97316" },
  { id: "m15", name: "Jorge Castillo", initials: "JC", color: "#22c55e" },
  { id: "m16", name: "Alicia Moreno", initials: "AM", color: "#a855f7" },
  { id: "m17", name: "Fernando Herrera", initials: "FH", color: "#0d9488" },
  { id: "m18", name: "Raquel Medina", initials: "RM", color: "#dc2626" },
  { id: "m19", name: "Sergio Ibáñez", initials: "SI", color: "#3b82f6" },
  { id: "m20", name: "Patricia Molina", initials: "PM", color: "#d97706" },
  { id: "m21", name: "Iker Sanz", initials: "ISz", color: "#7c3aed" },
  { id: "m22", name: "Cristina Ortega", initials: "CO", color: "#059669" },
  { id: "m23", name: "Álvaro Moya", initials: "AMo", color: "#eab308" },
  { id: "m24", name: "Beatriz Campos", initials: "BC", color: "#10b981" },
];

export function getEnrolledMembers(
  classId: string,
  day: string,
  booked: number
): EnrolledMember[] {
  const key = classId + day;
  let seed = 0;
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  const count = Math.min(booked, MEMBER_POOL.length);
  const step = seed % 2 === 0 ? 5 : 7;
  const start = seed % MEMBER_POOL.length;
  const out: EnrolledMember[] = [];
  for (let k = 0; k < count; k++) {
    out.push(MEMBER_POOL[(start + k * step) % MEMBER_POOL.length]);
  }
  return out;
}