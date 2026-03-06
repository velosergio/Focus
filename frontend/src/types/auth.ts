export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegistroInput {
  nombre: string;
  email: string;
  password: string;
  confirmarPassword: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
}
