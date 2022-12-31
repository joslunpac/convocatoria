package com.convocatoria.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.convocatoria.backend.model.entity.Entidad;

public interface EntidadRepository extends JpaRepository<Entidad, Long>, JpaSpecificationExecutor<Entidad> {

	Optional<Entidad> findByCodigo(String codigo);

	boolean existsByCodigo(String codigo);

}
