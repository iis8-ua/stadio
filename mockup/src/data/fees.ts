import { monthlyLabels, MONTHS_FULL } from "./analytics";
import { getGymSettings } from "../features/settings/gymSettings";

/**
 * Datos (de ejemplo) de cuotas mensuales del gimnasio. Se centralizan aquí
 * para que tanto la pantalla de Cuotas como las notificaciones usen la misma
 * información.
 */
const FEE_PAID_BASE = [820, 860, 900, 950, 980, 1050, 1100, 1085, 1140, 1105, 1120, 1160];
const FEE_PENDING_BASE = [140, 128, 118, 105, 120, 95, 88, 102, 76, 42, 55, 48];

export interface FeeMonth {
  month: string;
  paid: number;
  pending: number;
}

export function buildFeeYear(year: number): FeeMonth[] {
  const factor = year === 2024 ? 0.78 : year === 2025 ? 0.9 : 1;
  return monthlyLabels.map((m, i) => ({
    month: m,
    paid: Math.round(FEE_PAID_BASE[i] * factor),
    pending: Math.round(FEE_PENDING_BASE[i] * factor),
  }));
}

export interface PendingClient {
  id: string;
  name: string;
  month: string;
  amount: number;
}

const FIRST = ["Javier", "Ana", "Lucía", "Marcos", "Sofía", "Raúl", "Nerea", "Pablo", "Irene", "Diego", "Carmen", "Álvaro"];
const LAST = ["López", "Ruiz", "Navarro", "Gil", "Pérez", "Vega", "Campos", "Serrano", "Molina", "Rojas", "Iglesias", "Santos"];

export function buildPendingClients(year: number, month: number): PendingClient[] {
  const count = buildFeeYear(year)[month].pending;
  const amount = getGymSettings().membershipFee;
  return Array.from({ length: count }, (_, i) => ({
    id: `pp-${year}-${month}-${i}`,
    name: `${FIRST[i % FIRST.length]} ${LAST[Math.floor(i / FIRST.length) % LAST.length]}`,
    month: `${MONTHS_FULL[month]} ${year}`,
    amount,
  }));
}
