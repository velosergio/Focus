import { apiRequest } from "./api";
import type { LoginInput, RegistroInput, Usuario } from "@/types/auth";

export const authService = {
  async login(data: LoginInput): Promise<{ token: string; usuario: Usuario }> {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async register(data: Omit<RegistroInput, "confirmarPassword">): Promise<{ token: string; usuario: Usuario }> {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getProfile(): Promise<Usuario> {
    return apiRequest("/auth/me");
  },
};
