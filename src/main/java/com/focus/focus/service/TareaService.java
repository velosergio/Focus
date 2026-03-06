package com.focus.focus.service;

import com.focus.focus.model.entity.Tarea;

import java.util.List;
import java.util.Optional;

public interface TareaService {

    List<Tarea> findAll();

    List<Tarea> findByUsuarioId(Long usuarioId);

    Optional<Tarea> findById(Long id);

    Tarea save(Tarea tarea);

    void deleteById(Long id);
}
