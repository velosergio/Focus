export type Prioridad = "baja" | "media" | "alta";
export type EstadoTarea = "pendiente" | "en_progreso" | "completada";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  prioridad: Prioridad;
  etiquetas: string[];
  fechaLimite?: string;
  estimacionPomodoros: number;
  pomodorosCompletados: number;
  estado: EstadoTarea;
  creadaEn: string;
  actualizadaEn: string;
}

export type CrearTareaInput = Pick<Tarea, "titulo"> &
  Partial<Pick<Tarea, "descripcion" | "prioridad" | "etiquetas" | "fechaLimite" | "estimacionPomodoros">>;
