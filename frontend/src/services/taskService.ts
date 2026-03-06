import { apiRequest } from "./api";
import type { Tarea, CrearTareaInput } from "@/types/task";

export const taskService = {
  async getTasks(): Promise<Tarea[]> {
    return apiRequest("/tasks");
  },

  async createTask(data: CrearTareaInput): Promise<Tarea> {
    return apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateTask(id: string, data: Partial<Tarea>): Promise<Tarea> {
    return apiRequest(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteTask(id: string): Promise<void> {
    return apiRequest(`/tasks/${id}`, { method: "DELETE" });
  },
};
