package com.focus.focus.dto;

import com.focus.focus.model.entity.Prioridad;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateTaskRequest(
        @NotBlank(message = "El título es obligatorio")
        @Size(min = 1, max = 255)
        String titulo,
        @Size(max = 2000)
        String descripcion,
        Prioridad prioridad,
        List<String> etiquetas,
        LocalDate fechaLimite,
        Integer estimacionPomodoros
) {}
