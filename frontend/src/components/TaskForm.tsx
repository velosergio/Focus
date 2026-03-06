import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CrearTareaInput, Prioridad } from "@/types/task";

interface TaskFormProps {
  onAgregar: (input: CrearTareaInput) => void;
}

export function TaskForm({ onAgregar }: TaskFormProps) {
  const [titulo, setTitulo] = useState("");
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<Prioridad>("media");
  const [etiquetas, setEtiquetas] = useState("");
  const [estimacion, setEstimacion] = useState("1");
  const [fechaLimite, setFechaLimite] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    onAgregar({
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      prioridad,
      etiquetas: etiquetas
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      estimacionPomodoros: Math.max(1, parseInt(estimacion) || 1),
      fechaLimite: fechaLimite || undefined,
    });

    setTitulo("");
    setDescripcion("");
    setPrioridad("media");
    setEtiquetas("");
    setEstimacion("1");
    setFechaLimite("");
    setMostrarOpciones(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="¿En qué vas a trabajar?"
          className="flex-1"
          aria-label="Título de la tarea"
        />
        <Button type="submit" disabled={!titulo.trim()} className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setMostrarOpciones(!mostrarOpciones)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {mostrarOpciones ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        Opciones avanzadas
      </button>

      {mostrarOpciones && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-card border border-border">
          <div className="sm:col-span-2">
            <label className="text-xs text-muted-foreground mb-1 block">Descripción</label>
            <Textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalles opcionales..."
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Prioridad</label>
            <Select value={prioridad} onValueChange={(v) => setPrioridad(v as Prioridad)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="baja">🟢 Baja</SelectItem>
                <SelectItem value="media">🟡 Media</SelectItem>
                <SelectItem value="alta">🔴 Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Pomodoros estimados</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={estimacion}
              onChange={(e) => setEstimacion(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Etiquetas (separadas por coma)</label>
            <Input
              value={etiquetas}
              onChange={(e) => setEtiquetas(e.target.value)}
              placeholder="trabajo, estudio, personal"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Fecha límite</label>
            <Input
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
            />
          </div>
        </div>
      )}
    </form>
  );
}
