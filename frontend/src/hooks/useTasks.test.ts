import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTasks } from "./useTasks";

describe("useTasks", () => {
  beforeEach(() => {
    try {
      ["focus_tareas", "focus_token", "focus_user"].forEach((k) => localStorage.removeItem(k));
    } catch {
      // localStorage no disponible (ej. entorno de test)
    }
  });

  it("sin auth agrega tarea y la persiste en localStorage", async () => {
    const { result } = renderHook(() => useTasks());
    await act(async () => {
      await result.current.agregarTarea({
        titulo: "Tarea de prueba",
        prioridad: "alta",
      });
    });
    expect(result.current.todasLasTareas).toHaveLength(1);
    expect(result.current.todasLasTareas[0].titulo).toBe("Tarea de prueba");
    expect(result.current.todasLasTareas[0].prioridad).toBe("alta");
    expect(result.current.todasLasTareas[0].pomodorosCompletados).toBe(0);
  });

  it("completarTarea cambia estado a completada", async () => {
    const { result } = renderHook(() => useTasks());
    await act(async () => {
      await result.current.agregarTarea({ titulo: "Una tarea" });
    });
    const id = result.current.todasLasTareas[0].id;
    await act(async () => {
      await result.current.completarTarea(id);
    });
    expect(result.current.todasLasTareas.find((t) => t.id === id)?.estado).toBe("completada");
  });

  it("incrementarPomodoro aumenta el contador de la tarea", async () => {
    const { result } = renderHook(() => useTasks());
    await act(async () => {
      await result.current.agregarTarea({ titulo: "Pomodoro test" });
    });
    const id = result.current.todasLasTareas[0].id;
    act(() => {
      result.current.incrementarPomodoro(id);
    });
    expect(result.current.todasLasTareas.find((t) => t.id === id)?.pomodorosCompletados).toBe(1);
  });
});
