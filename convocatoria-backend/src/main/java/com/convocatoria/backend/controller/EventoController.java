package com.convocatoria.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
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
import com.convocatoria.backend.model.dto.EventoDto;
import com.convocatoria.backend.model.dto.ResultadoDto;
import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.model.entity.Evento;
import com.convocatoria.backend.model.enumerate.TipoBusquedaEnum;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.convocatoria.backend.service.EntidadService;
import com.convocatoria.backend.service.EventoService;
import com.convocatoria.backend.service.LugarService;
import com.convocatoria.backend.service.PersonaService;
import com.convocatoria.backend.service.TipoActoCultoService;
import com.convocatoria.backend.service.TitularService;
import com.convocatoria.backend.util.Constantes;
import com.convocatoria.backend.util.Mappers;
import com.convocatoria.backend.util.Utilidades;
import com.fasterxml.jackson.annotation.JsonView;

@RestController
@CrossOrigin
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class EventoController {

	private static final String ENTIDAD = Constantes.EVENTO;

	@Autowired
	Utilidades utilidades;

	@Autowired
	Mappers mappers;

	@Autowired
	EventoService eventoService;

	@Autowired
	EntidadService entidadService;

	@Autowired
	TipoActoCultoService tipoActoCultoService;

	@Autowired
	LugarService lugarService;

	@Autowired
	TitularService titularService;

	@Autowired
	PersonaService personaService;

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos/{id}/hijos")
	public ResponseEntity<Long> countHijos(@PathVariable("id") Long id) {
		Long numEventosHijos = eventoService.countByEventoPadre_Id(id);
		return new ResponseEntity<>(numEventosHijos, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/eventos" + Constantes.BY_CRITERIA)
	public ResponseEntity<ResultadoDto> findAllByCriteriaPublic(
			@RequestParam(required = false) TipoBusquedaEnum tipoBusqueda,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicial,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFinal,
			@RequestParam(required = false) Long idTipoActoCulto,
			@RequestParam(required = false) Long idEntidadOrganizadora,
			@RequestParam(required = false) Long idTitular,
			@RequestParam(required = false) Long idPersona,
			@RequestParam(required = false) Long idLugar,
			@RequestParam(required = false) Long[] tiposEntidadId,
			@RequestParam(required = false) Long[] caracteresId,
			@RequestParam(defaultValue = "false") boolean sinCaracter,
			@RequestParam(defaultValue = Constantes.DEFAULT_PAGE) int page,
			@RequestParam(defaultValue = Constantes.DEFAULT_SIZE) int size,
			@RequestParam(defaultValue = "fecha,asc") String[] sort) {
		return this.findAllByCriteria(RolEnum.ROLE_USUARIO, tipoBusqueda, fechaInicial, fechaFinal, idTipoActoCulto,
				idEntidadOrganizadora, idPersona, idTitular, idLugar, tiposEntidadId, caracteresId, sinCaracter, false, false, false,
				false, false, false, page, size, sort);
	}

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos" + Constantes.BY_CRITERIA)
	public ResponseEntity<ResultadoDto> findAllByCriteriaPrivate(
			@RequestParam(required = false) TipoBusquedaEnum tipoBusqueda,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicial,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFinal,
			@RequestParam(required = false) Long idTipoActoCulto,
			@RequestParam(required = false) Long idEntidadOrganizadora,
			@RequestParam(required = false) Long idTitular,
			@RequestParam(required = false) Long idPersona,
			@RequestParam(required = false) Long idLugar,
			@RequestParam(required = false) Long[] tiposEntidadId,
			@RequestParam(required = false) Long[] caracteresId,
			@RequestParam(defaultValue = "false") boolean sinCaracter,
			@RequestParam(defaultValue = "false") boolean noVisibles,
			@RequestParam(defaultValue = "false") boolean aplazados,
			@RequestParam(defaultValue = "false") boolean suspendidos,
			@RequestParam(defaultValue = "false") boolean extraordinarios,
			@RequestParam(defaultValue = "false") boolean pendienteRevisar,
			@RequestParam(defaultValue = "false") boolean pendienteDuplicar,
			@RequestParam(defaultValue = Constantes.DEFAULT_PAGE) int page,
			@RequestParam(defaultValue = Constantes.DEFAULT_SIZE) int size,
			@RequestParam(defaultValue = "fecha,asc,horaIni1,asc") String[] sort) {
		return this.findAllByCriteria(RolEnum.ROLE_ADMINISTRADOR, tipoBusqueda, fechaInicial, fechaFinal,
				idTipoActoCulto, idEntidadOrganizadora, idTitular, idPersona, idLugar, tiposEntidadId, caracteresId, sinCaracter,
				noVisibles, aplazados, suspendidos, extraordinarios, pendienteRevisar, pendienteDuplicar, page, size,
				sort);
	}

	private ResponseEntity<ResultadoDto> findAllByCriteria(RolEnum rol, TipoBusquedaEnum tipoBusqueda,
			LocalDate fechaInicial, LocalDate fechaFinal, Long idTipoActoCulto, Long idEntidadOrganizadora,
			Long idTitular, Long idPersona, Long idLugar, Long[] tiposEntidadId, Long[] caracteresId, boolean sinCaracter,
			boolean noVisibles, boolean aplazados, boolean suspendidos, boolean extraordinarios,
			boolean pendienteRevisar, boolean pendienteDuplicar, int page, int size, String[] sort) {
		if (idTipoActoCulto != null && !tipoActoCultoService.existsById(idTipoActoCulto))
			throw new MyNotFoundException(Constantes.TIPO_ACTO_CULTO + Constantes.CON_ID + idTipoActoCulto + Constantes.NO_ENCONTRADO);

		if (idEntidadOrganizadora != null && !entidadService.existsById(idEntidadOrganizadora))
			throw new MyNotFoundException(Constantes.ENTIDAD + Constantes.CON_ID + idEntidadOrganizadora + Constantes.NO_ENCONTRADO);

		if (idTitular != null && !titularService.existsById(idTitular))
			throw new MyNotFoundException(Constantes.TITULAR + Constantes.CON_ID + idTitular + Constantes.NO_ENCONTRADO);

		if (idPersona != null && !personaService.existsById(idPersona))
			throw new MyNotFoundException(Constantes.PERSONA + Constantes.CON_ID + idPersona + Constantes.NO_ENCONTRADO);

		if (idLugar != null && !lugarService.existsById(idLugar))
			throw new MyNotFoundException(Constantes.LUGAR + Constantes.CON_ID + idLugar + Constantes.NO_ENCONTRADO);

		Pageable pageable = utilidades.construirPageable(page, size, sort);
		Page<Evento> pageEventos = eventoService.findAllByCriteria(rol, tipoBusqueda, fechaInicial, fechaFinal,
				idTipoActoCulto, idEntidadOrganizadora, idTitular, idPersona, idLugar, tiposEntidadId, caracteresId, sinCaracter,
				noVisibles, aplazados, suspendidos, extraordinarios, pendienteRevisar, pendienteDuplicar, pageable);
		List<Evento> eventos = pageEventos.getContent();

		if (eventos.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		List<EventoDto> eventoDtos = eventos.stream().map(mappers::convertToDto).collect(Collectors.toList());
		ResultadoDto resultadoDto = utilidades.construirResultadoBusqueda(pageEventos, eventoDtos);
		return new ResponseEntity<>(resultadoDto, HttpStatus.OK);
	}

	@JsonView(Views.Public.class)
	@GetMapping(path = "/eventos/{id}")
	public ResponseEntity<EventoDto> findPublic(@PathVariable("id") Long id) {
		return this.find(RolEnum.ROLE_USUARIO, id);
	}

	@JsonView(Views.Private.class)
	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos/{id}")
	public ResponseEntity<EventoDto> findPrivate(@PathVariable("id") Long id) {
		return this.find(RolEnum.ROLE_ADMINISTRADOR, id);
	}

	private ResponseEntity<EventoDto> find(RolEnum rol, Long id) {
		Evento evento = eventoService.findById(rol, id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		EventoDto eventoDto = mappers.convertToDto(evento);
		return new ResponseEntity<>(eventoDto, HttpStatus.OK);
	}

	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos/tipos")
	public ResponseEntity<List<String>> findDistinctTipo() {
		List<String> tipos = eventoService.findDistinctTipo();

		if (tipos.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		return new ResponseEntity<>(tipos, HttpStatus.OK);
	}

	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos/marcos")
	public ResponseEntity<List<String>> findDistinctMarco() {
		List<String> marcos = eventoService.findDistinctMarco();

		if (marcos.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		return new ResponseEntity<>(marcos, HttpStatus.OK);
	}

	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos/hitos")
	public ResponseEntity<List<String>> findDistinctHito() {
		List<String> hitos = eventoService.findDistinctHito();

		if (hitos.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		return new ResponseEntity<>(hitos, HttpStatus.OK);
	}

	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos/informaciones")
	public ResponseEntity<List<String>> findDistinctInformacion() {
		List<String> informaciones = eventoService.findDistinctInformacion();

		if (informaciones.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		return new ResponseEntity<>(informaciones, HttpStatus.OK);
	}

	@GetMapping(path = Constantes.URI_PRIVATE + "/eventos/reglas")
	public ResponseEntity<List<String>> findDistinctRegla() {
		List<String> reglas = eventoService.findDistinctRegla();

		if (reglas.isEmpty())
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);

		return new ResponseEntity<>(reglas, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@PostMapping(path = "/eventos")
	public ResponseEntity<EventoDto> create(
			@Valid @RequestBody EventoDto eventoDto,
			@RequestParam(required = false) Integer duracion) {
		eventoDto.setId(null);
		Evento evento = mappers.convertToEntity(eventoDto);
		eventoDto = mappers.convertToDto(eventoService.save(evento, duracion));
		return new ResponseEntity<>(eventoDto, HttpStatus.CREATED);
	}

	@JsonView(Views.Private.class)
	@PutMapping(path = "/eventos/{id}")
	public ResponseEntity<EventoDto> update(
			@PathVariable("id") Long id,
			@Valid @RequestBody EventoDto eventoDto) {
		Evento evento = eventoService.findById(RolEnum.ROLE_ADMINISTRADOR, id).orElseThrow(
				() -> new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO));

		eventoDto.setId(id);
		eventoDto.setUsuarioCreacion(evento.getUsuarioCreacion());
		eventoDto.setFechaCreacion(evento.getFechaCreacion());
		Evento nuevoEvento = eventoService.save(mappers.convertToEntity(eventoDto), null);
		eventoDto = mappers.convertToDto(nuevoEvento);
		return new ResponseEntity<>(eventoDto, HttpStatus.OK);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/eventos/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") Long id) {
		if (!eventoService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		// Elimanos el evento padre
		eventoService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@JsonView(Views.Private.class)
	@DeleteMapping(path = "/eventos/{id}/todos")
	public ResponseEntity<HttpStatus> deleteAllByEventoPadreId(@PathVariable("id") Long id) {
		if (!eventoService.existsById(id))
			throw new MyNotFoundException(ENTIDAD + Constantes.CON_ID + id + Constantes.NO_ENCONTRADO);

		// Eliminamos los eventos hijos si existieran
		eventoService.deleteByEventoPadre_Id(id);
		// Elimanos el evento padre
		eventoService.deleteById(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
