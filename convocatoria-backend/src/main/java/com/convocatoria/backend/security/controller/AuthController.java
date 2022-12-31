package com.convocatoria.backend.security.controller;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.convocatoria.backend.exception.MyConflictException;
import com.convocatoria.backend.exception.MyUnauthorizedException;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.security.jwt.JwtProvider;
import com.convocatoria.backend.security.model.dto.JwtDto;
import com.convocatoria.backend.security.model.dto.SigninDto;
import com.convocatoria.backend.security.model.dto.SignupDto;
import com.convocatoria.backend.security.model.entity.Rol;
import com.convocatoria.backend.security.model.entity.Usuario;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.convocatoria.backend.security.service.RolService;
import com.convocatoria.backend.security.service.UsuarioService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

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

	@Autowired
	RolService rolService;

	@JsonView(Views.Public.class)
	@PostMapping(path = Constantes.URI_AUTH + "/signin")
	public ResponseEntity<JwtDto> signin(@Valid @RequestBody SigninDto signinDto) {
		// Comprobamos que el email exista ya en BD
		if (!usuarioService.existsByEmail(signinDto.getEmail().toLowerCase()))
			throw new MyUnauthorizedException(Constantes.CREDENCIALES_INCORRECTAS);

		// Autenticamos el usuario, y si existe, devolvemos el token
		return auth(signinDto.getEmail(), signinDto.getPassword());
	}

	@JsonView(Views.Public.class)
	@PostMapping(path = Constantes.URI_AUTH + "/signup")
	public ResponseEntity<JwtDto> signup(@Valid @RequestBody SignupDto signupDto) {
		// Comprobamos que el email no exista ya en BD
		if (usuarioService.existsByEmail(signupDto.getEmail().toLowerCase()))
			throw new MyConflictException(
					"El email " + signupDto.getEmail().toLowerCase() + " ya se encuentra registrado. Inicia sesión.");

		// Preparamos el nuevo usuario
		Usuario usuario = new Usuario();
		usuario.setEmail(signupDto.getEmail().toLowerCase());
		usuario.setPassword(passwordEncoder.encode(signupDto.getPassword()));
		usuario.setNombre(signupDto.getNombre());
		usuario.setApellidos(signupDto.getApellidos());

		// Por defecto se le asigna el rol [USUARIO]
		List<Rol> roles = new ArrayList<>();
		roles.add(rolService.findByNombre(RolEnum.ROLE_USUARIO).get());
		usuario.setRoles(roles);

		// Persistimos el nuevo usuario
		usuarioService.save(usuario);

		// Autenticamos el usuario, y si existe, devolvemos la autorización
		return auth(signupDto.getEmail(), signupDto.getPassword());
	}

	// Método encargado de autenticar un usuario, y si existe, devolver el token
	private ResponseEntity<JwtDto> auth(String email, String password) {
		// Autenticamos el usuario
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(email.toLowerCase(), password));

		// Una vez autenticado, lo añadimos al contexto de Spring Security
		SecurityContextHolder.getContext().setAuthentication(authentication);

		// Obtenemos los datos completos del usuario autenticado actualmente
		Usuario usuarioAutenticado = usuarioService.findByEmail(email).get();
		
		// Actualizamos el usuario autenticado para que actualice la fecha de último acceso.
		// Aunque la fecha la pongamos a nula, insertará la fecha actual.
		usuarioAutenticado.setFechaModificacion(null);
		usuarioService.save(usuarioAutenticado);
		
		// Generamos y devolvemos el Token
		String jwt = jwtProvider.generarToken(usuarioAutenticado);
		JwtDto jwtDto = new JwtDto(jwt);
		return new ResponseEntity<>(jwtDto, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@PostMapping(path = Constantes.URI_AUTH + "/refresh")
	public ResponseEntity<JwtDto> refresh(@Valid @RequestBody JwtDto jwtDto) throws ParseException {
		// Refrescamos y devolvemos el Token
		String token = jwtProvider.refrescarToken(jwtDto);
		jwtDto = new JwtDto(token);
		return new ResponseEntity<>(jwtDto, HttpStatus.OK);
	}
 
}
