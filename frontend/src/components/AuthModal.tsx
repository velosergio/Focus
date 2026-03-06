import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { LoginInput, RegistroInput } from "@/types/auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (data: LoginInput) => Promise<void>;
  onRegister: (data: RegistroInput) => Promise<void>;
  isLoading: boolean;
}

export function AuthModal({ open, onClose, onLogin, onRegister, isLoading }: AuthModalProps) {
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    if (modo === "registro") {
      if (!nombre.trim()) {
        toast.error("Ingresa tu nombre");
        return;
      }
      if (password !== confirmar) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      if (password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      try {
        await onRegister({ nombre, email, password, confirmarPassword: confirmar });
        toast.success("¡Cuenta creada exitosamente!");
        onClose();
      } catch (err) {
        toast.error("Error al registrarse");
      }
    } else {
      try {
        await onLogin({ email, password });
        toast.success("¡Bienvenido de vuelta!");
        onClose();
      } catch (err) {
        toast.error("Credenciales incorrectas");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {modo === "registro" && (
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {modo === "registro" && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmar">Confirmar contraseña</Label>
              <Input
                id="confirmar"
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cargando..." : modo === "login" ? "Entrar" : "Registrarse"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {modo === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            type="button"
            onClick={() => setModo(modo === "login" ? "registro" : "login")}
            className="text-primary hover:underline"
          >
            {modo === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
