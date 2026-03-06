package com.focus.focus.controller;

import com.focus.focus.dto.CompletePomodoroRequest;
import com.focus.focus.dto.SesionPomodoroDto;
import com.focus.focus.dto.SesionPomodoroMapper;
import com.focus.focus.model.entity.SesionPomodoro;
import com.focus.focus.security.SecurityUser;
import com.focus.focus.service.PomodoroService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pomodoros")
public class PomodoroController {

    private final PomodoroService pomodoroService;

    public PomodoroController(PomodoroService pomodoroService) {
        this.pomodoroService = pomodoroService;
    }

    @PostMapping("/complete")
    public ResponseEntity<SesionPomodoroDto> complete(
            @AuthenticationPrincipal SecurityUser user,
            @Valid @RequestBody CompletePomodoroRequest request
    ) {
        SesionPomodoro sesion = pomodoroService.completeSession(user.getUsuario(), request);
        return ResponseEntity.status(201).body(SesionPomodoroMapper.toDto(sesion));
    }
}
