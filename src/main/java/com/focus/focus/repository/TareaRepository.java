package com.focus.focus.repository;

import com.focus.focus.model.entity.EstadoTarea;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    List<Tarea> findByUsuario(Usuario usuario);

    List<Tarea> findByUsuarioAndEstado(Usuario usuario, EstadoTarea estado);

    List<Tarea> findByUsuarioId(Long usuarioId);
}
