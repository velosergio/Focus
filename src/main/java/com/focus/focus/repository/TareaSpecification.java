package com.focus.focus.repository;

import com.focus.focus.model.entity.EstadoTarea;
import com.focus.focus.model.entity.Prioridad;
import com.focus.focus.model.entity.Tarea;
import com.focus.focus.model.entity.Usuario;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public final class TareaSpecification {

    private TareaSpecification() {}

    public static Specification<Tarea> forUsuario(Usuario usuario) {
        return (root, query, cb) -> cb.equal(root.get("usuario"), usuario);
    }

    public static Specification<Tarea> withEstado(EstadoTarea estado) {
        if (estado == null) return (root, query, cb) -> cb.conjunction();
        return (root, query, cb) -> cb.equal(root.get("estado"), estado);
    }

    public static Specification<Tarea> withPrioridad(Prioridad prioridad) {
        if (prioridad == null) return (root, query, cb) -> cb.conjunction();
        return (root, query, cb) -> cb.equal(root.get("prioridad"), prioridad);
    }

    public static Specification<Tarea> withEtiquetas(List<String> etiquetas) {
        if (etiquetas == null || etiquetas.isEmpty()) return (root, query, cb) -> cb.conjunction();
        return (root, query, cb) -> {
            query.distinct(true);
            var etiquetasJoin = root.join("etiquetas", JoinType.INNER);
            return etiquetasJoin.in(etiquetas);
        };
    }
}
