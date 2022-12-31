package com.convocatoria.backend.security.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.security.model.entity.Rol;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.convocatoria.backend.security.repository.RolRepository;

@Service
@Transactional
public class RolService {

	@Autowired
	RolRepository rolRepository;

	public long count() {
		return rolRepository.count();
	}

	public List<Rol> findAll(Sort sort) {
		return rolRepository.findAll(sort);
	}

	public Optional<Rol> findByNombre(RolEnum nombre) {
		return rolRepository.findByNombre(nombre);
	}

	public Rol save(Rol rol) {
		return rolRepository.save(rol);
	}

}
