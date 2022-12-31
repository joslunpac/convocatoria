package com.convocatoria.backend.security.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.security.model.dto.RolDto;
import com.convocatoria.backend.security.model.entity.Rol;
import com.convocatoria.backend.security.service.RolService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class RolController {

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	RolService rolService;

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/roles")
	public ResponseEntity<List<RolDto>> findAll(@RequestParam(defaultValue = "nombre,asc") String[] sort) {
		List<Rol> roles = rolService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (roles.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<RolDto> rolDtos = roles.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(rolDtos, HttpStatus.OK);
	}

}
