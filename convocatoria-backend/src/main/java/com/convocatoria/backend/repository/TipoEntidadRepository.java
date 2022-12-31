package com.convocatoria.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.convocatoria.backend.model.entity.TipoEntidad;

@Repository
public interface TipoEntidadRepository extends JpaRepository<TipoEntidad, Long> {

    Optional<TipoEntidad> findByAcronimo(String acronimo);

    boolean existsByAcronimo(String acronimo);

}
