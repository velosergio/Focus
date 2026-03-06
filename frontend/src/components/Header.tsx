import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isAuthenticated: boolean;
  nombreUsuario?: string;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  isAuthenticated,
  nombreUsuario,
  onLoginClick,
  onLogout,
}: HeaderProps) {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/estadisticas", label: "Estadísticas" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-display font-bold text-primary">Focus</span>
          <span className="text-xs text-muted-foreground">🍅</span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                location.pathname === link.to
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Cambiar tema">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                {nombreUsuario}
              </span>
              <Button variant="ghost" size="sm" onClick={onLogout} className="gap-1">
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onLoginClick} className="gap-1">
              <LogIn className="w-3.5 h-3.5" />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
