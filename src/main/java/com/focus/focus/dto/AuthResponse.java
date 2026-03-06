package com.focus.focus.dto;

public record AuthResponse(
        String accessToken,
        String tipo,
        UsuarioDto usuario
) {
    public static AuthResponse of(String accessToken, UsuarioDto usuario) {
        return new AuthResponse(accessToken, "Bearer", usuario);
    }
}
