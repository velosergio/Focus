import { apiRequest } from "./api";

export type TipoSesionPomodoro = "TRABAJO" | "DESCANSO_CORTO" | "DESCANSO_LARGO";

export interface CompletePomodoroRequest {
  taskId: number;
  tipo: TipoSesionPomodoro;
  fechaInicio?: string;
}

export const pomodoroService = {
  async completeSession(data: CompletePomodoroRequest): Promise<void> {
    await apiRequest("/api/pomodoros/complete", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
