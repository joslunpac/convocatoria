package com.convocatoria.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.model.entity.TipoEntidad;
import com.convocatoria.backend.repository.TipoEntidadRepository;

@Service
@Transactional
public class TipoEntidadService {

	@Autowired
	TipoEntidadRepository tipoEntidadRepository;

	public long count() {
		return tipoEntidadRepository.count();
	}

	public List<TipoEntidad> findAll(Sort sort) {
		return tipoEntidadRepository.findAll(sort);
	}

	public Optional<TipoEntidad> findById(Long id) {
		return tipoEntidadRepository.findById(id);
	}

	public Optional<TipoEntidad> findByAcronimo(String acronimo) {
		return tipoEntidadRepository.findByAcronimo(acronimo);
	}

	public boolean existsById(Long id) {
		return tipoEntidadRepository.existsById(id);
	}

	public boolean existsByAcronimo(String acronimo) {
		return tipoEntidadRepository.existsByAcronimo(acronimo);
	}

	public TipoEntidad save(TipoEntidad tipoEntidad) {
		return tipoEntidadRepository.save(tipoEntidad);
	}

	public void deleteById(Long id) {
		tipoEntidadRepository.deleteById(id);
	}

}
