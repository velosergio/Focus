package com.focus.focus.service.impl;

import com.focus.focus.dto.StatsDataPoint;
import com.focus.focus.dto.TopTagDto;
import com.focus.focus.dto.TopTaskDto;
import com.focus.focus.model.entity.SesionPomodoro;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.TipoSesionPomodoro;
import com.focus.focus.model.entity.Usuario;
import com.focus.focus.repository.SesionPomodoroRepository;
import com.focus.focus.repository.TareaRepository;
import com.focus.focus.service.StatsService;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatsServiceImpl implements StatsService {

    private static final String[] DIAS_SEMANA = {"Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"};

    private final TareaRepository tareaRepository;
    private final SesionPomodoroRepository sesionPomodoroRepository;

    public StatsServiceImpl(TareaRepository tareaRepository, SesionPomodoroRepository sesionPomodoroRepository) {
        this.tareaRepository = tareaRepository;
        this.sesionPomodoroRepository = sesionPomodoroRepository;
    }

    @Override
    public List<StatsDataPoint> getWeeklyStats(Usuario usuario) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);
        LocalDateTime start = startOfWeek.atStartOfDay();
        LocalDateTime end = endOfWeek.atTime(23, 59, 59);

        List<SesionPomodoro> sesiones = sesionPomodoroRepository
                .findByTareaUsuarioAndTipoAndFechaFinBetween(usuario, TipoSesionPomodoro.TRABAJO, start, end);

        Map<Integer, Long> porDia = sesiones.stream()
                .filter(s -> s.getFechaFin() != null)
                .collect(Collectors.groupingBy(s -> s.getFechaFin().getDayOfWeek().getValue(), Collectors.counting()));

        List<StatsDataPoint> result = new ArrayList<>();
        for (int i = 1; i <= 7; i++) {
            String label = DIAS_SEMANA[i - 1];
            int value = porDia.getOrDefault(i, 0L).intValue();
            result.add(new StatsDataPoint(label, value));
        }
        return result;
    }

    @Override
    public List<StatsDataPoint> getMonthlyStats(Usuario usuario) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        LocalDateTime start = startOfMonth.atStartOfDay();
        LocalDateTime end = endOfMonth.atTime(23, 59, 59);

        List<SesionPomodoro> sesiones = sesionPomodoroRepository
                .findByTareaUsuarioAndTipoAndFechaFinBetween(usuario, TipoSesionPomodoro.TRABAJO, start, end);

        Map<LocalDate, Long> porDia = sesiones.stream()
                .filter(s -> s.getFechaFin() != null)
                .collect(Collectors.groupingBy(s -> s.getFechaFin().toLocalDate(), Collectors.counting()));

        List<StatsDataPoint> result = new ArrayList<>();
        for (int day = 1; day <= today.lengthOfMonth(); day++) {
            LocalDate date = startOfMonth.withDayOfMonth(day);
            String label = String.valueOf(day);
            int value = porDia.getOrDefault(date, 0L).intValue();
            result.add(new StatsDataPoint(label, value));
        }
        return result;
    }

    @Override
    public List<TopTaskDto> getTopTasks(Usuario usuario, int limit) {
        List<Tarea> tareas = tareaRepository.findByUsuarioOrderByPomodorosCompletadosDesc(
                usuario, PageRequest.of(0, limit));
        return tareas.stream()
                .map(t -> new TopTaskDto(t.getId(), t.getTitulo(), t.getPomodorosCompletados()))
                .toList();
    }

    @Override
    public List<TopTagDto> getTopTags(Usuario usuario, int limit) {
        List<Tarea> tareas = tareaRepository.findByUsuario(usuario);
        Map<String, Integer> tagPomodoros = new HashMap<>();
        for (Tarea t : tareas) {
            int pomodoros = t.getPomodorosCompletados() != null ? t.getPomodorosCompletados() : 0;
            for (String etiqueta : t.getEtiquetas() != null ? t.getEtiquetas() : List.<String>of()) {
                tagPomodoros.merge(etiqueta, pomodoros, Integer::sum);
            }
        }
        return tagPomodoros.entrySet().stream()
                .map(e -> new TopTagDto(e.getKey(), e.getValue()))
                .sorted((a, b) -> Integer.compare(b.totalPomodoros(), a.totalPomodoros()))
                .limit(limit)
                .toList();
    }
}
