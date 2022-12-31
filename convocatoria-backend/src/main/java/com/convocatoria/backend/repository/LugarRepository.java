package com.convocatoria.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.convocatoria.backend.model.entity.Lugar;

public interface LugarRepository extends JpaRepository<Lugar, Long> {

    Optional<Lugar> findByNombre(String nombre);

}
