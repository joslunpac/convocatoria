package com.convocatoria.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.model.entity.TipoActoCulto;
import com.convocatoria.backend.repository.TipoActoCultoRepository;

@Service
@Transactional
public class TipoActoCultoService {

	@Autowired
	TipoActoCultoRepository tipoActoCultoRepository;

	public long count() {
		return tipoActoCultoRepository.count();
	}

	public List<TipoActoCulto> findAll(Sort sort) {
		return tipoActoCultoRepository.findAll(sort);
	}

	public Optional<TipoActoCulto> findById(Long id) {
		return tipoActoCultoRepository.findById(id);
	}

	public boolean existsById(Long id) {
		return tipoActoCultoRepository.existsById(id);
	}

	public TipoActoCulto save(TipoActoCulto tipoActoCulto) {
		return tipoActoCultoRepository.save(tipoActoCulto);
	}

	public void deleteById(Long id) {
		tipoActoCultoRepository.deleteById(id);
	}

}
