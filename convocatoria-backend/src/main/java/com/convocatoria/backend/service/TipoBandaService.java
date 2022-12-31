package com.convocatoria.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.model.entity.TipoBanda;
import com.convocatoria.backend.repository.TipoBandaRepository;

@Service
@Transactional
public class TipoBandaService {

	@Autowired
	TipoBandaRepository tipoBandaRepository;

	public long count() {
		return tipoBandaRepository.count();
	}

	public List<TipoBanda> findAll(Sort sort) {
		return tipoBandaRepository.findAll(sort);
	}

	public Optional<TipoBanda> findById(Long id) {
		return tipoBandaRepository.findById(id);
	}

	public boolean existsById(Long id) {
		return tipoBandaRepository.existsById(id);
	}

	public boolean existsByAcronimo(String acronimo) {
		return tipoBandaRepository.existsByAcronimo(acronimo);
	}

	public TipoBanda save(TipoBanda tipoBanda) {
		return tipoBandaRepository.save(tipoBanda);
	}

	public void deleteById(Long id) {
		tipoBandaRepository.deleteById(id);
	}

}
