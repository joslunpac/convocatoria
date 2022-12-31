package com.convocatoria.backend.repository;

import java.util.Optional;

import com.convocatoria.backend.model.entity.TipoBanda;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoBandaRepository extends JpaRepository<TipoBanda, Long> {

	Optional<TipoBanda> findByAcronimo(String acronimo);

	boolean existsByAcronimo(String acronimo);

}
