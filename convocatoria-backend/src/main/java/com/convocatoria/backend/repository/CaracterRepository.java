package com.convocatoria.backend.repository;

import java.util.Optional;

import com.convocatoria.backend.model.entity.Caracter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CaracterRepository extends JpaRepository<Caracter, Long>, JpaSpecificationExecutor<Caracter> {

	Optional<Caracter> findByAcronimo(String acronimo);

	boolean existsByAcronimo(String acronimo);

}
