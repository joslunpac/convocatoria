package com.convocatoria.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.convocatoria.backend.model.entity.Evento;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long>, JpaSpecificationExecutor<Evento> {

    void deleteByEventoPadre_Id(Long idPadre);

    long countByEventoPadre_Id(Long idPadre);

    @Query(value = "select distinct(eve.tipo) from eve where eve.tipo is not null order by 1", nativeQuery = true)
    List<String> findDistinctTipoNative();

    @Query(value = "select distinct(eve.marco) from eve where eve.marco is not null order by 1", nativeQuery = true)
    List<String> findDistinctMarcoNative();

    @Query(value = "select distinct(eve.hito) from eve where eve.hito is not null order by 1", nativeQuery = true)
    List<String> findDistinctHitoNative();

    @Query(value = "select distinct(eve.informacion) from eve where eve.informacion is not null order by 1", nativeQuery = true)
    List<String> findDistinctInformacionNative();

    @Query(value = "select distinct(eve.regla) from eve where eve.regla is not null order by 1", nativeQuery = true)
    List<String> findDistinctReglaNative();

}
