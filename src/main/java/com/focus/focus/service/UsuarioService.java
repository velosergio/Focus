package com.focus.focus.service;

import com.focus.focus.model.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {

    List<Usuario> findAll();

    Optional<Usuario> findById(Long id);

    Optional<Usuario> findByEmail(String email);

    Usuario save(Usuario usuario);
}
