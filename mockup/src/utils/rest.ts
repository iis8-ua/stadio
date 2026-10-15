/** Muestra el descanso siempre en segundos (añade la "s" si no la lleva). */
export function restLabel(rest?: string): string {
  if (!rest) return "";
  return /s$/i.test(rest) ? rest : `${rest}s`;
}
