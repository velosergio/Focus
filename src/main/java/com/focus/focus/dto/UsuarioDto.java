package com.focus.focus.dto;

import java.time.LocalDateTime;

public record UsuarioDto(
        Long id,
        String nombre,
        String email,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
