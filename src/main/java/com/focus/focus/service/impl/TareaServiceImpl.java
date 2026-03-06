package com.focus.focus.service.impl;

import com.focus.focus.dto.CreateTaskRequest;
import com.focus.focus.dto.UpdateTaskRequest;
//import com.focus.focus.exception.ForbiddenException;
import com.focus.focus.exception.TareaNotFoundException;
import com.focus.focus.model.entity.EstadoTarea;
import com.focus.focus.model.entity.Prioridad;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.Usuario;
import com.focus.focus.repository.TareaRepository;
import com.focus.focus.repository.TareaSpecification;
import com.focus.focus.repository.UsuarioRepository;
import com.focus.focus.service.TareaService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TareaServiceImpl implements TareaService {

    private final TareaRepository tareaRepository;
    private final UsuarioRepository usuarioRepository;

    public TareaServiceImpl(TareaRepository tareaRepository, UsuarioRepository usuarioRepository) {
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Tarea> findAll() {
        return tareaRepository.findAll();
    }

    @Override
    public List<Tarea> findByUsuarioId(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .map(tareaRepository::findByUsuario)
                .orElse(List.of());
    }

    @Override
    public List<Tarea> findByUsuarioWithFilters(Usuario usuario, EstadoTarea estado, Prioridad prioridad, List<String> etiquetas) {
        Specification<Tarea> spec = Specification.where(TareaSpecification.forUsuario(usuario))
                .and(TareaSpecification.withEstado(estado))
                .and(TareaSpecification.withPrioridad(prioridad))
                .and(TareaSpecification.withEtiquetas(etiquetas));
        return tareaRepository.findAll(spec);
    }

    @Override
    public Optional<Tarea> findById(Long id) {
        return tareaRepository.findById(id);
    }

    @Override
    public Optional<Tarea> findByIdAndUsuario(Long id, Usuario usuario) {
        return tareaRepository.findById(id)
                .filter(t -> t.getUsuario() != null && t.getUsuario().getId().equals(usuario.getId()));
    }

    @Override
    public Tarea save(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    @Override
    public Tarea create(Usuario usuario, CreateTaskRequest request) {
        Tarea tarea = new Tarea();
        tarea.setUsuario(usuario);
        tarea.setTitulo(request.titulo());
        tarea.setDescripcion(request.descripcion());
        tarea.setPrioridad(request.prioridad() != null ? request.prioridad() : Prioridad.MEDIA);
        tarea.setEtiquetas(request.etiquetas() != null ? request.etiquetas() : new ArrayList<>());
        tarea.setFechaLimite(request.fechaLimite());
        tarea.setEstimacionPomodoros(request.estimacionPomodoros() != null ? request.estimacionPomodoros() : 0);
        return tareaRepository.save(tarea);
    }

    @Override
    public Tarea update(Long id, Usuario usuario, UpdateTaskRequest request) {
        Tarea tarea = findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new TareaNotFoundException(id));
        if (request.titulo() != null) tarea.setTitulo(request.titulo());
        if (request.descripcion() != null) tarea.setDescripcion(request.descripcion());
        if (request.prioridad() != null) tarea.setPrioridad(request.prioridad());
        if (request.etiquetas() != null) tarea.setEtiquetas(request.etiquetas());
        if (request.fechaLimite() != null) tarea.setFechaLimite(request.fechaLimite());
        if (request.estimacionPomodoros() != null) tarea.setEstimacionPomodoros(request.estimacionPomodoros());
        if (request.estado() != null) tarea.setEstado(request.estado());
        return tareaRepository.save(tarea);
    }

    @Override
    public void delete(Long id, Usuario usuario) {
        Tarea tarea = findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new TareaNotFoundException(id));
        tareaRepository.delete(tarea);
    }

    @Override
    public void deleteById(Long id) {
        tareaRepository.deleteById(id);
    }
}
