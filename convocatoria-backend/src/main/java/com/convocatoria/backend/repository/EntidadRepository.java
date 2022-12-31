package com.convocatoria.backend.repository;

import java.util.Optional;

import com.convocatoria.backend.model.entity.Entidad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface EntidadRepository extends JpaRepository<Entidad, Long>, JpaSpecificationExecutor<Entidad> {

	Optional<Entidad> findByCodigo(String codigo);

	boolean existsByCodigo(String codigo);

}
