package com.focus.focus.dto;

import com.focus.focus.model.entity.SesionPomodoro;

public final class SesionPomodoroMapper {

    private SesionPomodoroMapper() {}

    public static SesionPomodoroDto toDto(SesionPomodoro entity) {
        if (entity == null) return null;
        return new SesionPomodoroDto(
                entity.getId(),
                entity.getTarea() != null ? entity.getTarea().getId() : null,
                entity.getTipo(),
                entity.getDuracionMinutos(),
                entity.getFechaInicio(),
                entity.getFechaFin()
        );
    }
}
