package com.convocatoria.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.model.entity.Caracter;
import com.convocatoria.backend.repository.CaracterRepository;

@Service
@Transactional
public class CaracterService {

	@Autowired
	CaracterRepository caracterRepository;

	public long count() {
		return caracterRepository.count();
	}

	public List<Caracter> findAll(Sort sort) {
		return caracterRepository.findAll(sort);
	}

	public Optional<Caracter> findById(Long id) {
		return caracterRepository.findById(id);
	}

	public Optional<Caracter> findByAcronimo(String acronimo) {
		return caracterRepository.findByAcronimo(acronimo);
	}

	public boolean existsById(Long id) {
		return caracterRepository.existsById(id);
	}

	public boolean existsByAcronimo(String acronimo) {
		return caracterRepository.existsByAcronimo(acronimo);
	}

	public Caracter save(Caracter caracter) {
		return caracterRepository.save(caracter);
	}

	public void deleteById(Long id) {
		caracterRepository.deleteById(id);
	}

}
