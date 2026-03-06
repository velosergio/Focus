package com.focus.focus.repository;

import com.focus.focus.model.entity.SesionPomodoro;
import com.focus.focus.model.entity.TipoSesionPomodoro;
import com.focus.focus.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SesionPomodoroRepository extends JpaRepository<SesionPomodoro, Long> {

    List<SesionPomodoro> findByTareaUsuarioAndTipoAndFechaFinBetween(
            Usuario usuario, TipoSesionPomodoro tipo, LocalDateTime start, LocalDateTime end);
}
