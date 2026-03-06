package com.focus.focus.service.impl;

import com.focus.focus.dto.CompletePomodoroRequest;
import com.focus.focus.exception.TareaNotFoundException;
import com.focus.focus.model.entity.SesionPomodoro;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.TipoSesionPomodoro;
import com.focus.focus.model.entity.Usuario;
import com.focus.focus.repository.SesionPomodoroRepository;
import com.focus.focus.repository.TareaRepository;
import com.focus.focus.service.PomodoroService;
import com.focus.focus.service.SesionPomodoroFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PomodoroServiceImpl implements PomodoroService {

    private final TareaRepository tareaRepository;
    private final SesionPomodoroRepository sesionPomodoroRepository;
    private final SesionPomodoroFactory sesionPomodoroFactory;

    public PomodoroServiceImpl(TareaRepository tareaRepository,
                               SesionPomodoroRepository sesionPomodoroRepository,
                               SesionPomodoroFactory sesionPomodoroFactory) {
        this.tareaRepository = tareaRepository;
        this.sesionPomodoroRepository = sesionPomodoroRepository;
        this.sesionPomodoroFactory = sesionPomodoroFactory;
    }

    @Override
    @Transactional
    public SesionPomodoro completeSession(Usuario usuario, CompletePomodoroRequest request) {
        Tarea tarea = tareaRepository.findById(request.taskId())
                .filter(t -> t.getUsuario() != null && t.getUsuario().getId().equals(usuario.getId()))
                .orElseThrow(() -> new TareaNotFoundException(request.taskId()));

        LocalDateTime inicio = request.fechaInicio() != null ? request.fechaInicio() : LocalDateTime.now().minusMinutes(25);
        SesionPomodoro sesion = sesionPomodoroFactory.create(request.tipo(), tarea, inicio);
        sesion = sesionPomodoroRepository.save(sesion);

        if (request.tipo() == TipoSesionPomodoro.TRABAJO) {
            tarea.setPomodorosCompletados(tarea.getPomodorosCompletados() + 1);
            tareaRepository.save(tarea);
        }

        return sesion;
    }
}
