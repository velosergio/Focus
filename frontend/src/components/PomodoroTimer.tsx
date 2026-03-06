import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EstadoPomodoro } from "@/hooks/usePomodoroTimer";

interface PomodoroTimerProps {
  estado: EstadoPomodoro;
  tiempoFormateado: string;
  progreso: number;
  ciclosCompletados: number;
  etiquetaEstado: string;
  tareaActivaNombre?: string;
  onIniciar: () => void;
  onPausar: () => void;
  onReanudar: () => void;
  onReiniciar: () => void;
  onSaltarDescanso: () => void;
}

export function PomodoroTimer({
  estado,
  tiempoFormateado,
  progreso,
  ciclosCompletados,
  etiquetaEstado,
  tareaActivaNombre,
  onIniciar,
  onPausar,
  onReanudar,
  onReiniciar,
  onSaltarDescanso,
}: PomodoroTimerProps) {
  const enEjecucion = estado === "en_foco" || estado === "descanso_corto" || estado === "descanso_largo";
  const enPausa = estado === "pausado";
  const esDescanso = estado === "descanso_corto" || estado === "descanso_largo";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 py-8"
    >
      {/* Estado actual */}
      <motion.p
        key={etiquetaEstado}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm font-medium tracking-widest uppercase text-muted-foreground"
      >
        {etiquetaEstado}
      </motion.p>

      {/* Tarea activa */}
      {tareaActivaNombre && (
        <p className="text-sm text-primary font-medium truncate max-w-xs">
          🎯 {tareaActivaNombre}
        </p>
      )}

      {/* Timer circular */}
      <div className="relative flex items-center justify-center">
        <svg className="w-56 h-56 -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            className="stroke-muted"
            strokeWidth="4"
          />
          <motion.circle
            cx="100" cy="100" r="90"
            fill="none"
            className="stroke-primary"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={565.48}
            animate={{ strokeDashoffset: 565.48 * (1 - progreso / 100) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            key={tiempoFormateado}
            className="text-6xl font-display font-bold tracking-tight text-foreground timer-text-glow"
          >
            {tiempoFormateado}
          </motion.span>
        </div>
      </div>

      {/* Indicador de ciclos */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < (ciclosCompletados % 4) ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          {ciclosCompletados} pomodoros
        </span>
      </div>

      {/* Controles */}
      <div className="flex gap-3">
        {(estado === "listo" || estado === "finalizado") && (
          <Button onClick={onIniciar} size="lg" className="gap-2 px-8">
            <Play className="w-5 h-5" />
            Iniciar
          </Button>
        )}

        {enEjecucion && (
          <Button onClick={onPausar} variant="secondary" size="lg" className="gap-2">
            <Pause className="w-5 h-5" />
            Pausar
          </Button>
        )}

        {enPausa && (
          <Button onClick={onReanudar} size="lg" className="gap-2 px-8">
            <Play className="w-5 h-5" />
            Reanudar
          </Button>
        )}

        {(enEjecucion || enPausa) && (
          <Button onClick={onReiniciar} variant="outline" size="lg">
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}

        {esDescanso && (
          <Button onClick={onSaltarDescanso} variant="ghost" size="lg" className="gap-2">
            <SkipForward className="w-5 h-5" />
            Saltar
          </Button>
        )}
      </div>
    </motion.div>
  );
}
