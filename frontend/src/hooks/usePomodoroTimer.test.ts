import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePomodoroTimer } from "./usePomodoroTimer";

describe("usePomodoroTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("inicia en estado listo con 25:00", () => {
    const { result } = renderHook(() => usePomodoroTimer());
    expect(result.current.estado).toBe("listo");
    expect(result.current.tiempoFormateado).toBe("25:00");
    expect(result.current.ciclosCompletados).toBe(0);
  });

  it("al llamar iniciar pasa a en_foco y el tiempo cuenta", () => {
    const { result } = renderHook(() => usePomodoroTimer());
    act(() => {
      result.current.iniciar();
    });
    expect(result.current.estado).toBe("en_foco");
    expect(result.current.tiempoFormateado).toBe("25:00");

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.tiempoFormateado).toBe("24:00");
  });

  it("pausar detiene el contador", () => {
    const { result } = renderHook(() => usePomodoroTimer());
    act(() => {
      result.current.iniciar();
    });
    act(() => {
      vi.advanceTimersByTime(5_000);
    });
    act(() => {
      result.current.pausar();
    });
    expect(result.current.estado).toBe("pausado");
    const tiempoPausado = result.current.tiempoFormateado;
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(result.current.tiempoFormateado).toBe(tiempoPausado);
  });
});
