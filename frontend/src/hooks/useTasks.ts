import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { taskService } from "@/services/taskService";
import type { Tarea, CrearTareaInput, EstadoTarea, Prioridad } from "@/types/task";

const STORAGE_KEY = "focus_tareas";

function generarId(): string {
  return crypto.randomUUID();
}

function cargarTareasLocales(): Tarea[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function guardarTareasLocales(tareas: Tarea[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

/**
 * Hook para gestionar tareas: con backend si hay usuario autenticado, o localStorage en modo invitado.
 */
export function useTasks() {
  const { isAuthenticated } = useAuth();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [tareaActivaId, setTareaActivaId] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<EstadoTarea | "todas">("todas");
  const [filtroEtiqueta, setFiltroEtiqueta] = useState<string | null>(null);
  const [ordenarPor, setOrdenarPor] = useState<"prioridad" | "fechaLimite" | "recientes">("recientes");
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const list = await taskService.getTasks();
      setTareas(list);
    } catch {
      setTareas([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    } else {
      setTareas(cargarTareasLocales());
    }
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (!isAuthenticated && tareas.length >= 0) {
      guardarTareasLocales(tareas);
    }
  }, [isAuthenticated, tareas]);

  const agregarTarea = useCallback(
    async (input: CrearTareaInput) => {
      if (isAuthenticated) {
        const nueva = await taskService.createTask(input);
        setTareas((prev) => [nueva, ...prev]);
        return nueva;
      }
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
    },
    [isAuthenticated]
  );

  const editarTarea = useCallback(
    async (id: string, cambios: Partial<Tarea>) => {
      if (isAuthenticated) {
        const actualizada = await taskService.updateTask(id, cambios);
        setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
        return;
      }
      setTareas((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...cambios, actualizadaEn: new Date().toISOString() } : t
        )
      );
    },
    [isAuthenticated]
  );

  const eliminarTarea = useCallback(
    async (id: string) => {
      if (isAuthenticated) {
        await taskService.deleteTask(id);
        setTareas((prev) => prev.filter((t) => t.id !== id));
      } else {
        setTareas((prev) => prev.filter((t) => t.id !== id));
      }
      setTareaActivaId((prev) => (prev === id ? null : prev));
    },
    [isAuthenticated]
  );

  const completarTarea = useCallback(
    async (id: string) => {
      const t = tareas.find((x) => x.id === id);
      const completada = t?.estado === "completada";
      if (isAuthenticated && t) {
        const actualizada = await taskService.setTaskCompleted(id, !completada);
        setTareas((prev) => prev.map((x) => (x.id === id ? actualizada : x)));
      } else {
        setTareas((prev) =>
          prev.map((x) =>
            x.id === id
              ? {
                  ...x,
                  estado: (x.estado === "completada" ? "pendiente" : "completada") as EstadoTarea,
                  actualizadaEn: new Date().toISOString(),
                }
              : x
          )
        );
      }
    },
    [isAuthenticated, tareas]
  );

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
    refetch,
    loading,
    filtroEstado,
    setFiltroEstado,
    filtroEtiqueta,
    setFiltroEtiqueta,
    ordenarPor,
    setOrdenarPor,
    todasLasEtiquetas,
  };
}
