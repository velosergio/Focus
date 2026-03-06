import { useState, useCallback, useEffect } from "react";
import type { Tarea, CrearTareaInput, EstadoTarea, Prioridad } from "@/types/task";

const STORAGE_KEY = "focus_tareas";

function generarId(): string {
  return crypto.randomUUID();
}

function cargarTareas(): Tarea[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarTareas(tareas: Tarea[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

/**
 * Hook para gestionar tareas con persistencia en localStorage.
 * Soporta CRUD, filtrado y ordenación.
 */
export function useTasks() {
  const [tareas, setTareas] = useState<Tarea[]>(cargarTareas);
  const [tareaActivaId, setTareaActivaId] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | "todas">("todas");
  const [filtroEtiqueta, setFiltroEtiqueta] = useState<string | null>(null);
  const [ordenarPor, setOrdenarPor] = useState<"prioridad" | "fechaLimite" | "recientes">("recientes");

  useEffect(() => {
    guardarTareas(tareas);
  }, [tareas]);

  const agregarTarea = useCallback((input: CrearTareaInput) => {
    const ahora = new Date().toISOString();
    const nueva: Tarea = {
      id: generarId(),
      titulo: input.titulo,
      descripcion: input.descripcion || "",
      prioridad: input.prioridad || "media",
      etiquetas: input.etiquetas || [],
      fechaLimite: input.fechaLimite,
      estimacionPomodoros: input.estimacionPomodoros || 1,
      pomodorosCompletados: 0,
      estado: "pendiente",
      creadaEn: ahora,
      actualizadaEn: ahora,
    };
    setTareas((prev) => [nueva, ...prev]);
    return nueva;
  }, []);

  const editarTarea = useCallback((id: string, cambios: Partial<Tarea>) => {
    setTareas((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...cambios, actualizadaEn: new Date().toISOString() } : t
      )
    );
  }, []);

  const eliminarTarea = useCallback((id: string) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
    setTareaActivaId((prev) => (prev === id ? null : prev));
  }, []);

  const completarTarea = useCallback((id: string) => {
    setTareas((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, estado: t.estado === "completada" ? "pendiente" : "completada", actualizadaEn: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const incrementarPomodoro = useCallback((id: string) => {
    setTareas((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, pomodorosCompletados: t.pomodorosCompletados + 1, actualizadaEn: new Date().toISOString() }
          : t
      )
    );
  }, []);

  const prioridadOrden: Record<Prioridad, number> = { alta: 0, media: 1, baja: 2 };

  const tareasFiltradas = tareas
    .filter((t) => filtroEstado === "todas" || t.estado === filtroEstado)
    .filter((t) => !filtroEtiqueta || t.etiquetas.includes(filtroEtiqueta))
    .sort((a, b) => {
      if (ordenarPor === "prioridad") return prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
      if (ordenarPor === "fechaLimite") {
        if (!a.fechaLimite) return 1;
        if (!b.fechaLimite) return -1;
        return new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime();
      }
      return new Date(b.creadaEn).getTime() - new Date(a.creadaEn).getTime();
    });

  const todasLasEtiquetas = [...new Set(tareas.flatMap((t) => t.etiquetas))];

  const tareaActiva = tareas.find((t) => t.id === tareaActivaId) || null;

  return {
    tareas: tareasFiltradas,
    todasLasTareas: tareas,
    tareaActiva,
    tareaActivaId,
    setTareaActivaId,
    agregarTarea,
    editarTarea,
    eliminarTarea,
    completarTarea,
    incrementarPomodoro,
    filtroEstado,
    setFiltroEstado,
    filtroEtiqueta,
    setFiltroEtiqueta,
    ordenarPor,
    setOrdenarPor,
    todasLasEtiquetas,
  };
}
