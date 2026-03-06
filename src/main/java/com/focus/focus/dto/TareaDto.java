package com.focus.focus.dto;

import com.focus.focus.model.entity.EstadoTarea;
import com.focus.focus.model.entity.Prioridad;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record TareaDto(
        Long id,
        Long usuarioId,
        String titulo,
        String descripcion,
        Prioridad prioridad,
        List<String> etiquetas,
        LocalDate fechaLimite,
        Integer estimacionPomodoros,
        Integer pomodorosCompletados,
        EstadoTarea estado,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
