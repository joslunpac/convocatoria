package com.convocatoria.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.convocatoria.backend.model.entity.TipoBanda;

public interface TipoBandaRepository extends JpaRepository<TipoBanda, Long> {

	Optional<TipoBanda> findByAcronimo(String acronimo);

	boolean existsByAcronimo(String acronimo);

}
