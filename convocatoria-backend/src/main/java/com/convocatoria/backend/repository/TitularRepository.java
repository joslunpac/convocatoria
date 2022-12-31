package com.convocatoria.backend.repository;

import com.convocatoria.backend.model.entity.Titular;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TitularRepository extends JpaRepository<Titular, Long>, JpaSpecificationExecutor<Titular> {

}
