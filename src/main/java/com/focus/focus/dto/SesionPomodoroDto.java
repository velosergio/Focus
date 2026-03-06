package com.focus.focus.dto;

import com.focus.focus.model.entity.TipoSesionPomodoro;

import java.time.LocalDateTime;

public record SesionPomodoroDto(
        Long id,
        Long tareaId,
        TipoSesionPomodoro tipo,
        Integer duracionMinutos,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin
) {}
