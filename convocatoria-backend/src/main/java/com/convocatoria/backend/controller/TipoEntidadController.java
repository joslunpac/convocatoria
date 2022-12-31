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

import com.convocatoria.backend.exception.MyConflictException;
import com.convocatoria.backend.exception.MyNotFoundException;
import com.convocatoria.backend.model.dto.TipoEntidadDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.TipoEntidad;
import com.convocatoria.backend.service.TipoEntidadService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class TipoEntidadController {

	private static final String ENTIDAD = Constantes.TIPO_ENTIDAD;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	TipoEntidadService tipoEntidadService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/tiposEntidad")
	public ResponseEntity<List<TipoEntidadDto>> findAll(@RequestParam(defaultValue = "nombreSingular,asc") String[] sort) {
		List<TipoEntidad> tiposEntidad = tipoEntidadService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (tiposEntidad.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<TipoEntidadDto> tipoEntidadDtos = tiposEntidad.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(tipoEntidadDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/tiposEntidad/{id}")
	public ResponseEntity<TipoEntidadDto> find(@PathVariable("id") Long id) {
		TipoEntidad tipoEntidad = tipoEntidadService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA));

		TipoEntidadDto tipoEntidadDto = mappers.convertToDto(tipoEntidad);
		return new ResponseEntity<>(tipoEntidadDto, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/tiposEntidad/acronimo/{acronimo}")
	public ResponseEntity<TipoEntidadDto> findByAcronimo(@PathVariable("acronimo") String acronimo) {
		TipoEntidad tipoEntidad = tipoEntidadService.findByAcronimo(acronimo).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + " " + acronimo + Constantes.NO_ENCONTRADA));

		TipoEntidadDto tipoEntidadDto = mappers.convertToDto(tipoEntidad);
		return new ResponseEntity<>(tipoEntidadDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/tiposEntidad")
	public ResponseEntity<TipoEntidadDto> create(@Valid @RequestBody TipoEntidadDto tipoEntidadDto) {
		if (tipoEntidadService.existsByAcronimo(tipoEntidadDto.getAcronimo()))
			throw new MyConflictException("El acrónimo" + Constantes.YA_EXISTE);

		tipoEntidadDto.setId(null);
		TipoEntidad tipoEntidad = mappers.convertToEntity(tipoEntidadDto);
		tipoEntidadDto = mappers.convertToDto(tipoEntidadService.save(tipoEntidad));
		return new ResponseEntity<>(tipoEntidadDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/tiposEntidad/{id}")
	public ResponseEntity<TipoEntidadDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody TipoEntidadDto tipoEntidadDto) {
		if (!tipoEntidadService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		tipoEntidadDto.setId(id);
		TipoEntidad tipoEntidad = tipoEntidadService.save(mappers.convertToEntity(tipoEntidadDto));
		tipoEntidadDto = mappers.convertToDto(tipoEntidad);
		return new ResponseEntity<>(tipoEntidadDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/tiposEntidad/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!tipoEntidadService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		tipoEntidadService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
