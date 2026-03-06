import { useMemo, useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { statsService } from "@/services/statsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Timer, Trophy, Tag, TrendingUp } from "lucide-react";

/**
 * Vista de estadísticas: datos del backend si hay usuario autenticado, o locales en modo invitado.
 */
const Estadisticas = () => {
  const { isAuthenticated } = useAuth();
  const { todasLasTareas } = useTasks();
  const [serverWeekly, setServerWeekly] = useState<{ label: string; value: number }[]>([]);
  const [serverMonthly, setServerMonthly] = useState<{ label: string; value: number }[]>([]);
  const [serverTopTasks, setServerTopTasks] = useState<{ tareaId: number; titulo: string; pomodorosCompletados: number }[]>([]);
  const [serverTopTags, setServerTopTags] = useState<{ etiqueta: string; totalPomodoros: number }[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setStatsLoading(true);
    Promise.all([
      statsService.getWeeklyStats(),
      statsService.getMonthlyStats(),
      statsService.getTopTasks(5),
      statsService.getTopTags(5),
    ])
      .then(([w, m, tt, tg]) => {
        setServerWeekly(w);
        setServerMonthly(m);
        setServerTopTasks(tt);
        setServerTopTags(tg);
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, [isAuthenticated]);

  const localStats = useMemo(() => {
    const ahora = new Date();
    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ahora.getDay());
    inicioSemana.setHours(0, 0, 0, 0);
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const pomodorosSemana = todasLasTareas.reduce((sum, t) => {
      const fecha = new Date(t.actualizadaEn);
      return fecha >= inicioSemana ? sum + t.pomodorosCompletados : sum;
    }, 0);
    const pomodorosMes = todasLasTareas.reduce((sum, t) => {
      const fecha = new Date(t.actualizadaEn);
      return fecha >= inicioMes ? sum + t.pomodorosCompletados : sum;
    }, 0);
    const totalPomodoros = todasLasTareas.reduce((sum, t) => sum + t.pomodorosCompletados, 0);
    const tareaTop = [...todasLasTareas].sort((a, b) => b.pomodorosCompletados - a.pomodorosCompletados)[0];
    const etiquetaMap: Record<string, number> = {};
    todasLasTareas.forEach((t) => {
      t.etiquetas.forEach((et) => {
        etiquetaMap[et] = (etiquetaMap[et] || 0) + t.pomodorosCompletados;
      });
    });
    const etiquetasRanking = Object.entries(etiquetaMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const datosGrafica = Array.from({ length: 7 }).map((_, i) => {
      const dia = new Date(inicioSemana);
      dia.setDate(dia.getDate() + i);
      const diaStr = dia.toDateString();
      const pomodoros = todasLasTareas.reduce((sum, t) => {
        const tFecha = new Date(t.actualizadaEn);
        return tFecha.toDateString() === diaStr ? sum + t.pomodorosCompletados : sum;
      }, 0);
      return { dia: diasSemana[dia.getDay()], pomodoros };
    });
    const completadas = todasLasTareas.filter((t) => t.estado === "completada").length;
    return { pomodorosSemana, pomodorosMes, totalPomodoros, tareaTop, etiquetasRanking, datosGrafica, completadas };
  }, [todasLasTareas]);

  const stats = useMemo(() => {
    if (isAuthenticated) {
      const pomodorosSemana = serverWeekly.reduce((s, d) => s + d.value, 0);
      const pomodorosMes = serverMonthly.reduce((s, d) => s + d.value, 0);
      return {
        pomodorosSemana,
        pomodorosMes,
        totalPomodoros: pomodorosMes,
        tareaTop: serverTopTasks[0]
          ? { titulo: serverTopTasks[0].titulo, pomodorosCompletados: serverTopTasks[0].pomodorosCompletados }
          : null,
        etiquetasRanking: serverTopTags.map((t) => [t.etiqueta, t.totalPomodoros] as [string, number]),
        datosGrafica: serverWeekly.map((d) => ({ dia: d.label, pomodoros: d.value })),
        completadas: 0,
      };
    }
    return localStats;
  }, [isAuthenticated, serverWeekly, serverMonthly, serverTopTasks, serverTopTags, localStats]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
      <h1 className="font-display text-2xl font-bold">Estadísticas</h1>
      {isAuthenticated && statsLoading && (
        <p className="text-sm text-muted-foreground">Cargando estadísticas...</p>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3 px-4 flex flex-col items-center text-center">
            <Timer className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-display font-bold">{stats.pomodorosSemana}</p>
            <p className="text-[11px] text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 flex flex-col items-center text-center">
            <TrendingUp className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-display font-bold">{stats.pomodorosMes}</p>
            <p className="text-[11px] text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 flex flex-col items-center text-center">
            <Trophy className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-display font-bold">{stats.totalPomodoros}</p>
            <p className="text-[11px] text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4 flex flex-col items-center text-center">
            <Tag className="w-5 h-5 text-primary mb-1" />
            <p className="text-2xl font-display font-bold">{stats.completadas}</p>
            <p className="text-[11px] text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica semanal */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-display">Pomodoros esta semana</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.datosGrafica}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="pomodoros" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top tarea y etiquetas */}
      <div className="grid md:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">🏆 Tarea destacada</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.tareaTop ? (
              <div>
                <p className="font-medium text-sm">{stats.tareaTop.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.tareaTop.pomodorosCompletados} pomodoros completados
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sin tareas aún</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-display">🏷️ Etiquetas top</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.etiquetasRanking.length > 0 ? (
              <ul className="space-y-1">
                {stats.etiquetasRanking.map(([et, count]) => (
                  <li key={et} className="flex justify-between text-sm">
                    <span>{et}</span>
                    <span className="text-muted-foreground">{count} 🍅</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sin etiquetas aún</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Estadisticas;
