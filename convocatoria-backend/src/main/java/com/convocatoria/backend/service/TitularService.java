package com.convocatoria.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.model.entity.Entidad;
import com.convocatoria.backend.model.entity.Titular;
import com.convocatoria.backend.repository.TitularRepository;

@Service
@Transactional
public class TitularService {

	@Autowired
	TitularRepository titularRepository;

	public long count() {
		return titularRepository.count();
	}

	public List<Titular> findAll(Sort sort) {
		return titularRepository.findAll(sort);
	}

	public List<Titular> findAllByCriteria(Entidad entidad, Long[] caracteresId, boolean sinCaracter, Sort sort) {
		Specification<Titular> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (entidad != null)
				// Titulares de una Entidad
				predicates.add(cb.equal(root.get("entidad"), entidad));

			List<Predicate> predicatesCaracter = new ArrayList<>();

			if (caracteresId != null && caracteresId.length > 0) {
				// Titulares que contengan alguno de los siguientes carácteres
				for (Long caracterId : caracteresId) {
					predicatesCaracter.add(cb.equal(root.get("caracter").get("id"), caracterId));
				}
			}

			if (sinCaracter) {
				// Titulares que no contengan ningún carácter
				predicatesCaracter.add(root.join("caracter", JoinType.LEFT).isNull());
			}

			predicates.add(cb.or(predicatesCaracter.toArray(new Predicate[] {})));

			return cb.and(predicates.toArray(new Predicate[] {}));
		};

		return titularRepository.findAll(specification, sort);
	}

	public Optional<Titular> findById(Long id) {
		return titularRepository.findById(id);
	}

	public boolean existsById(Long id) {
		return titularRepository.existsById(id);
	}

	public Titular save(Titular titular) {
		return titularRepository.save(titular);
	}

	public void deleteById(Long id) {
		titularRepository.deleteById(id);
	}

}
