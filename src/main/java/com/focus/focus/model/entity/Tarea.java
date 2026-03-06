package com.focus.focus.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tarea")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad = Prioridad.MEDIA;

    @ElementCollection
    @CollectionTable(name = "tarea_etiquetas", joinColumns = @JoinColumn(name = "tarea_id"))
    @Column(name = "etiqueta")
    private List<String> etiquetas = new ArrayList<>();

    @Column(name = "fecha_limite")
    private LocalDate fechaLimite;

    @Column(name = "estimacion_pomodoros")
    private Integer estimacionPomodoros = 0;

    @Column(name = "pomodoros_completados")
    private Integer pomodorosCompletados = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoTarea estado = EstadoTarea.PENDIENTE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Prioridad getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Prioridad prioridad) {
        this.prioridad = prioridad;
    }

    public List<String> getEtiquetas() {
        return etiquetas;
    }

    public void setEtiquetas(List<String> etiquetas) {
        this.etiquetas = etiquetas != null ? etiquetas : new ArrayList<>();
    }

    public LocalDate getFechaLimite() {
        return fechaLimite;
    }

    public void setFechaLimite(LocalDate fechaLimite) {
        this.fechaLimite = fechaLimite;
    }

    public Integer getEstimacionPomodoros() {
        return estimacionPomodoros;
    }

    public void setEstimacionPomodoros(Integer estimacionPomodoros) {
        this.estimacionPomodoros = estimacionPomodoros != null ? estimacionPomodoros : 0;
    }

    public Integer getPomodorosCompletados() {
        return pomodorosCompletados;
    }

    public void setPomodorosCompletados(Integer pomodorosCompletados) {
        this.pomodorosCompletados = pomodorosCompletados != null ? pomodorosCompletados : 0;
    }

    public EstadoTarea getEstado() {
        return estado;
    }

    public void setEstado(EstadoTarea estado) {
        this.estado = estado != null ? estado : EstadoTarea.PENDIENTE;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
