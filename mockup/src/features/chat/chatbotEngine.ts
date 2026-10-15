import { aforoCurrent } from "../../data/aforo";
import { classTypes, classSessions, resolveGymClasses, dateToKey, fmtShortDate } from "../../data/classes";
import { facilityRooms, equipment } from "../../data/employees";
import { getBookings } from "../bookings/clientBookings";
import { getGymSettings, getTodayHours, formatFee } from "../settings/gymSettings";

const normalize = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const CHAT_SUGGESTIONS = [
  "¿A qué hora abre el gimnasio?",
  "¿Cuál es mi próxima clase?",
  "¿Cuánto cuesta la cuota?",
  "¿Cómo está el aforo ahora?",
  "¿Qué salas tenéis?",
];

/** Respuesta del asistente (por reglas) usando la información real del gimnasio. */
export function getBotReply(text: string): string {
  const q = normalize(text);
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("hola", "buenas", "hey", "que tal")) {
    return `¡Hola! Soy el asistente de ${getGymSettings().name}. Puedo ayudarte con horarios, clases, reservas, cuota, accesos e instalaciones.`;
  }

  if (has("hora", "abre", "abrir", "cierra", "cerrar", "horario", "apertura")) {
    const today = getTodayHours();
    if (today.closed) return "Hoy el gimnasio permanece cerrado.";
    return `El gimnasio abre de ${today.open} a ${today.close}.`;
  }

  if (has("aforo", "ocupacion", "gente", "personas", "lleno", "cuanta gente")) {
    return `Ahora mismo hay ${aforoCurrent.people} personas dentro (capacidad máxima ${getGymSettings().capacity}).`;
  }

  if (has("cuota", "pagar", "precio", "cuesta", "mensualidad", "euros", "tarifa", "dinero")) {
    return `La cuota es de ${formatFee()} al mes e incluye todas las actividades del gimnasio.`;
  }

  if (has("acceso", "entrar", "pulsera", "torno", "nfc")) {
    return "Accedes al gimnasio con tu pulsera NFC pasándola por el torno.";
  }

  if (has("reserva", "apuntad", "proxima", "inscrit", "mis clases")) {
    const bookings = getBookings().filter((b) => b.status === "confirmed");
    const today = dateToKey(new Date());
    const next =
      [...bookings].filter((b) => b.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0] ??
      bookings[0];
    return next
      ? `Tu próxima reserva es ${next.className} el ${fmtShortDate(next.date)} a las ${next.time}.`
      : "No tienes reservas activas. Puedes reservar una desde la sección Reservas.";
  }

  if (has("clase", "spinning", "yoga", "hiit", "pilates", "boxeo", "crossfit", "zumba")) {
    const todayKey = dateToKey(new Date());
    const classes = resolveGymClasses(classTypes, classSessions)
      .filter((c) => c.date >= todayKey)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const c = classes[0];
    return c
      ? `La próxima clase es ${c.name} el ${fmtShortDate(c.date)} a las ${c.time} en ${c.room}.`
      : "Ahora mismo no hay clases programadas.";
  }

  if (has("sala", "instalacion", "equipo", "maquina", "material")) {
    const rooms = facilityRooms.filter((r) => r.status === "Disponible").map((r) => r.name).join(", ");
    return `Disponemos de estas salas: ${rooms}. En total hay ${equipment.length} equipos de entrenamiento.`;
  }

  return "No tengo información sobre eso. Puedo ayudarte con horarios, clases, reservas, cuota, accesos o instalaciones.";
}
