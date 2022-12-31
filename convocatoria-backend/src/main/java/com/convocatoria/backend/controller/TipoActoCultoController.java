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
import com.convocatoria.backend.model.dto.TipoActoCultoDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.TipoActoCulto;
import com.convocatoria.backend.service.TipoActoCultoService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class TipoActoCultoController {

	private static final String ENTIDAD = Constantes.TIPO_ACTO_CULTO;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	TipoActoCultoService tipoActoCultoService;

	@JsonView(Views.Public.class)
	@GetMapping(path = "/tiposActoCulto")
	public ResponseEntity<List<TipoActoCultoDto>> findAll(@RequestParam(defaultValue = "nombreSingular,asc") String[] sort) {
		List<TipoActoCulto> tiposActoCulto = tipoActoCultoService.findAll(Sort.by(utilidades.construirOrders(sort)));

		if (tiposActoCulto.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<TipoActoCultoDto> tipoActoCultoDtos = tiposActoCulto.stream().map(mappers::convertToDto).collect(Collectors.toList());
		return new ResponseEntity<>(tipoActoCultoDtos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/tiposActoCulto/{id}")
	public ResponseEntity<TipoActoCultoDto> find(@PathVariable("id") Long id) {
		TipoActoCulto tipoActoCulto = tipoActoCultoService.findById(id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		TipoActoCultoDto tipoActoCultoDto = mappers.convertToDto(tipoActoCulto);
		return new ResponseEntity<>(tipoActoCultoDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/tiposActoCulto")
	public ResponseEntity<TipoActoCultoDto> create(@Valid @RequestBody TipoActoCultoDto tipoActoCultoDto) {
		tipoActoCultoDto.setId(null);
		TipoActoCulto tipoActoCulto = mappers.convertToEntity(tipoActoCultoDto);
		tipoActoCultoDto = mappers.convertToDto(tipoActoCultoService.save(tipoActoCulto));
		return new ResponseEntity<>(tipoActoCultoDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/tiposActoCulto/{id}")
	public ResponseEntity<TipoActoCultoDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody TipoActoCultoDto tipoActoCultoDto) {
		if (!tipoActoCultoService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		tipoActoCultoDto.setId(id);
		TipoActoCulto tipoActoCulto = tipoActoCultoService.save(mappers.convertToEntity(tipoActoCultoDto));
		tipoActoCultoDto = mappers.convertToDto(tipoActoCulto);
		return new ResponseEntity<>(tipoActoCultoDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/tiposActoCulto/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!tipoActoCultoService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		tipoActoCultoService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
