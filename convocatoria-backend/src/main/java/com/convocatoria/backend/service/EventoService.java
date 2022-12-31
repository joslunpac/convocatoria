package com.convocatoria.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.convocatoria.backend.exception.MyBadRequestException;
import com.convocatoria.backend.model.entity.Entidad;
import com.convocatoria.backend.model.entity.Evento;
import com.convocatoria.backend.model.entity.Persona;
import com.convocatoria.backend.model.entity.TipoActoCulto;
import com.convocatoria.backend.model.entity.Titular;
import com.convocatoria.backend.model.enumerate.TipoBusquedaEnum;
import com.convocatoria.backend.repository.EventoRepository;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.convocatoria.backend.util.Utilidades;

@Service
@Transactional
public class EventoService {

	@Autowired
	Utilidades utilidades;

	@Autowired
	EventoRepository eventoRepository;

	@Autowired
	TipoActoCultoService tipoActoCultoService;

	@Autowired
	EntidadService entidadService;

	@Autowired
	TitularService titularService;

	public long count() {
		return eventoRepository.count();
	}

	public long countByEventoPadre_Id(Long idPadre) {
		return eventoRepository.countByEventoPadre_Id(idPadre);
	}

	public Page<Evento> findAllByCriteria(RolEnum rol, TipoBusquedaEnum tipoBusqueda, LocalDate fechaInicial,
			LocalDate fechaFinal, Long idTipoActoCulto, Long idEntidadOrganizadora, Long idTitular, Long idPersona,
			Long idLugar, Long[] tiposEntidadId, Long[] caracteresId, boolean noVisibles,
			boolean aplazados, boolean suspendidos, boolean extraordinarios, boolean pendienteRevisar,
			boolean pendienteDuplicar, Pageable pageable) {
		Specification<Evento> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (rol.equals(RolEnum.ROLE_USUARIO))
				// Eventos visibles
				predicates.add(cb.isTrue(root.get("visible").as(Boolean.class)));

			if (tipoBusqueda != null && !tipoBusqueda.equals(TipoBusquedaEnum.TODOS)) {
				// Tipos de búsqueda
				if (!tipoBusqueda.equals(TipoBusquedaEnum.DIRECTO) && fechaInicial == null)
					// Si el tipo de búsqueda no es 'TODOS' ni 'DIRECTO', la fecha inicial es obligatoria
					throw new MyBadRequestException("La fecha de corte/inicial es obligatoria");

				if (tipoBusqueda.equals(TipoBusquedaEnum.DIRECTO)) {
					// Eventos en directo
					List<Predicate> predicatesHoras = new ArrayList<>();
					LocalDate fechaAyer = utilidades.obtenerFechaActual().minusDays(1);
					LocalDate fechaActual = utilidades.obtenerFechaActual();
					LocalTime horaActual = utilidades.obtenerHoraActualSinSegundos();

					// Distintos escenarios que se pueden dar para que un evento esté en directo:

					// Eventos de ayer, que terminan hoy, y que no hayan finalizado aún
					List<Predicate> predicatesAyerDiaSiguiente = new ArrayList<>();
					predicatesAyerDiaSiguiente.add(cb.equal(root.get("fecha"), fechaAyer));
					predicatesAyerDiaSiguiente.add(cb.isNotNull(root.get("horaIni1")));
					predicatesAyerDiaSiguiente.add(cb.isNull(root.get("horaFin1")));
					predicatesAyerDiaSiguiente.add(cb.isNull(root.get("horaIni2")));
					predicatesAyerDiaSiguiente.add(cb.isNotNull(root.get("horaFin2")));
					predicatesAyerDiaSiguiente.add(cb.greaterThanOrEqualTo(root.get("horaFin2"), horaActual));
					predicatesHoras.add(cb.and(predicatesAyerDiaSiguiente.toArray(new Predicate[] {})));

					// Eventos de hoy, que duran todo el día
					List<Predicate> predicatesTodoElDia = new ArrayList<>();
					predicatesTodoElDia.add(cb.equal(root.get("fecha"), fechaActual));
					predicatesTodoElDia.add(cb.isNotNull(root.get("horaIni1")));
					predicatesTodoElDia.add(cb.isNull(root.get("horaFin1")));
					predicatesTodoElDia.add(cb.isNull(root.get("horaIni2")));
					predicatesTodoElDia.add(cb.isNull(root.get("horaFin2")));
					predicatesHoras.add(cb.and(predicatesTodoElDia.toArray(new Predicate[] {})));

					// Eventos de hoy, que finalizan al día siguiente
					List<Predicate> predicatesDiaSiguiente = new ArrayList<>();
					predicatesDiaSiguiente.add(cb.equal(root.get("fecha"), fechaActual));
					predicatesDiaSiguiente.add(cb.isNotNull(root.get("horaIni1")));
					predicatesDiaSiguiente.add(cb.lessThanOrEqualTo(root.get("horaIni1"), horaActual));
					predicatesDiaSiguiente.add(cb.isNull(root.get("horaFin1")));
					predicatesDiaSiguiente.add(cb.isNull(root.get("horaIni2")));
					predicatesDiaSiguiente.add(cb.isNotNull(root.get("horaFin2")));
					predicatesHoras.add(cb.and(predicatesDiaSiguiente.toArray(new Predicate[] {})));

					// Eventos de hoy, donde la hora actual esté dentro del primer tramo
					List<Predicate> predicatesPrimerTramo = new ArrayList<>();
					predicatesPrimerTramo.add(cb.equal(root.get("fecha"), fechaActual));
					predicatesPrimerTramo.add(cb.isNotNull(root.get("horaIni1")));
					predicatesPrimerTramo.add(cb.lessThanOrEqualTo(root.get("horaIni1"), horaActual));
					predicatesPrimerTramo.add(cb.isNotNull(root.get("horaFin1")));
					predicatesPrimerTramo.add(cb.greaterThanOrEqualTo(root.get("horaFin1"), horaActual));
					predicatesHoras.add(cb.and(predicatesPrimerTramo.toArray(new Predicate[] {})));

					// Eventos de hoy, donde la hora actual esté dentro del segundo tramo
					List<Predicate> predicatesSegundoTramo = new ArrayList<>();
					predicatesSegundoTramo.add(cb.equal(root.get("fecha"), fechaActual));
					predicatesSegundoTramo.add(cb.isNotNull(root.get("horaIni2")));
					predicatesSegundoTramo.add(cb.lessThanOrEqualTo(root.get("horaIni2"), horaActual));
					predicatesSegundoTramo.add(cb.isNotNull(root.get("horaFin2")));
					predicatesSegundoTramo.add(cb.greaterThanOrEqualTo(root.get("horaFin2"), horaActual));
					predicatesHoras.add(cb.and(predicatesSegundoTramo.toArray(new Predicate[] {})));

					predicates.add(cb.or(predicatesHoras.toArray(new Predicate[] {})));
				} else if (tipoBusqueda.equals(TipoBusquedaEnum.IGUAL))
					// Eventos de una fecha concreta
					predicates.add(cb.equal(root.get("fecha"), fechaInicial));
				else if (tipoBusqueda.equals(TipoBusquedaEnum.ANTERIOR))
					// Eventos anteriores a una fecha
					predicates.add(cb.lessThan(root.get("fecha"), fechaInicial));
				else if (tipoBusqueda.equals(TipoBusquedaEnum.POSTERIOR))
					// Eventos posteriores a una fecha
					predicates.add(cb.greaterThanOrEqualTo(root.get("fecha"), fechaInicial));
				else if (tipoBusqueda.equals(TipoBusquedaEnum.ENTRE)) {
					if (fechaFinal == null)
						throw new MyBadRequestException("La fecha final es obligatoria");

					// Comprobamos que la fecha inicial sea mayor o igual que la final
					if (fechaInicial.isAfter(fechaFinal))
						throw new MyBadRequestException("La fecha inicial tiene que ser menor o igual que la final");

					// Eventos comprendidos entre varias fechas
					predicates.add(cb.between(root.get("fecha"), fechaInicial, fechaFinal));
				}
			}

			List<Predicate> predicatesTipoEntidadCaracter = new ArrayList<>();

			if (tiposEntidadId != null && tiposEntidadId.length > 0) {
				// Eventos que contengan alguno de los siguientes tipos de entidad
				for (Long tipoEntidadId : tiposEntidadId) {
					predicatesTipoEntidadCaracter.add(cb.equal(root.get("entidadOrganizadora").get("tipoEntidad").get("id"), tipoEntidadId));
				}
			}

			if (caracteresId != null && caracteresId.length > 0) {
				// Eventos que contengan alguno de los siguientes carácteres
				for (Long caracterId : caracteresId) {
					predicatesTipoEntidadCaracter.add(cb.equal(root.join("caracter", JoinType.LEFT).get("id"), caracterId));
				}
			}

			if ((tiposEntidadId != null && tiposEntidadId.length > 0) || (caracteresId != null && caracteresId.length > 0)) {
				// Solo añadimos el predicado cuando se ha rellenado
				predicates.add(cb.or(predicatesTipoEntidadCaracter.toArray(new Predicate[] {})));
			}

			if (idTipoActoCulto != null)
				// Eventos de un TipoActoCulto
				predicates.add(cb.equal(root.get("tipoActoCulto").get("id"), idTipoActoCulto));

			if (idEntidadOrganizadora != null)
				// Eventos de una Entidad organizadora
				predicates.add(cb.equal(root.get("entidadOrganizadora").get("id"), idEntidadOrganizadora));

			if (idTitular != null) {
				// Eventos de un Titular
				Join<Evento, Titular> titularesJoin = root.join("titulares", JoinType.INNER);
				predicates.add(cb.equal(titularesJoin.get("id"), idTitular));
			}

			if (idPersona != null) {
				// Eventos de una Persona
				Join<Evento, Persona> personasJoin = root.join("personas", JoinType.INNER);
				predicates.add(cb.equal(personasJoin.get("id"), idPersona));
			}

			if (idLugar != null)
				// Eventos de un Lugar
				predicates.add(cb.equal(root.get("lugar").get("id"), idLugar));

			// Eventos visibles
			if (pendienteDuplicar) {
				// Si el tipo de búsqueda es 'DIRECTO' o está activado el filtro pendientes de duplicar,
				// forzamos a que los eventos que sean visibles
				predicates.add(cb.isTrue(root.get("visible").as(Boolean.class)));
			} else {
				if (noVisibles)
					// Eventos que no sean visibles
					predicates.add(
						cb.or(
							cb.isFalse(root.get("visible").as(Boolean.class)),
							// Comprobamos también si tienen evento padre, y éste tampoco está visible
							cb.isFalse(root.join("eventoPadre", JoinType.LEFT).get("visible").as(Boolean.class))
						)
					);
			}

			// Eventos aplazados
			if ((tipoBusqueda != null && tipoBusqueda.equals(TipoBusquedaEnum.DIRECTO)) || pendienteDuplicar) {
				// Si el tipo de búsqueda es 'DIRECTO' o está activado el filtro pendientes de duplicar,
				// forzamos a que los eventos que no estén aplazados
				predicates.add(cb.isFalse(root.get("aplazado").as(Boolean.class)));
			} else {
				if (aplazados)
					// Eventos que estén aplazados
					predicates.add(cb.isTrue(root.get("aplazado").as(Boolean.class)));
			}

			// Eventos suspendidos
			if (tipoBusqueda != null && tipoBusqueda.equals(TipoBusquedaEnum.DIRECTO)) {
				// Si el tipo de búsqueda es 'DIRECTO', forzamos a que los eventos que no estén suspendidos
				predicates.add(cb.isFalse(root.get("suspendido").as(Boolean.class)));
			} else {
				if (suspendidos)
					// Eventos que estén suspendidos
					predicates.add(cb.isTrue(root.get("suspendido").as(Boolean.class)));
			}

			// Eventos extraordinarios
			if (pendienteDuplicar) {
				// Si está activado el filtro de pendientes de duplicar, forzamos a que los eventos que no sean extraordinarios
				predicates.add(cb.isFalse(root.get("extraordinario").as(Boolean.class)));
			} else {
				if (extraordinarios)
					// Eventos que sean extraordinarios
					predicates.add(cb.isTrue(root.get("extraordinario").as(Boolean.class)));
			}

			// Eventos pendientes de revisar
			if (pendienteDuplicar) {
				// Si está activado el filtro de pendientes de duplicar, forzamos a que los eventos que no estén pendientes de revisar
				predicates.add(cb.isFalse(root.get("pendienteRevisar").as(Boolean.class)));
			} else {
				if (pendienteRevisar)
					// Eventos que estén pendientes de revisar
					predicates.add(
						cb.or(
							cb.isTrue(root.get("pendienteRevisar").as(Boolean.class)),
							cb.isTrue(root.get("revisarRegla").as(Boolean.class)),
							cb.or(
								// Comprobamos también si tienen evento padre, y éste también está pendiente de revisar
								cb.isTrue(root.join("eventoPadre", JoinType.LEFT).get("pendienteRevisar").as(Boolean.class)),
								cb.isTrue(root.join("eventoPadre", JoinType.LEFT).get("revisarRegla").as(Boolean.class))
							)
						)
					);
			}

			// Resto de comprobaciones para eventos pendientes de duplicar
			if (pendienteDuplicar) {
				// Si está activado el filtro de pendientes de duplicar, forzamos la búsqueda con los siguientes parámetros 
				// Eventos que no hayan sido duplicados
				predicates.add(cb.equal(root.get("duplicado"), "N"));
				// Eventos que no sean hijos
				predicates.add(cb.isNull(root.get("eventoPadre")));
				// Establecemos como fecha límite ayer, independientemente de la fecha seleccionada
				predicates.add(cb.lessThan(root.get("fecha"), utilidades.obtenerFechaActual()));
			}

			return cb.and(predicates.toArray(new Predicate[] {}));
		};

