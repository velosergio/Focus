import { apiRequest } from "./api";
import type { LoginInput, RegistroInput, Usuario } from "@/types/auth";

export interface AuthResponse {
  accessToken: string;
  tipo: string;
  usuario: { id: number; nombre: string; email: string };
}

function toUsuario(u: AuthResponse["usuario"]): Usuario {
  return { id: String(u.id), nombre: u.nombre, email: u.email };
}

export const authService = {
  async login(data: LoginInput): Promise<{ token: string; usuario: Usuario }> {
    const res = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { token: res.accessToken, usuario: toUsuario(res.usuario) };
  },

  async register(data: Omit<RegistroInput, "confirmarPassword">): Promise<{ token: string; usuario: Usuario }> {
    const res = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { token: res.accessToken, usuario: toUsuario(res.usuario) };
  },

  async getProfile(): Promise<Usuario> {
    const u = await apiRequest<AuthResponse["usuario"]>("/auth/me");
    return toUsuario(u);
  },
};
