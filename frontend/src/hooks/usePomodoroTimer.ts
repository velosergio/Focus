import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";

export type EstadoPomodoro =
  | "listo"
  | "en_foco"
  | "descanso_corto"
  | "descanso_largo"
  | "pausado"
  | "finalizado";

interface PomodoroConfig {
  trabajoMin: number;
  descansoCortMin: number;
  descansoLargoMin: number;
  ciclosParaDescansoLargo: number;
}

const CONFIG_DEFAULT: PomodoroConfig = {
  trabajoMin: 25,
  descansoCortMin: 5,
  descansoLargoMin: 15,
  ciclosParaDescansoLargo: 4,
};

/**
 * Hook personalizado que encapsula toda la lógica del temporizador Pomodoro.
 * Gestiona estados, transiciones entre sesiones y conteo de ciclos.
 */
export function usePomodoroTimer(onPomodoroComplete?: () => void) {
  const [estado, setEstado] = useState<EstadoPomodoro>("listo");
  const [tiempoRestante, setTiempoRestante] = useState(CONFIG_DEFAULT.trabajoMin * 60);
  const [tiempoTotal, setTiempoTotal] = useState(CONFIG_DEFAULT.trabajoMin * 60);
  const [ciclosCompletados, setCiclosCompletados] = useState(0);
  const estadoPrevio = useRef<EstadoPomodoro>("listo");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const limpiarIntervalo = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const iniciarContador = useCallback(() => {
    limpiarIntervalo();
    intervalRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          limpiarIntervalo();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [limpiarIntervalo]);

  // Manejar cuando el tiempo llega a 0
  useEffect(() => {
    if (tiempoRestante !== 0) return;
    if (estado === "listo" || estado === "pausado" || estado === "finalizado") return;

    if (estado === "en_foco") {
      const nuevosCiclos = ciclosCompletados + 1;
      setCiclosCompletados(nuevosCiclos);
      onPomodoroComplete?.();
      toast.success("🍅 ¡Pomodoro completado!", { description: "Hora de descansar." });

      if (nuevosCiclos % CONFIG_DEFAULT.ciclosParaDescansoLargo === 0) {
        const t = CONFIG_DEFAULT.descansoLargoMin * 60;
        setTiempoRestante(t);
        setTiempoTotal(t);
        setEstado("descanso_largo");
        iniciarContador();
      } else {
        const t = CONFIG_DEFAULT.descansoCortMin * 60;
        setTiempoRestante(t);
        setTiempoTotal(t);
        setEstado("descanso_corto");
        iniciarContador();
      }
    } else if (estado === "descanso_corto" || estado === "descanso_largo") {
      toast.info("⏰ ¡Descanso terminado!", { description: "Vuelve al enfoque." });
      const t = CONFIG_DEFAULT.trabajoMin * 60;
      setTiempoRestante(t);
      setTiempoTotal(t);
      setEstado("listo");
    }
  }, [tiempoRestante, estado, ciclosCompletados, onPomodoroComplete, iniciarContador]);

  useEffect(() => {
    return () => limpiarIntervalo();
  }, [limpiarIntervalo]);

  const iniciar = useCallback(() => {
    if (estado === "listo" || estado === "finalizado") {
      const t = CONFIG_DEFAULT.trabajoMin * 60;
      setTiempoRestante(t);
      setTiempoTotal(t);
      setEstado("en_foco");
      toast("🎯 ¡Sesión de enfoque iniciada!");
      iniciarContador();
    }
  }, [estado, iniciarContador]);

  const pausar = useCallback(() => {
    if (estado === "en_foco" || estado === "descanso_corto" || estado === "descanso_largo") {
      estadoPrevio.current = estado;
      setEstado("pausado");
      limpiarIntervalo();
    }
  }, [estado, limpiarIntervalo]);

  const reanudar = useCallback(() => {
    if (estado === "pausado") {
      setEstado(estadoPrevio.current);
      iniciarContador();
    }
  }, [estado, iniciarContador]);

  const reiniciar = useCallback(() => {
    limpiarIntervalo();
    const t = CONFIG_DEFAULT.trabajoMin * 60;
    setTiempoRestante(t);
    setTiempoTotal(t);
    setEstado("listo");
  }, [limpiarIntervalo]);

  const saltarDescanso = useCallback(() => {
    if (estado === "descanso_corto" || estado === "descanso_largo") {
      limpiarIntervalo();
      const t = CONFIG_DEFAULT.trabajoMin * 60;
      setTiempoRestante(t);
      setTiempoTotal(t);
      setEstado("listo");
      toast("⏭️ Descanso saltado");
    }
  }, [estado, limpiarIntervalo]);

  const progreso = tiempoTotal > 0 ? ((tiempoTotal - tiempoRestante) / tiempoTotal) * 100 : 0;

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const tiempoFormateado = `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

  const etiquetaEstado: Record<EstadoPomodoro, string> = {
    listo: "Listo para enfocarse",
    en_foco: "Sesión de enfoque",
    descanso_corto: "Descanso corto",
    descanso_largo: "Descanso largo",
    pausado: "Pausado",
    finalizado: "Finalizado",
  };

  return {
    estado,
    tiempoFormateado,
    progreso,
    ciclosCompletados,
    etiquetaEstado: etiquetaEstado[estado],
    iniciar,
    pausar,
    reanudar,
    reiniciar,
    saltarDescanso,
  };
}
