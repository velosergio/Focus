import { useState, useCallback } from "react";
import { authService } from "@/services/authService";
import type { AuthState, LoginInput, RegistroInput, Usuario } from "@/types/auth";

const TOKEN_KEY = "focus_token";
const USER_KEY = "focus_user";

function loadAuthState(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    if (token && user) {
      return { token, usuario: JSON.parse(user) as Usuario, isAuthenticated: true };
    }
  } catch {
    // localStorage no disponible o datos inválidos
  }
  return { token: null, usuario: null, isAuthenticated: false };
}

/**
 * Hook para gestionar el estado de autenticación con el backend.
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(loadAuthState);
  const [isLoading, setIsLoading] = useState(false);

  const guardarSesion = useCallback((token: string, usuario: Usuario) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    setAuthState({ token, usuario, isAuthenticated: true });
  }, []);

  const login = useCallback(
    async (data: LoginInput) => {
      setIsLoading(true);
      try {
        const res = await authService.login(data);
        guardarSesion(res.token, res.usuario);
      } finally {
        setIsLoading(false);
      }
    },
    [guardarSesion]
  );

  const register = useCallback(
    async (data: RegistroInput) => {
      setIsLoading(true);
      try {
        const res = await authService.register({
          nombre: data.nombre,
          email: data.email,
          password: data.password,
        });
        guardarSesion(res.token, res.usuario);
      } finally {
        setIsLoading(false);
      }
    },
    [guardarSesion]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({ token: null, usuario: null, isAuthenticated: false });
  }, []);

  return {
    ...authState,
    isLoading,
    login,
    register,
    logout,
  };
}
