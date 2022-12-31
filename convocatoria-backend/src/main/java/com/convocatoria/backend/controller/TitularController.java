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
import com.convocatoria.backend.model.dto.TitularDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.Titular;
import com.convocatoria.backend.service.TitularService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class TitularController {

	private static final String ENTIDAD = Constantes.TITULAR;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	TitularService titularService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/titulares")
	public ResponseEntity<List<TitularDto>> findAll(@RequestParam(defaultValue = "nombre,asc") String[] sort) {
		List<Titular> titulares = titularService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (titulares.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<TitularDto> titularDtos = titulares.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(titularDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/titulares" + Constantes.BY_CRITERIA)
	public ResponseEntity<List<TitularDto>> findAllByCriteria(
			@RequestParam(required = false) Long[] caracteresId,
			@RequestParam(defaultValue = "false") boolean sinCaracter,
			@RequestParam(defaultValue = "nombre,asc") String[] sort) {
		List<Titular> titulares = titularService.findAllByCriteria(null, caracteresId, sinCaracter, Sort.by(utilidades.construirOrders(sort)));

		if (titulares.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<TitularDto> titularDtos = titulares.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(titularDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/titulares/{id}")
	public ResponseEntity<TitularDto> find(@PathVariable("id") Long id) {
		Titular titular = titularService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		TitularDto titularDto = mappers.convertToDto(titular);
		return new ResponseEntity<>(titularDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/titulares")
	public ResponseEntity<TitularDto> create(@Valid @RequestBody TitularDto titularDto) {
		titularDto.setId(null);
		Titular titular = mappers.convertToEntity(titularDto);
		titularDto = mappers.convertToDto(titularService.save(titular));
		return new ResponseEntity<>(titularDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/titulares/{id}")
	public ResponseEntity<TitularDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody TitularDto titularDto) {
		if (!titularService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		titularDto.setId(id);
		Titular titular = titularService.save(mappers.convertToEntity(titularDto));
		titularDto = mappers.convertToDto(titular);
		return new ResponseEntity<>(titularDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/titulares/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!titularService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		titularService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
