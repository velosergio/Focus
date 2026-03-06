import { useState, useCallback, useEffect } from "react";
import type { AuthState, LoginInput, RegistroInput, Usuario } from "@/types/auth";

const TOKEN_KEY = "focus_token";
const USER_KEY = "focus_user";

function loadAuthState(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    if (token && user) {
      return { token, usuario: JSON.parse(user), isAuthenticated: true };
    }
  } catch {}
  return { token: null, usuario: null, isAuthenticated: false };
}

/**
 * Hook para gestionar el estado de autenticación.
 * Simula las llamadas al backend; las funciones de servicio se conectarán al API real.
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
    async (_data: LoginInput) => {
      setIsLoading(true);
      try {
        // En producción: const res = await authService.login(data);
        // Simulación para desarrollo sin backend:
        const usuario: Usuario = { id: "1", nombre: "Usuario Demo", email: _data.email };
        guardarSesion("demo_token", usuario);
      } finally {
        setIsLoading(false);
      }
    },
    [guardarSesion]
  );

  const register = useCallback(
    async (_data: RegistroInput) => {
      setIsLoading(true);
      try {
        const usuario: Usuario = { id: "1", nombre: _data.nombre, email: _data.email };
        guardarSesion("demo_token", usuario);
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
