import { AnimatePresence } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Tarea, EstadoTarea } from "@/types/task";
import { ListFilter, ArrowUpDown } from "lucide-react";

interface TaskListProps {
  tareas: Tarea[];
  tareaActivaId: string | null;
  filtroEstado: EstadoTarea | "todas";
  filtroEtiqueta: string | null;
  ordenarPor: "prioridad" | "fechaLimite" | "recientes";
  todasLasEtiquetas: string[];
  onSetFiltroEstado: (v: EstadoTarea | "todas") => void;
  onSetFiltroEtiqueta: (v: string | null) => void;
  onSetOrdenarPor: (v: "prioridad" | "fechaLimite" | "recientes") => void;
  onSeleccionar: (id: string) => void;
  onCompletar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export function TaskList({
  tareas,
  tareaActivaId,
  filtroEstado,
  filtroEtiqueta,
  ordenarPor,
  todasLasEtiquetas,
  onSetFiltroEstado,
  onSetFiltroEtiqueta,
  onSetOrdenarPor,
  onSeleccionar,
  onCompletar,
  onEliminar,
}: TaskListProps) {
  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ListFilter className="w-3.5 h-3.5" />
        </div>
        <Select value={filtroEstado} onValueChange={(v) => onSetFiltroEstado(v as EstadoTarea | "todas")}>
          <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="en_progreso">En progreso</SelectItem>
            <SelectItem value="completada">Completadas</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ArrowUpDown className="w-3.5 h-3.5" />
        </div>
        <Select value={ordenarPor} onValueChange={(v) => onSetOrdenarPor(v as typeof ordenarPor)}>
          <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recientes">Más recientes</SelectItem>
            <SelectItem value="prioridad">Prioridad</SelectItem>
            <SelectItem value="fechaLimite">Fecha límite</SelectItem>
          </SelectContent>
        </Select>

        {todasLasEtiquetas.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {filtroEtiqueta && (
              <Badge
                variant="secondary"
                className="text-[10px] cursor-pointer"
                onClick={() => onSetFiltroEtiqueta(null)}
              >
                ✕ {filtroEtiqueta}
              </Badge>
            )}
            {!filtroEtiqueta &&
              todasLasEtiquetas.slice(0, 5).map((et) => (
                <Badge
                  key={et}
                  variant="outline"
                  className="text-[10px] cursor-pointer hover:bg-accent"
                  onClick={() => onSetFiltroEtiqueta(et)}
                >
                  {et}
                </Badge>
              ))}
          </div>
        )}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tareas.map((t) => (
            <TaskCard
              key={t.id}
              tarea={t}
              esActiva={t.id === tareaActivaId}
              onSeleccionar={() => onSeleccionar(t.id)}
              onCompletar={() => onCompletar(t.id)}
              onEliminar={() => onEliminar(t.id)}
            />
          ))}
        </AnimatePresence>
        {tareas.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No hay tareas. ¡Agrega una para empezar!
          </p>
        )}
      </div>
    </div>
  );
}
