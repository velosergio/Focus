import { apiRequest } from "./api";

export interface StatsDataPoint {
  label: string;
  value: number;
}

export interface TopTaskDto {
  tareaId: number;
  titulo: string;
  pomodorosCompletados: number;
}

export interface TopTagDto {
  etiqueta: string;
  totalPomodoros: number;
}

export const statsService = {
  async getWeeklyStats(): Promise<StatsDataPoint[]> {
    return apiRequest<StatsDataPoint[]>("/api/stats/weekly");
  },

  async getMonthlyStats(): Promise<StatsDataPoint[]> {
    return apiRequest<StatsDataPoint[]>("/api/stats/monthly");
  },

  async getTopTasks(limit = 5): Promise<TopTaskDto[]> {
    return apiRequest<TopTaskDto[]>(`/api/stats/top-tasks?limit=${limit}`);
  },

  async getTopTags(limit = 5): Promise<TopTagDto[]> {
    return apiRequest<TopTagDto[]>(`/api/stats/top-tags?limit=${limit}`);
  },
};