		return eventoRepository.findAll(specification, pageable);
	}

	public Optional<Evento> findById(RolEnum rol, Long id) {
		Specification<Evento> specification = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			if (rol.equals(RolEnum.ROLE_USUARIO))
				// Evento visible
				predicates.add(cb.isTrue(root.get("visible").as(Boolean.class)));

			if (id != null)
				predicates.add(cb.equal(root.get("id"), id));

			return cb.and(predicates.toArray(new Predicate[] {}));
		};

		return eventoRepository.findOne(specification);
	}

	public List<String> findDistinctTipo() {
		return eventoRepository.findDistinctTipoNative();
	}

	public List<String> findDistinctMarco() {
		return eventoRepository.findDistinctMarcoNative();
	}

	public List<String> findDistinctHito() {
		return eventoRepository.findDistinctHitoNative();
	}

	public List<String> findDistinctInformacion() {
		return eventoRepository.findDistinctInformacionNative();
	}

	public List<String> findDistinctRegla() {
		return eventoRepository.findDistinctReglaNative();
	}

	public boolean existsById(Long id) {
		return eventoRepository.existsById(id);
	}

	public Evento save(Evento eventoAPersistir, Integer duracion) {
		// DEFINIMOS EL MODO DE LA PERSISTENCIA, CREACIÓN O EDICIÓN
		boolean modoCreacion = eventoAPersistir.getId() == null ? true : false;


		// DEFINIMOS EL NÚMERO DE EVENTOS A INSERTAR Y LOS ATRIBUTOS QUE DEPENDEN DE EL
		long numEventosAPersistir = 1;

		if (modoCreacion) {
			// Si estamos en modo creación

			// Por seguridad, obtenemos el tipo de acto o culto completo asociado al evento a persistir
			TipoActoCulto tipoActoCulto = tipoActoCultoService.findById(eventoAPersistir.getTipoActoCulto().getId()).get();
			eventoAPersistir.setTipoActoCulto(tipoActoCulto);

			if (eventoAPersistir.tieneDuracionFija()) {
				// Si tiene una duración fija, insertamos tantos eventos como días de duración
				// tenga el tipo de acto o culto
				numEventosAPersistir = eventoAPersistir.getTipoActoCulto().getDias();
			} else {
				// Si no tiene una duración fija, quiere decir que tiene una duración variable, por lo que
				// insertamos tantos eventos como días de duración recibidos por parámetro
				if (duracion != null && duracion > 0) {
					numEventosAPersistir = duracion;
				} else {
					throw new MyBadRequestException("Los días de duración del evento tienen que ser mayor que 0");
				}
			}

			// Si solo insertamos un evento, asignamos 0 al día del evento a persistir, en caso
			// contrario, asignamos 1 al día del evento a persistir y más tarde se sumará +1 al
			// día de cada evento hijo
			eventoAPersistir.setDia(numEventosAPersistir > 1 ? 1 : 0);
		}


		// DEFINIMOS SI EL EVENTO A INSERTAR ES PADRE DE OTROS
		if (modoCreacion) {
			// Si estamos en modo creación, el evento a persistir no puede ser hijo de otro evento
			eventoAPersistir.marcarComoPadre();
		}


		// DEFINIMOS EL CARÁCTER DEL EVENTO
		if (eventoAPersistir.tieneTitulares()) {
			// Si contiene algún titular, le asignamos el carácter del primer titular

			// Por seguridad, obtenemos el primer titular completo asociado al evento a persistir
			Titular titular = titularService.findById(eventoAPersistir.getTitulares().get(0).getId()).get();
			eventoAPersistir.setCaracter(titular.getCaracter());
		} else {
			// Si no contiene titulares, comprobamos si la entidad organizadora posee carácter

			// Por seguridad, obtenemos la entidad organizadora completa asociada al evento a persistir
			Entidad entidadOrganizadora = entidadService.findById(RolEnum.ROLE_ADMINISTRADOR, eventoAPersistir.getEntidadOrganizadora().getId()).get();

			if (entidadOrganizadora.getCaracterPrincipal() != null) {
				// Si la entidad organizadora posee carácter, le asignamos el mismo al evento
				eventoAPersistir.setCaracter(entidadOrganizadora.getCaracterPrincipal());
			} else {
				// Si la entidad organizadora no posee carácter, no le asignamos ninguno al evento
				eventoAPersistir.setCaracter(null);
			}
		}


		// DEFINIMOS LA EXTRAORDINARIEDAD DEL EVENTO Y LOS ATRIBUTOS QUE DEPENDEN DE ELLA
		// COMO LA PERIODICIDAD, LA DUPLICIDAD Y LOS CAMPOS A REVISAR
		if (eventoAPersistir.tieneHitoOAniversario()) {
			// Si contiene hito o aniversario, lo marcamos como evento extraordinario
			eventoAPersistir.marcarComoExtraordinario();
		}

		if (eventoAPersistir.esExtraordinario()) {
			// Si es extraordinario

			// Lo marcamos como no periódico
			eventoAPersistir.marcarComoNoPeriodico();

			if (!eventoAPersistir.estaPendienteRevisar()) {
				// Si no está pendiente de revisar, desmarcamos todos los revisar
				eventoAPersistir.desmarcarTodosRevisar();
			}

			// Lo marcamos como no duplicable
			eventoAPersistir.marcarComoNoDuplicable();
		} else {
			// Si no es extraordinario

			// Eliminamos el hito y el aniversario
			eventoAPersistir.eliminarHitoYAniversario();

			if (modoCreacion) {
				// Si estamos en modo creación, lo marcamos como no duplicado aún
				eventoAPersistir.marcarComoNoDuplicado();
			}
		}

		if (eventoAPersistir.esPadre() && eventoAPersistir.estaAplazado()) {
			// Si es padre y está aplazado, lo marcamos como pendiente de revisar
			eventoAPersistir.marcarComoPendienteRevisar();
		}


		// DEFINIMOS LA REGLA DEL EVENTO
		if (eventoAPersistir.esPadre()) {
			// Si es padre
			if (!eventoAPersistir.esPeriodico() && !eventoAPersistir.esExtraordinario()) {
				// Si no es periódico ni extraordinario
				if (eventoAPersistir.tieneRegla()) {
					// Si tiene informada la regla, desmarcamos la revisión de la misma, ya que la regla no se
					// modificará más en el futuro
					eventoAPersistir.setRevisarRegla(false);
				} else {
					// Si no tiene informada la regla, marcamos la revisión de la misma, para tenerlo en cuenta
					// en los duplicados futuros hasta encontrar una regla.
					eventoAPersistir.setRevisarRegla(true);
				}
			} else if (eventoAPersistir.esPeriodico()) {
				// Si es periódico desmarcamos la revisión de la regla
				eventoAPersistir.setRevisarRegla(false);
			}
		} else {
			if (!eventoAPersistir.esPadre()) {
				// Si no es padre, eliminamos la regla
				eventoAPersistir.setRegla(null);
			}

			// Si no es padre o es periódico o extraordinario, desmarcamos la revisión de la regla
			eventoAPersistir.setRevisarRegla(false);
		}

		// DEFINIMOS LA VISIVILIDAD DEL EVENTO
		if (eventoAPersistir.estaPendienteRevisar() && !eventoAPersistir.estaAplazado()) {
			// Si está pendiente de revisar y no está aplazado, comprobamos la visibilidad del evento
			eventoAPersistir.comprobarVisibilidad();
		}


		// REALIZAMOS LA PERSISTENCIA DEL EVENTO PADRE Y SUS HIJOS EN CASO QUE EXISTAN
		eventoRepository.save(eventoAPersistir);

		if (numEventosAPersistir > 1) {
			// Si existen eventos hijos, los persistimos
			this.saveHijos(numEventosAPersistir, eventoAPersistir);
		}

		return eventoAPersistir;
	}

	private void saveHijos(long numEventos, Evento eventoPadre) {
		int iterador = 1;
		while (iterador < numEventos) {
			// CLONAMOS LOS DATOS DEL EVENTO PADRE
			Evento eventoHijo = new Evento(eventoPadre);


			// ASIGNAMOS LOS DATOS VARIABLES DEL EVENTO HIJO
			eventoHijo.setEventoPadre(eventoPadre);
			eventoHijo.setDia(iterador + 1);
			eventoHijo.setFecha(eventoPadre.getFecha().plusDays(iterador));
			// Sólo los eventos padres pueden tener rellena la regla
			eventoHijo.setRegla(null);
			// Sólo los eventos padres pueden tener algo pendiente de revisar
			// Los hijos actuarán en función del padre
			eventoHijo.desmarcarTodosRevisar();
			eventoHijo.marcarComoNoDuplicable();

			// Persistimos el evento hijo
			eventoRepository.save(eventoHijo);
			iterador++;
		}
	}

	public void deleteById(Long id) {
		eventoRepository.deleteById(id);
	}

	public void deleteByEventoPadre_Id(Long idPadre) {
		eventoRepository.deleteByEventoPadre_Id(idPadre);
	}

}
