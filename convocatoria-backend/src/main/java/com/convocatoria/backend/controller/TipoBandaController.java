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
import com.convocatoria.backend.model.dto.TipoBandaDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.TipoBanda;
import com.convocatoria.backend.service.TipoBandaService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class TipoBandaController {

	private static final String ENTIDAD = Constantes.TIPO_BANDA;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	TipoBandaService tipoBandaService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/tiposBanda")
	public ResponseEntity<List<TipoBandaDto>> findAll(@RequestParam(defaultValue = "nombreSingular,asc") String[] sort) {
		List<TipoBanda> tiposBanda = tipoBandaService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (tiposBanda.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<TipoBandaDto> tipoBandaDtos = tiposBanda.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(tipoBandaDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/tiposBanda/{id}")
	public ResponseEntity<TipoBandaDto> find(@PathVariable("id") Long id) {
		TipoBanda tipoBanda = tipoBandaService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA));

		TipoBandaDto tipoBandaDto = mappers.convertToDto(tipoBanda);
		return new ResponseEntity<>(tipoBandaDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/tiposBanda")
	public ResponseEntity<TipoBandaDto> create(@Valid @RequestBody TipoBandaDto tipoBandaDto) {
		if (tipoBandaService.existsByAcronimo(tipoBandaDto.getAcronimo()))
			throw new MyConflictException("El acrónimo" + Constantes.YA_EXISTE);

		tipoBandaDto.setId(null);
		TipoBanda tipoBanda = mappers.convertToEntity(tipoBandaDto);
		tipoBandaDto = mappers.convertToDto(tipoBandaService.save(tipoBanda));
		return new ResponseEntity<>(tipoBandaDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/tiposBanda/{id}")
	public ResponseEntity<TipoBandaDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody TipoBandaDto tipoBandaDto) {
		if (!tipoBandaService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		tipoBandaDto.setId(id);
		TipoBanda tipoBanda = tipoBandaService.save(mappers.convertToEntity(tipoBandaDto));
		tipoBandaDto = mappers.convertToDto(tipoBanda);
		return new ResponseEntity<>(tipoBandaDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/tiposBanda/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!tipoBandaService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADA);

		tipoBandaService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
