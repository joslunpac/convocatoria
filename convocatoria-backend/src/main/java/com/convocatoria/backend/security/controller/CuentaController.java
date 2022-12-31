package com.convocatoria.backend.security.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.security.jwt.JwtProvider;
import com.convocatoria.backend.security.model.dto.JwtDto;
import com.convocatoria.backend.security.model.dto.UsuarioDto;
import com.convocatoria.backend.security.model.entity.Usuario;
import com.convocatoria.backend.security.service.UsuarioService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class CuentaController {

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	AuthenticationManager authenticationManager;
	
	@Autowired
	JwtProvider jwtProvider;

	@Autowired
	Mappers mappers;

	@Autowired
	UsuarioService usuarioService;

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_CUENTA)
	public ResponseEntity<UsuarioDto> getAuthenticationUser() {
		// Obtenemos el usuario autenticado actualmente con toda su información, partiendo del contexto de Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAutenticado = authentication.getName();
		Usuario usuarioAutenticado = usuarioService.findByEmail(emailAutenticado).get();

		UsuarioDto usuarioDto = mappers.convertToDto(usuarioAutenticado);
		return new ResponseEntity<>(usuarioDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = Constantes.URI_CUENTA)
	public ResponseEntity<JwtDto> updateAuthenticationUser(@Valid @RequestBody UsuarioDto usuarioDto) {
		// Obtenemos el usuario autenticado actualmente con toda su información, partiendo del contexto de Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAutenticado = authentication.getName();
		Usuario usuarioAutenticado = usuarioService.findByEmail(emailAutenticado).get();

		// Establecemos obligatoriamente el id y el email del usuario autenticado actualmente,
		// ya que dichos datos no se deben cambiar nunca, y así prevenir modificar otro usuario
		// que no sea el del contexto de Spring Security
		usuarioDto.setId(usuarioAutenticado.getId());
		usuarioDto.setEmail(usuarioAutenticado.getEmail());

		if (usuarioDto.getNuevoPassword() != null) {
			// Si se ha modificado la contraseña, la codificamos
			usuarioDto.setPassword(passwordEncoder.encode(usuarioDto.getNuevoPassword()));
		} else {
			// Si no se ha modificado la contraseña,
			// dejamos la misma contraseña del usuario autenticado actualmente
			usuarioDto.setPassword(usuarioAutenticado.getPassword());
		}

		// Por prevención, informamos los campos de auditoría que no se actualizan,
		// con los valores del usuario autenticado actualmente
		usuarioDto.setUsuarioCreacion(usuarioAutenticado.getUsuarioCreacion());
		usuarioDto.setFechaCreacion(usuarioAutenticado.getFechaCreacion());

		// Persistimos el usuario con las nuevas modificaciones
		Usuario usuarioModificado = usuarioService.save(mappers.convertToEntity(usuarioDto));

		if (usuarioDto.getNuevoPassword() != null) {
			// Si se ha modificado la contraseña, Autenticamos de nuevo el usuario
			authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(usuarioAutenticado.getEmail(), usuarioDto.getNuevoPassword()));
	
			// Una vez autenticado, lo añadimos al contexto de Spring Security
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		// Generamos y devolvemos el token
		String jwt = jwtProvider.generarToken(usuarioModificado);
		JwtDto jwtDto = new JwtDto(jwt);
		return new ResponseEntity<>(jwtDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = Constantes.URI_CUENTA)
	public ResponseEntity<HttpStatus> delete() {
		// Obtenemos el usuario autenticado actualmente con toda su información, partiendo del contexto de Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailAutenticado = authentication.getName();
		Usuario usuarioAutenticado = usuarioService.findByEmail(emailAutenticado).get();

		usuarioService.deleteById(usuarioAutenticado.getId());
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
