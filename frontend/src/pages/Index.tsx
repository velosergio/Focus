import { useState } from "react";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { usePomodoroTimer } from "@/hooks/usePomodoroTimer";
import { useTasks } from "@/hooks/useTasks";
import { toast } from "sonner";

const Index = () => {
  const tasks = useTasks();

  const pomodoro = usePomodoroTimer(() => {
    // Callback cuando se completa un pomodoro
    if (tasks.tareaActivaId) {
      tasks.incrementarPomodoro(tasks.tareaActivaId);
      toast.success(`Pomodoro añadido a "${tasks.tareaActiva?.titulo}"`);
    }
  });

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 space-y-8">
      {/* Timer */}
      <section>
        <PomodoroTimer
          estado={pomodoro.estado}
          tiempoFormateado={pomodoro.tiempoFormateado}
          progreso={pomodoro.progreso}
          ciclosCompletados={pomodoro.ciclosCompletados}
          etiquetaEstado={pomodoro.etiquetaEstado}
          tareaActivaNombre={tasks.tareaActiva?.titulo}
          onIniciar={pomodoro.iniciar}
          onPausar={pomodoro.pausar}
          onReanudar={pomodoro.reanudar}
          onReiniciar={pomodoro.reiniciar}
          onSaltarDescanso={pomodoro.saltarDescanso}
        />
      </section>

      {/* Nueva tarea */}
      <section>
        <TaskForm onAgregar={(input) => {
          tasks.agregarTarea(input);
          toast.success("Tarea agregada");
        }} />
      </section>

      {/* Lista de tareas */}
      <section>
        <h2 className="font-display font-semibold text-lg mb-3">Mis tareas</h2>
        <TaskList
          tareas={tasks.tareas}
          tareaActivaId={tasks.tareaActivaId}
          filtroEstado={tasks.filtroEstado}
          filtroEtiqueta={tasks.filtroEtiqueta}
          ordenarPor={tasks.ordenarPor}
          todasLasEtiquetas={tasks.todasLasEtiquetas}
          onSetFiltroEstado={tasks.setFiltroEstado}
          onSetFiltroEtiqueta={tasks.setFiltroEtiqueta}
          onSetOrdenarPor={tasks.setOrdenarPor}
          onSeleccionar={(id) =>
            tasks.setTareaActivaId(tasks.tareaActivaId === id ? null : id)
          }
          onCompletar={tasks.completarTarea}
          onEliminar={tasks.eliminarTarea}
        />
      </section>
    </div>
  );
};

export default Index;
