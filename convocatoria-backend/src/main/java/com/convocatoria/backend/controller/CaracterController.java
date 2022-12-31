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
import com.convocatoria.backend.model.dto.CaracterDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.Caracter;
import com.convocatoria.backend.service.CaracterService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class CaracterController {

	private static final String ENTIDAD = Constantes.CARACTER;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	CaracterService caracterService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/caracteres")
	public ResponseEntity<List<CaracterDto>> findAll(@RequestParam(defaultValue = "nombre,asc") String[] sort) {
		List<Caracter> caracteres = caracterService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (caracteres.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<CaracterDto> caracterDtos = caracteres.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(caracterDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/caracteres/{id}")
	public ResponseEntity<CaracterDto> find(@PathVariable("id") Long id) {
		Caracter caracter = caracterService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		CaracterDto caracterDto = mappers.convertToDto(caracter);
		return new ResponseEntity<>(caracterDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/caracteres")
	public ResponseEntity<CaracterDto> create(@Valid @RequestBody CaracterDto caracterDto) {
		if (caracterService.existsByAcronimo(caracterDto.getAcronimo()))
			throw new MyConflictException("El acrónimo" + Constantes.YA_EXISTE);

		caracterDto.setId(null);
		Caracter caracter = mappers.convertToEntity(caracterDto);
		caracterDto = mappers.convertToDto(caracterService.save(caracter));
		return new ResponseEntity<>(caracterDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/caracteres/{id}")
	public ResponseEntity<CaracterDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody CaracterDto caracterDto) {
		if (!caracterService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		caracterDto.setId(id);
		Caracter caracter = caracterService.save(mappers.convertToEntity(caracterDto));
		caracterDto = mappers.convertToDto(caracter);
		return new ResponseEntity<>(caracterDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/caracteres/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!caracterService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		caracterService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
