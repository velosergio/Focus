package com.focus.focus.dto;

import com.focus.focus.model.entity.Usuario;

public final class UsuarioMapper {

    private UsuarioMapper() {}

    public static UsuarioDto toDto(Usuario entity) {
        if (entity == null) return null;
        return new UsuarioDto(
                entity.getId(),
                entity.getNombre(),
                entity.getEmail(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
