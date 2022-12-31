package com.convocatoria.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.model.entity.Persona;
import com.convocatoria.backend.model.enumerate.GeneroEnum;
import com.convocatoria.backend.repository.PersonaRepository;

@Service
@Transactional
public class PersonaService {

	@Autowired
	PersonaRepository personaRepository;

	public long count() {
		return personaRepository.count();
	}

	public List<Persona> findAll(Sort sort) {
		return personaRepository.findAll(sort);
	}

	public List<Persona> findAllByCriteria(GeneroEnum[] generos, Sort sort) {
		Specification<Persona> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (generos != null && generos.length > 0) {
				// Personas que sean de uno de los siguientes géneros
				List<Predicate> predicatesGenero = new ArrayList<>();

				for (GeneroEnum generoEnum : generos) {
					predicatesGenero.add(cb.equal(root.get("genero"), generoEnum.toString()));
				}

				predicates.add(cb.or(predicatesGenero.toArray(new Predicate[] {})));
			}

			return cb.and(predicates.toArray(new Predicate[] {}));
		};

		return personaRepository.findAll(specification, sort);
	}

	public Optional<Persona> findById(Long id) {
		return personaRepository.findById(id);
	}

	public boolean existsById(Long id) {
		return personaRepository.existsById(id);
	}

	public Persona save(Persona persona) {
		return personaRepository.save(persona);
	}

	public void deleteById(Long id) {
		personaRepository.deleteById(id);
	}

}
