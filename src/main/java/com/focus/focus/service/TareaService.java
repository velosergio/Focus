package com.focus.focus.service;

import com.focus.focus.dto.CreateTaskRequest;
import com.focus.focus.dto.UpdateTaskRequest;
import com.focus.focus.model.entity.EstadoTarea;
import com.focus.focus.model.entity.Prioridad;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface TareaService {

    List<Tarea> findAll();

    List<Tarea> findByUsuarioId(Long usuarioId);

    List<Tarea> findByUsuarioWithFilters(Usuario usuario, EstadoTarea estado, Prioridad prioridad, List<String> etiquetas);

    Optional<Tarea> findById(Long id);

    Optional<Tarea> findByIdAndUsuario(Long id, Usuario usuario);

    Tarea save(Tarea tarea);

    Tarea create(Usuario usuario, CreateTaskRequest request);

    Tarea update(Long id, Usuario usuario, UpdateTaskRequest request);

    void delete(Long id, Usuario usuario);

    void deleteById(Long id);
}
