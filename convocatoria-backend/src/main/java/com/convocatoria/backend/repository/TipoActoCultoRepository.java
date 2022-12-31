package com.convocatoria.backend.repository;

import com.convocatoria.backend.model.entity.TipoActoCulto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoActoCultoRepository extends JpaRepository<TipoActoCulto, Long> {

}
