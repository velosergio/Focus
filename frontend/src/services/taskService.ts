import { apiRequest } from "./api";
import type { Tarea, CrearTareaInput, Prioridad, EstadoTarea } from "@/types/task";

interface TareaApi {
  id: number;
  usuarioId: number | null;
  titulo: string;
  descripcion: string | null;
  prioridad: string;
  etiquetas: string[];
  fechaLimite: string | null;
  estimacionPomodoros: number;
  pomodorosCompletados: number;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

function fromApi(t: TareaApi): Tarea {
  const prioridadMap: Record<string, Prioridad> = { BAJA: "baja", MEDIA: "media", ALTA: "alta" };
  const estadoMap: Record<string, EstadoTarea> = {
    PENDIENTE: "pendiente",
    EN_PROGRESO: "en_progreso",
    COMPLETADA: "completada",
  };
  return {
    id: String(t.id),
    titulo: t.titulo,
    descripcion: t.descripcion ?? undefined,
    prioridad: prioridadMap[t.prioridad] ?? "media",
    etiquetas: t.etiquetas ?? [],
    fechaLimite: t.fechaLimite ?? undefined,
    estimacionPomodoros: t.estimacionPomodoros ?? 0,
    pomodorosCompletados: t.pomodorosCompletados ?? 0,
    estado: estadoMap[t.estado] ?? "pendiente",
    creadaEn: t.createdAt,
    actualizadaEn: t.updatedAt,
  };
}

function prioridadToApi(p: Prioridad): string {
  return p.toUpperCase();
}
function estadoToApi(e: EstadoTarea): string {
  return e === "en_progreso" ? "EN_PROGRESO" : e.toUpperCase();
}

export const taskService = {
  async getTasks(params?: { estado?: EstadoTarea; prioridad?: Prioridad; etiquetas?: string }): Promise<Tarea[]> {
    const search = new URLSearchParams();
    if (params?.estado) search.set("estado", estadoToApi(params.estado));
    if (params?.prioridad) search.set("prioridad", prioridadToApi(params.prioridad));
    if (params?.etiquetas) search.set("etiquetas", params.etiquetas);
    const q = search.toString();
    const list = await apiRequest<TareaApi[]>(`/api/tasks${q ? `?${q}` : ""}`);
    return list.map(fromApi);
  },

  async createTask(data: CrearTareaInput): Promise<Tarea> {
    const body = {
      titulo: data.titulo,
      descripcion: data.descripcion ?? null,
      prioridad: data.prioridad ? prioridadToApi(data.prioridad) : "MEDIA",
      etiquetas: data.etiquetas ?? [],
      fechaLimite: data.fechaLimite ?? null,
      estimacionPomodoros: data.estimacionPomodoros ?? 1,
    };
    const t = await apiRequest<TareaApi>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return fromApi(t);
  },

  async getTask(id: string): Promise<Tarea | null> {
    try {
      const t = await apiRequest<TareaApi>(`/api/tasks/${id}`);
      return fromApi(t);
    } catch {
      return null;
    }
  },

  async updateTask(id: string, data: Partial<Tarea>): Promise<Tarea> {
    const body: Record<string, unknown> = {};
    if (data.titulo != null) body.titulo = data.titulo;
    if (data.descripcion != null) body.descripcion = data.descripcion;
    if (data.prioridad != null) body.prioridad = prioridadToApi(data.prioridad);
    if (data.etiquetas != null) body.etiquetas = data.etiquetas;
    if (data.fechaLimite != null) body.fechaLimite = data.fechaLimite;
    if (data.estimacionPomodoros != null) body.estimacionPomodoros = data.estimacionPomodoros;
    if (data.estado != null) body.estado = estadoToApi(data.estado);
    const t = await apiRequest<TareaApi>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return fromApi(t);
  },

  async deleteTask(id: string): Promise<void> {
    await apiRequest(`/api/tasks/${id}`, { method: "DELETE" });
  },

  async setTaskCompleted(id: string, completed: boolean): Promise<Tarea> {
    return taskService.updateTask(id, {
      estado: completed ? "completada" : "pendiente",
    });
  },
};
