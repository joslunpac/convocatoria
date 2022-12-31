package com.convocatoria.backend.repository;

import java.util.Optional;

import com.convocatoria.backend.model.entity.Lugar;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LugarRepository extends JpaRepository<Lugar, Long> {

    Optional<Lugar> findByNombre(String nombre);

}
