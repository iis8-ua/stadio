import type { AIInsight } from "../types";

export const clientAIInsights: AIInsight[] = [
  {
    id: "ai1",
    title: "Progreso destacado",
    description: "Tu press banca ha mejorado un 8% durante las últimas 6 semanas.",
    data: "Press banca: 80 → 90 kg",
    recommendation: "Continúa con el incremento progresivo de cargas.",
    type: "positive",
  },
  {
    id: "ai2",
    title: "Frecuencia constante",
    description: "Entrenas 4 días por semana de forma consistente las últimas 4 semanas.",
    data: "Adherencia: 92%",
    recommendation: "Mantén este ritmo para consolidar tus resultados.",
    type: "positive",
  },
  {
    id: "ai3",
    title: "Cargas estancadas",
    description: "Has mantenido la misma carga en algunos ejercicios durante 3 semanas.",
    data: "Press inclinado y aperturas",
    recommendation: "Podrías aumentar ligeramente la carga en press banca y sus variantes.",
    type: "warning",
  },
  {
    id: "ai4",
    title: "Margen de esfuerzo",
    description: "Tu RPE medio (7,5) indica que todavía tienes margen de esfuerzo.",
    data: "RPE medio: 7,5",
    recommendation:
      "Considera aumentar el esfuerzo percibido en las series principales a un RPE 8.",
    type: "info",
  },
  {
    id: "ai5",
    title: "Descanso óptimo",
    description:
      "En series pesadas el descanso medio de 90s podría ser insuficiente para máxima recuperación.",
    data: "Descanso medio: 90s",
    recommendation: "Considera aumentar el descanso a 120s en series pesadas.",
    type: "warning",
  },
];

export const adminAIInsights: AIInsight[] = [
  {
    id: "adai1",
    title: "Horas punta detectadas",
    description: "El gimnasio alcanza su mayor ocupación entre las 18:00 y las 20:00.",
    data: "Ocupación pico: 71% · 142 personas",
    recommendation: "Refuerza personal de recepción y mantenimiento en ese franja horaria.",
    type: "info",
  },
  {
    id: "adai2",
    title: "Clase estrella",
    description: "La clase de spinning de las 18:30 tiene una ocupación media del 94%.",
    data: "Spinning 18:30 · 94% ocupación",
    recommendation: "Considera añadir una sesión extra de spinning el martes.",
    type: "positive",
  },
  {
    id: "adai3",
    title: "Días con más accesos",
    description: "Los martes presentan mayor número de accesos de la semana.",
    data: "Martes: 162 accesos",
    recommendation: "Planifica promociones y actividades los fines de semana para equilibrar.",
    type: "positive",
  },
  {
    id: "adai4",
    title: "Cuotas pendientes",
    description: "Un 8% de los clientes activos tiene la cuota pendiente de este mes.",
    data: "42 clientes con cuota pendiente",
    recommendation: "Activa recordatorios automáticos a los clientes con pago pendiente.",
    type: "warning",
  },
  {
    id: "adai5",
    title: "Retención en aumento",
    description: "La tasa de retención de socios ha subido 3 puntos en el último trimestre.",
    data: "Retención: 77%",
    recommendation: "El programa de clases recientes está funcionando muy bien.",
    type: "positive",
  },
];
