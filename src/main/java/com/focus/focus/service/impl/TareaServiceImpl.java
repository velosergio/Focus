package com.focus.focus.service.impl;

// import com.focus.focus.model.entity.Usuario;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.repository.TareaRepository;
import com.focus.focus.repository.UsuarioRepository;
import com.focus.focus.service.TareaService;
import org.springframework.stereotype.Service;

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
    public Optional<Tarea> findById(Long id) {
        return tareaRepository.findById(id);
    }

    @Override
    public Tarea save(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    @Override
    public void deleteById(Long id) {
        tareaRepository.deleteById(id);
    }
}
