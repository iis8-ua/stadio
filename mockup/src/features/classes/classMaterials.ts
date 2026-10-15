/**
 * Materiales que se van a usar en cada clase (en memoria).
 * Si la clase no tiene una edición guardada, se usa el material por defecto.
 */
const overrides = new Map<string, string[]>();

export function getClassMaterials(classId: string, fallback: string[]): string[] {
  return overrides.get(classId) ?? fallback;
}

export function setClassMaterials(classId: string, materials: string[]): void {
  overrides.set(classId, materials);
}
