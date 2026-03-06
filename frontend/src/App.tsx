import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Estadisticas from "./pages/Estadisticas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const auth = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        isAuthenticated={auth.isAuthenticated}
        nombreUsuario={auth.usuario?.nombre}
        onLoginClick={() => setAuthOpen(true)}
        onLogout={auth.logout}
      />
      {!auth.isAuthenticated && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-sm text-foreground">
          Usas Focus en modo invitado.{" "}
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="font-medium text-primary hover:underline"
          >
            Crea una cuenta
          </button>{" "}
          para guardar tu progreso en todos los dispositivos.
        </div>
      )}
      <main className="min-h-[calc(100vh-3.5rem)]">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={auth.login}
        onRegister={auth.register}
        isLoading={auth.isLoading}
      />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
