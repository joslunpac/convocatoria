package com.convocatoria.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.convocatoria.backend.model.entity.Caracter;

public interface CaracterRepository extends JpaRepository<Caracter, Long>, JpaSpecificationExecutor<Caracter> {

	Optional<Caracter> findByAcronimo(String acronimo);

	boolean existsByAcronimo(String acronimo);

}
