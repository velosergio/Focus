package com.focus.focus.dto;

import com.focus.focus.model.entity.Tarea;

import java.util.ArrayList;
import java.util.List;

public final class TareaMapper {

    private TareaMapper() {}

    public static TareaDto toDto(Tarea entity) {
        if (entity == null) return null;
        return new TareaDto(
                entity.getId(),
                entity.getUsuario() != null ? entity.getUsuario().getId() : null,
                entity.getTitulo(),
                entity.getDescripcion(),
                entity.getPrioridad(),
                entity.getEtiquetas() != null ? new ArrayList<>(entity.getEtiquetas()) : new ArrayList<>(),
                entity.getFechaLimite(),
                entity.getEstimacionPomodoros(),
                entity.getPomodorosCompletados(),
                entity.getEstado(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public static List<TareaDto> toDtoList(List<Tarea> entities) {
        if (entities == null) return List.of();
        return entities.stream().map(TareaMapper::toDto).toList();
    }
}
