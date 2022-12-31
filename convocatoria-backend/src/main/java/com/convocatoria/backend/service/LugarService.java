package com.convocatoria.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.model.entity.Lugar;
import com.convocatoria.backend.repository.LugarRepository;

@Service
@Transactional
public class LugarService {

	@Autowired
	LugarRepository lugarRepository;

	public long count() {
		return lugarRepository.count();
	}

	public List<Lugar> findAll(Sort sort) {
		return lugarRepository.findAll(sort);
	}

	public Optional<Lugar> findById(Long id) {
		return lugarRepository.findById(id);
	}

	public Optional<Lugar> findByNombre(String nombre) {
		return lugarRepository.findByNombre(nombre);
	}

	public boolean existsById(Long id) {
		return lugarRepository.existsById(id);
	}

	public Lugar save(Lugar lugar) {
		return lugarRepository.save(lugar);
	}

	public void deleteById(Long id) {
		lugarRepository.deleteById(id);
	}

}
