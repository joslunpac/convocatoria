package com.convocatoria.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.convocatoria.backend.model.entity.Titular;

public interface TitularRepository extends JpaRepository<Titular, Long>, JpaSpecificationExecutor<Titular> {

}
