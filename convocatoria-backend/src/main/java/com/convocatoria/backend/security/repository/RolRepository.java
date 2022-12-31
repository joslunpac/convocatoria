package com.convocatoria.backend.security.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.convocatoria.backend.security.model.entity.Rol;
import com.convocatoria.backend.security.model.enumerate.RolEnum;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombre(RolEnum nombre);

}
