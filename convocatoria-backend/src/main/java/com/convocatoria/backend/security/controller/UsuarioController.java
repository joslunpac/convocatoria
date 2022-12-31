package com.convocatoria.backend.security.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.convocatoria.backend.exception.MyConflictException;
import com.convocatoria.backend.exception.MyNotFoundException;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.security.model.dto.UsuarioDto;
import com.convocatoria.backend.security.model.entity.Usuario;
import com.convocatoria.backend.security.service.UsuarioService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class UsuarioController {

	private static final String ENTIDAD = Constantes.USUARIO;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	UsuarioService usuarioService;

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/usuarios")
	public ResponseEntity<List<UsuarioDto>> findAll(@RequestParam(defaultValue = "nombre,asc,apellidos,asc") String[] sort) {
		List<Usuario> usuarios = usuarioService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (usuarios.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<UsuarioDto> usuarioDtos = usuarios.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(usuarioDtos, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/usuarios")
	public ResponseEntity<UsuarioDto> create(@Valid @RequestBody UsuarioDto usuarioDto) {
		if (usuarioService.existsByEmail(usuarioDto.getEmail().toLowerCase()))
			throw new MyConflictException("El email " + usuarioDto.getEmail().toLowerCase() + Constantes.YA_EXISTE);

		usuarioDto.setId(null);
		usuarioDto.setEmail(usuarioDto.getEmail().toLowerCase());
		usuarioDto.setPassword(passwordEncoder.encode(usuarioDto.getPassword()));

		Usuario usuario = mappers.convertToEntity(usuarioDto);
		usuarioDto = mappers.convertToDto(usuarioService.save(usuario));
		return new ResponseEntity<>(usuarioDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/usuarios/{id}")
	public ResponseEntity<UsuarioDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody UsuarioDto usuarioDto) {
		Usuario usuario = usuarioService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		usuarioDto.setId(id);
		usuarioDto.setEmail(usuarioDto.getEmail().toLowerCase());
		usuarioDto.setPassword(usuario.getPassword());
		usuarioDto.setUsuarioCreacion(usuario.getUsuarioCreacion());
		usuarioDto.setFechaCreacion(usuario.getFechaCreacion());

		Usuario nuevoUsuario = mappers.convertToEntity(usuarioDto);
		usuarioDto = mappers.convertToDto(usuarioService.save(nuevoUsuario));
		return new ResponseEntity<>(usuarioDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/usuarios/{id}/updatePassword")
	public ResponseEntity<UsuarioDto> updatePassword(
			@PathVariable("id") Long id,
			@RequestBody String nuevoPassword) {
		if (!usuarioService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);
	
		usuarioService.updatePassword(id, passwordEncoder.encode(nuevoPassword));

		Usuario usuario = usuarioService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		UsuarioDto usuarioDto = mappers.convertToDto(usuario);
		return new ResponseEntity<>(usuarioDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/usuarios/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!usuarioService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		usuarioService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}