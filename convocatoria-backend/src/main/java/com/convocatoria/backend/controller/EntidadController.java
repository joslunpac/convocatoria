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
import com.convocatoria.backend.model.dto.EntidadDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.Entidad;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.convocatoria.backend.service.EntidadService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class EntidadController {

	private static final String ENTIDAD = Constantes.ENTIDAD;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	EntidadService entidadService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/entidades")
	public ResponseEntity<List<EntidadDto>> findAllPublic(@RequestParam(defaultValue = "codigo,asc") String[] sort) {
		return this.findAll(RolEnum.ROLE_USUARIO, sort);
	}

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/entidades")
	public ResponseEntity<List<EntidadDto>> findAllPrivate(@RequestParam(defaultValue = "codigo,asc") String[] sort) {
		return this.findAll(RolEnum.ROLE_ADMINISTRADOR, sort);
	}

	private ResponseEntity<List<EntidadDto>> findAll(RolEnum rol, String[] sort) {
		List<Entidad> entidades = entidadService.findAll(rol, Sort.by(utilidades.construirOrders(sort)));

		if (entidades.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<EntidadDto> entidadDtos = entidades.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(entidadDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/entidades" + Constantes.BY_CRITERIA)
	public ResponseEntity<List<EntidadDto>> findAllByCriteriaPublic(
			@RequestParam(required = false) Long[] tiposEntidadId,
			@RequestParam(required = false) Long[] caracteresId,
			@RequestParam(defaultValue = "codigo,asc") String[] sort) {
		return this.findAllByCriteria(RolEnum.ROLE_USUARIO, tiposEntidadId, caracteresId, false, false, sort);
	}

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/entidades" + Constantes.BY_CRITERIA)
	public ResponseEntity<List<EntidadDto>> findAllByCriteriaPrivate(
			@RequestParam(required = false) Long[] tiposEntidadId,
			@RequestParam(required = false) Long[] caracteresId,
			@RequestParam(defaultValue = "false") boolean noVisibles,
			@RequestParam(defaultValue = "false") boolean pendienteRevisar,
			@RequestParam(defaultValue = "codigo,asc") String[] sort) {
		return this.findAllByCriteria(RolEnum.ROLE_ADMINISTRADOR, tiposEntidadId, caracteresId, noVisibles, pendienteRevisar, sort);
	}

	private ResponseEntity<List<EntidadDto>> findAllByCriteria(RolEnum rol, Long[] tiposEntidadId,
			Long[] caracteresId, boolean noVisibles, boolean pendienteRevisar, String[] sort) {
		List<Entidad> entidades = entidadService.findAllByCriteria(rol, tiposEntidadId, caracteresId, null, noVisibles,
				pendienteRevisar, Sort.by(utilidades.construirOrders(sort)));

		if (entidades.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<EntidadDto> entidadDtos = entidades.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(entidadDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/entidades/{id}")
	public ResponseEntity<EntidadDto> findPublic(@PathVariable("id") Long id) {
		return this.find(RolEnum.ROLE_USUARIO, id);
	}

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/entidades/{id}")
	public ResponseEntity<EntidadDto> findPrivate(@PathVariable("id") Long id) {
		return this.find(RolEnum.ROLE_ADMINISTRADOR, id);
	}

	private ResponseEntity<EntidadDto> find(RolEnum rol, Long id) {
		Entidad entidad = entidadService.findById(rol, id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA));

		EntidadDto entidadDto = mappers.convertToDto(entidad);
		return new ResponseEntity<>(entidadDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/entidades")
	public ResponseEntity<EntidadDto> create(@Valid @RequestBody EntidadDto entidadDto) {
		if (entidadService.existsByCodigo(entidadDto.getCodigo()))
			throw new MyConflictException("El código" + Constantes.YA_EXISTE);

		entidadDto.setId(null);
		Entidad entidad = mappers.convertToEntity(entidadDto);
		entidadDto = mappers.convertToDto(entidadService.save(entidad));
		return new ResponseEntity<>(entidadDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/entidades/{id}")
	public ResponseEntity<EntidadDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody EntidadDto entidadDto) {
		if (!entidadService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		entidadDto.setId(id);
		Entidad entidad = entidadService.save(mappers.convertToEntity(entidadDto));
		entidadDto = mappers.convertToDto(entidad);
		return new ResponseEntity<>(entidadDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/entidades/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!entidadService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		entidadService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
