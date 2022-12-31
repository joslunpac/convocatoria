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
import com.convocatoria.backend.model.dto.LugarDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.Lugar;
import com.convocatoria.backend.service.LugarService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class LugarController {

	private static final String ENTIDAD = Constantes.LUGAR;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	LugarService lugarService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/lugares")
	public ResponseEntity<List<LugarDto>> findAll(@RequestParam(defaultValue = "nombre,asc") String[] sort) {
		List<Lugar> lugares = lugarService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (lugares.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<LugarDto> lugarDtos = lugares.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(lugarDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/lugares/{id}")
	public ResponseEntity<LugarDto> find(@PathVariable("id") Long id) {
		Lugar lugar = lugarService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		LugarDto lugarDto = mappers.convertToDto(lugar);
		return new ResponseEntity<>(lugarDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/lugares")
	public ResponseEntity<LugarDto> create(@Valid @RequestBody LugarDto lugarDto) {
		lugarDto.setId(null);
		Lugar lugar = mappers.convertToEntity(lugarDto);
		lugarDto = mappers.convertToDto(lugarService.save(lugar));
		return new ResponseEntity<>(lugarDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/lugares/{id}")
	public ResponseEntity<LugarDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody LugarDto lugarDto) {
		if (!lugarService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		lugarDto.setId(id);
		Lugar lugar = lugarService.save(mappers.convertToEntity(lugarDto));
		lugarDto = mappers.convertToDto(lugar);
		return new ResponseEntity<>(lugarDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/lugares/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!lugarService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		lugarService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
