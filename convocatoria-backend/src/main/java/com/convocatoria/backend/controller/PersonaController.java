package com.convocatoria.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

import com.convocatoria.backend.exception.MyNotFoundException;
import com.convocatoria.backend.model.dto.PersonaDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.Persona;
import com.convocatoria.backend.model.enumerate.GeneroEnum;
import com.convocatoria.backend.service.PersonaService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class PersonaController {

	private static final String ENTIDAD = Constantes.PERSONA;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	PersonaService personaService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/personas")
	public ResponseEntity<List<PersonaDto>> findAll(@RequestParam(defaultValue = "nombre,asc") String[] sort) {
		List<Persona> personas = personaService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (personas.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<PersonaDto> personaDtos = personas.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(personaDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/personas" + Constantes.BY_CRITERIA)
	public ResponseEntity<List<PersonaDto>> findAllByCriteria(
			@RequestParam(required = false) GeneroEnum[] generos,
			@RequestParam(defaultValue = "nombre,asc") String[] sort) {
		List<Persona> personas = personaService.findAllByCriteria(generos, Sort.by(utilidades.construirOrders(sort)));

		if (personas.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<PersonaDto> personaDtos = personas.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(personaDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/personas/{id}")
	public ResponseEntity<PersonaDto> find(@PathVariable("id") Long id) {
		Persona persona = personaService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA));

		PersonaDto personaDto = mappers.convertToDto(persona);
		return new ResponseEntity<>(personaDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/personas")
	public ResponseEntity<PersonaDto> create(@Valid @RequestBody PersonaDto personaDto) {
		personaDto.setId(null);
		Persona persona = mappers.convertToEntity(personaDto);
		personaDto = mappers.convertToDto(personaService.save(persona));
		return new ResponseEntity<>(personaDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/personas/{id}")
	public ResponseEntity<PersonaDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody PersonaDto personaDto) {
		if (!personaService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		personaDto.setId(id);
		Persona persona = personaService.save(mappers.convertToEntity(personaDto));
		personaDto = mappers.convertToDto(persona);
		return new ResponseEntity<>(personaDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/personas/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!personaService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		personaService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
