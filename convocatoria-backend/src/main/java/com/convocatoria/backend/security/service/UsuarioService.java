package com.convocatoria.backend.security.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.security.model.entity.Usuario;
import com.convocatoria.backend.security.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {

	@Autowired
	UsuarioRepository usuarioRepository;

	public long count() {
		return usuarioRepository.count();
	}

	public List<Usuario> findAll(Sort sort) {
		return usuarioRepository.findAll(sort);
	}

	public Optional<Usuario> findById(Long id) {
		return usuarioRepository.findById(id);
	}

	public Optional<Usuario> findByEmail(String email) {
		return usuarioRepository.findByEmail(email);
	}

	public boolean existsById(Long id) {
		return usuarioRepository.existsById(id);
	}

	public boolean existsByEmail(String email) {
		return usuarioRepository.existsByEmail(email);
	}

	public Usuario save(Usuario usuario) {
		return usuarioRepository.save(usuario);
	}

	public void updatePassword(Long id, String nuevoPassword) {
		usuarioRepository.updatePassword(id, nuevoPassword);
	}

	public void deleteById(Long id) {
		usuarioRepository.deleteById(id);
	}

}
