package com.focus.focus.service.impl;

import com.focus.focus.dto.AuthResponse;
import com.focus.focus.dto.LoginRequest;
import com.focus.focus.dto.RegisterRequest;
import com.focus.focus.dto.UsuarioMapper;
import com.focus.focus.dto.UsuarioDto;
import com.focus.focus.exception.EmailAlreadyExistsException;
import com.focus.focus.exception.InvalidCredentialsException;
import com.focus.focus.model.entity.Usuario;
import com.focus.focus.repository.UsuarioRepository;
import com.focus.focus.security.JwtService;
import com.focus.focus.security.SecurityUser;
import com.focus.focus.service.AuthService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AuthServiceImpl(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("El email ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre());
        usuario.setEmail(request.email());
        usuario.setPassword(passwordEncoder.encode(request.password()));

        usuario = usuarioRepository.save(usuario);

        UserDetails userDetails = new SecurityUser(usuario);
        String token = jwtService.generateToken(userDetails);
        UsuarioDto usuarioDto = UsuarioMapper.toDto(usuario);

        return AuthResponse.of(token, usuarioDto);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(request.email());
        } catch (org.springframework.security.core.userdetails.UsernameNotFoundException e) {
            throw new InvalidCredentialsException("Email o contraseña incorrectos");
        }

        if (!passwordEncoder.matches(request.password(), userDetails.getPassword())) {
            throw new InvalidCredentialsException("Email o contraseña incorrectos");
        }

        String token = jwtService.generateToken(userDetails);
        Usuario usuario = ((SecurityUser) userDetails).getUsuario();
        UsuarioDto usuarioDto = UsuarioMapper.toDto(usuario);

        return AuthResponse.of(token, usuarioDto);
    }
}
