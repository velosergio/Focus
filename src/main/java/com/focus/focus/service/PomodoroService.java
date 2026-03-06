package com.focus.focus.service;

import com.focus.focus.dto.CompletePomodoroRequest;
import com.focus.focus.model.entity.SesionPomodoro;
import com.focus.focus.model.entity.Usuario;

public interface PomodoroService {

    SesionPomodoro completeSession(Usuario usuario, CompletePomodoroRequest request);
}
