package com.focus.focus.controller;

import com.focus.focus.dto.CreateTaskRequest;
import com.focus.focus.dto.TareaDto;
import com.focus.focus.dto.TareaMapper;
import com.focus.focus.dto.UpdateTaskRequest;
import com.focus.focus.model.entity.EstadoTarea;
import com.focus.focus.model.entity.Prioridad;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.Usuario;
import com.focus.focus.security.SecurityUser;
import com.focus.focus.service.TareaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TareaService tareaService;

    public TaskController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    public ResponseEntity<List<TareaDto>> list(
            @AuthenticationPrincipal SecurityUser user,
            @RequestParam(required = false) EstadoTarea estado,
            @RequestParam(required = false) Prioridad prioridad,
            @RequestParam(required = false) String etiquetas
    ) {
        Usuario usuario = user.getUsuario();
        List<String> etiquetasList = etiquetas != null && !etiquetas.isBlank()
                ? Arrays.stream(etiquetas.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList())
                : null;
        List<Tarea> tareas = tareaService.findByUsuarioWithFilters(usuario, estado, prioridad, etiquetasList);
        return ResponseEntity.ok(TareaMapper.toDtoList(tareas));
    }

    @PostMapping
    public ResponseEntity<TareaDto> create(
            @AuthenticationPrincipal SecurityUser user,
            @Valid @RequestBody CreateTaskRequest request
    ) {
        Tarea tarea = tareaService.create(user.getUsuario(), request);
        return ResponseEntity.status(201).body(TareaMapper.toDto(tarea));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TareaDto> getById(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id
    ) {
        Tarea tarea = tareaService.findByIdAndUsuario(id, user.getUsuario())
                .orElseThrow(() -> new com.focus.focus.exception.TareaNotFoundException(id));
        return ResponseEntity.ok(TareaMapper.toDto(tarea));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TareaDto> update(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        Tarea tarea = tareaService.update(id, user.getUsuario(), request);
        return ResponseEntity.ok(TareaMapper.toDto(tarea));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal SecurityUser user,
            @PathVariable Long id
    ) {
        tareaService.delete(id, user.getUsuario());
        return ResponseEntity.noContent().build();
    }
}
