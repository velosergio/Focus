package com.focus.focus.dto;

import com.focus.focus.model.entity.TipoSesionPomodoro;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CompletePomodoroRequest(
        @NotNull(message = "El ID de la tarea es obligatorio")
        Long taskId,
        @NotNull(message = "El tipo de sesión es obligatorio")
        TipoSesionPomodoro tipo,
        LocalDateTime fechaInicio
) {}
