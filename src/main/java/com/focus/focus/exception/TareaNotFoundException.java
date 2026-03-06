package com.focus.focus.exception;

public class TareaNotFoundException extends RuntimeException {

    public TareaNotFoundException(Long id) {
        super("Tarea no encontrada con id: " + id);
    }
}
