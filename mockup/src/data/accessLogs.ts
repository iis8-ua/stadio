import type { AccessLog } from "../types";
import { clients } from "./users";

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Movimientos de acceso del día actual.
 * La semilla depende de la fecha, por lo que la lista se "limpia" cada día
 * y solo muestra los movimientos diarios de los clientes.
 */
export function getTodayAccessLogs(): AccessLog[] {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const rand = seededRandom(seed);

  const activeClients = clients.filter((c) => c.status === "active");
  const count = 18 + Math.floor(rand() * 13); // entre 18 y 30 movimientos
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const logs: AccessLog[] = [];
  for (let i = 0; i < count; i++) {
    const client = activeClients[Math.floor(rand() * activeClients.length)];
    const totalMinutes = (7 + Math.floor(rand() * 15)) * 60 + minutes[Math.floor(rand() * minutes.length)];
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const mm = String(totalMinutes % 60).padStart(2, "0");
    logs.push({
      id: `log-${seed}-${i}`,
      time: `${hh}:${mm}`,
      user: client.name,
      type: rand() > 0.5 ? "Entrada" : "Salida",
      status: rand() > 0.12 ? "Completado" : "Pendiente",
    });
  }

  return logs.sort((a, b) => b.time.localeCompare(a.time));
}
