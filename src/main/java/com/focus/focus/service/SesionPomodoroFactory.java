package com.focus.focus.service;

import com.focus.focus.model.entity.SesionPomodoro;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.TipoSesionPomodoro;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class SesionPomodoroFactory {

    private static final int DURACION_TRABAJO = 25;
    private static final int DURACION_DESCANSO_CORTO = 5;
    private static final int DURACION_DESCANSO_LARGO = 15;

    public SesionPomodoro create(TipoSesionPomodoro tipo, Tarea tarea, LocalDateTime inicio) {
        int duracion = switch (tipo) {
            case TRABAJO -> DURACION_TRABAJO;
            case DESCANSO_CORTO -> DURACION_DESCANSO_CORTO;
            case DESCANSO_LARGO -> DURACION_DESCANSO_LARGO;
        };
        SesionPomodoro sesion = new SesionPomodoro();
        sesion.setTarea(tarea);
        sesion.setTipo(tipo);
        sesion.setDuracionMinutos(duracion);
        sesion.setFechaInicio(inicio);
        sesion.setFechaFin(LocalDateTime.now());
        return sesion;
    }
}
