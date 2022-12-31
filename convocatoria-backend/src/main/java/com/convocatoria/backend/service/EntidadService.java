package com.convocatoria.backend.service;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.convocatoria.backend.model.entity.Lugar;
import com.convocatoria.backend.repository.EntidadRepository;
import com.convocatoria.backend.security.model.enumerate.RolEnum;

@Service
@Transactional
public class EntidadService {

	@Autowired
	EntidadRepository entidadRepository;

	public long count() {
		return entidadRepository.count();
	}

	public List<Entidad> findAll(RolEnum rol, Sort sort) {
		Specification<Entidad> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (rol.equals(RolEnum.ROLE_USUARIO))
				// Entidades visibles
				predicates.add(cb.isTrue(root.get("visible").as(Boolean.class)));

			return cb.and(predicates.toArray(new Predicate[] {}));
		};

		return entidadRepository.findAll(specification, sort);
	}

	public List<Entidad> findAllByCriteria(RolEnum rol, Long[] tiposEntidadId, Long[] caracteresId,
			Lugar lugar, boolean noVisibles, boolean pendienteRevisar, Sort sort) {
		Specification<Entidad> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (rol.equals(RolEnum.ROLE_USUARIO))
				// Entidades visibles
				predicates.add(cb.isTrue(root.get("visible").as(Boolean.class)));

			List<Predicate> predicatesTipoEntidadCaracter = new ArrayList<>();

			if (tiposEntidadId != null && tiposEntidadId.length > 0) {
				// Entidades que contengan alguno de los siguientes tipos de entidad
				for (Long tipoEntidadId : tiposEntidadId) {
					predicatesTipoEntidadCaracter.add(cb.equal(root.get("tipoEntidad").get("id"), tipoEntidadId));
				}
			}

			if (caracteresId != null && caracteresId.length > 0) {
				// Entidades que contengan alguno de los siguientes carácteres
				predicatesTipoEntidadCaracter.add(root.join("caracteres", JoinType.LEFT).in(Arrays.asList(caracteresId)));
			}

			predicates.add(cb.or(predicatesTipoEntidadCaracter.toArray(new Predicate[] {})));

			if (lugar != null)
				// Entidades de un Lugar
				predicates.add(cb.equal(root.get("lugar"), lugar));

			if (noVisibles)
				// Entidades no visibles
				predicates.add(cb.isFalse(root.get("visible").as(Boolean.class)));

			if (pendienteRevisar)
				// Entidades pendientes de revisar
				predicates.add(cb.isTrue(root.get("pendienteRevisar").as(Boolean.class)));

			// Indicamos que aplique distinct al resultado
			query.distinct(true);

			return cb.and(predicates.toArray(new Predicate[] {}));
		};

		return entidadRepository.findAll(specification, sort);
	}

	public Optional<Entidad> findById(RolEnum rol, Long id) {
		Specification<Entidad> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (rol.equals(RolEnum.ROLE_USUARIO))
				// Entidad visible
				predicates.add(cb.isTrue(root.get("visible").as(Boolean.class)));

			if (id != null)
				predicates.add(cb.equal(root.get("id"), id));

			return cb.and(predicates.toArray(new Predicate[] {}));
		};

		return entidadRepository.findOne(specification);
	}

	public Optional<Entidad> findByCodigo(String codigo) {
		return entidadRepository.findByCodigo(codigo);
	}

	public boolean existsById(Long id) {
		return entidadRepository.existsById(id);
	}

	public boolean existsByCodigo(String codigo) {
		return entidadRepository.existsByCodigo(codigo);
	}

	public Entidad save(Entidad entidad) {
		return entidadRepository.save(entidad);
	}

	public void deleteById(Long id) {
		entidadRepository.deleteById(id);
	}

}
