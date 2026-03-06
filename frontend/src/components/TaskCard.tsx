import { Check, Trash2, Target, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tarea } from "@/types/task";
import { motion } from "framer-motion";

interface TaskCardProps {
  tarea: Tarea;
  esActiva: boolean;
  onSeleccionar: () => void;
  onCompletar: () => void;
  onEliminar: () => void;
}

const prioridadColor: Record<string, string> = {
  alta: "bg-destructive/15 text-destructive border-destructive/30",
  media: "bg-warning/15 text-warning border-warning/30",
  baja: "bg-success/15 text-success border-success/30",
};

const prioridadLabel: Record<string, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export function TaskCard({ tarea, esActiva, onSeleccionar, onCompletar, onEliminar }: TaskCardProps) {
  const completada = tarea.estado === "completada";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`group flex items-start gap-3 p-4 rounded-lg border transition-all ${
        esActiva
          ? "border-primary bg-accent shadow-sm"
          : "border-border bg-card hover:border-muted-foreground/30"
      } ${completada ? "opacity-60" : ""}`}
    >
      {/* Checkbox */}
      <button
        onClick={onCompletar}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          completada
            ? "bg-primary border-primary"
            : "border-muted-foreground/40 hover:border-primary"
        }`}
        aria-label={completada ? "Marcar como pendiente" : "Marcar como completada"}
      >
        {completada && <Check className="w-3 h-3 text-primary-foreground" />}
      </button>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${completada ? "line-through text-muted-foreground" : "text-foreground"}`}>
          {tarea.titulo}
        </p>
        {tarea.descripcion && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tarea.descripcion}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${prioridadColor[tarea.prioridad]}`}>
            {prioridadLabel[tarea.prioridad]}
          </Badge>
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <Timer className="w-3 h-3" />
            {tarea.pomodorosCompletados}/{tarea.estimacionPomodoros}
          </span>
          {tarea.etiquetas.map((et) => (
            <Badge key={et} variant="secondary" className="text-[10px] px-1.5 py-0">
              {et}
            </Badge>
          ))}
          {tarea.fechaLimite && (
            <span className="text-[10px] text-muted-foreground">
              📅 {new Date(tarea.fechaLimite).toLocaleDateString("es")}
            </span>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!completada && (
          <Button
            variant={esActiva ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={onSeleccionar}
            aria-label="Seleccionar como tarea activa"
          >
            <Target className="w-3.5 h-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={onEliminar}
          aria-label="Eliminar tarea"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
