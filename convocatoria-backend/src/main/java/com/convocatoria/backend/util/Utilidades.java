package com.convocatoria.backend.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Component;

import com.convocatoria.backend.model.dto.EventoDto;
import com.convocatoria.backend.model.dto.ResultadoDto;

@Component
public class Utilidades {

	/**
	 * Devuelve un objeto de tipo Pageable
	 * 
	 * @param page Índice de página de base cero, NO debe ser negativo
	 * @param size Número de elementos en una página que se devolverán, debe ser
	 *             mayor que 0
	 * @param sort Array de ordenaciones
	 * @return Pageable
	 */
	public Pageable construirPageable(int page, int size, String[] sort) {
		return PageRequest.of(page, size, Sort.by(construirOrders(sort)));
	}

	/**
	 * Recupera una lista orders
	 *
	 * @param sort Array de ordenaciones
	 * @return Listado de orders
	 */
	public List<Order> construirOrders(String[] sort) {
		List<Order> orders = new ArrayList<>();

		if (sort.length > 0) {
			for (int i = 0; i < sort.length / 2; ++i) {
				orders.add(new Order(getSortDirection(sort[(i * 2) + 1]), sort[i * 2]));
			}
		}

		return orders;
	}

	/**
	 * Convertimos "asc/desc" en "Sort.Direction.ASC/Sort.Direction.DES"
	 *
	 * @param String Dirección de la ordenación
	 * @return Dirección de la ordenación
	 */
	private Sort.Direction getSortDirection(String direction) {
		if (direction.equals("asc")) {
			return Sort.Direction.ASC;
		} else if (direction.equals("desc")) {
			return Sort.Direction.DESC;
		}

		return Sort.Direction.ASC;
	}

	/**
	 * Devolvemos la fecha actual
	 * 
	 * @return Fecha actual
	 */
	public LocalDate obtenerFechaActual() {
		return LocalDate.now();
	}

	/**
	 * Devolvemos la hora actual inicializando los segundos a 00
	 * 
	 * @return Hora actual con segundos a 00
	 */
	public LocalTime obtenerHoraActualSinSegundos() {
		return LocalTime.of(LocalTime.now().getHour(), LocalTime.now().getMinute(), 00);
	}

	/**
	 * Calculamos el estado del evento dependiendo de la fecha y la hora
	 * Puede ser: Suspendido, Aplazado, Finalizado, Directo o Planificado (El tiempo
	 * que queda para que comienze)
	 * 
	 * @param eventoDto Evento
	 */
	public void calcularEstado(EventoDto eventoDto) {
		if (eventoDto.estaSuspendido()) {
			// Evento suspendido
			eventoDto.setEstado(Constantes.ESTADO_SUSPENDIDO);
		} else if (eventoDto.estaAplazado()) {
			// Evento aplazado
			eventoDto.setEstado(Constantes.ESTADO_APLAZADO);
		} else {
			// Obtenemos la fecha del sistema
			LocalDate fechaActual = obtenerFechaActual();
			// Obtenemos la fecha y hora del sistema
			LocalDateTime fechaHoraActual = LocalDateTime.now();

			// Obtenemos las horas del primer tramo horario
			LocalTime horaIni1 = eventoDto.getHoraIni1() != null
					? LocalTime.of(eventoDto.getHoraIni1().getHour(), eventoDto.getHoraIni1().getMinute(), 00)
					: null;
			LocalTime horaFin1 = eventoDto.getHoraFin1() != null
					? LocalTime.of(eventoDto.getHoraFin1().getHour(), eventoDto.getHoraFin1().getMinute(), 59)
					: null;

			// Obtenemos las horas del segundo tramo horario
			LocalTime horaIni2 = eventoDto.getHoraIni2() != null
					? LocalTime.of(eventoDto.getHoraIni2().getHour(), eventoDto.getHoraIni2().getMinute(), 00)
					: null;
			LocalTime horaFin2 = eventoDto.getHoraFin2() != null
					? LocalTime.of(eventoDto.getHoraFin2().getHour(), eventoDto.getHoraFin2().getMinute(), 59)
					: null;

			// Comparamos la fecha actual con la parte Date de la fecha del evento
			int compare = eventoDto.getFecha().compareTo(fechaActual);

			if (compare <= -2) {
				// Evento finalizado hace mas de un día
				eventoDto.setEstado(Constantes.ESTADO_FINALIZADO);
			} else if (compare == -1) {
				// Evento con fecha de ayer

				// Establecemos por defecto el estado en FINALIZADO
				eventoDto.setEstado(Constantes.ESTADO_FINALIZADO);

				if (eventoDto.finalizaMañana()) {
					// Evento con fecha de ayer y que finaliza hoy

					// Obtenemos la fecha del evento +1 (ayer +1 = hoy) y le añadimos la mayor hora
					// de finalización
					LocalDateTime fechaHoraFinEvento = LocalDateTime.of(eventoDto.getFecha().plusDays(1), horaFin2);

					if (!fechaHoraFinEvento.isBefore(fechaHoraActual))
						// Evento con fecha de ayer, que finaliza hoy y que aún no ha finalizado
						eventoDto.setEstado(Constantes.ESTADO_DIRECTO);
				}
			} else if (compare == 0 && eventoDto.duraTodoElDia()) {
				// Evento con fecha de hoy y que dura todo el día
				eventoDto.setEstado(Constantes.ESTADO_DIRECTO);
			} else {
				// Evento con fecha de hoy en adelante
				this.calcularTiempo(eventoDto, horaIni1, horaFin1, horaIni2, horaFin2);
			}
		}
	}

	/**
	 * Calculamos el tiempo que queda para el primer o segundo tramo del evento, en
	 * caso contrario, el evento estará en directo o finalizado
	 * 
	 * @param eventoDto Evento por el que preguntar
	 * @param horaIni1  Hora de inicio del primer tramo del evento
	 * @param horaFin1  Hora de fin del primer tramo del evento
	 * @param horaIni2  Hora de inicio del segundo tramo del evento
	 * @param horaFin2  Hora de fin del segundo tramo del evento
	 */
	private void calcularTiempo(EventoDto eventoDto, LocalTime horaIni1, LocalTime horaFin1, LocalTime horaIni2,
			LocalTime horaFin2) {
		// Obtenemos la fecha y hora del sistema
		LocalDateTime fechaHoraActual = LocalDateTime.now();
		// Obtenemos la fecha del evento con la hora de inicio del primer tramo
		LocalDateTime fechaHoraIni1Evento = horaIni1 != null ? LocalDateTime.of(eventoDto.getFecha(), horaIni1) : null;
		// Obtenemos la fecha del evento con la hora de finalización del primer tramo
		LocalDateTime fechaHoraFin1Evento = horaFin1 != null ? LocalDateTime.of(eventoDto.getFecha(), horaFin1) : null;
		// Obtenemos la fecha del evento con la hora de inicio del segundo tramo
		LocalDateTime fechaHoraIni2Evento = horaIni2 != null ? LocalDateTime.of(eventoDto.getFecha(), horaIni2) : null;
		// Obtenemos la fecha del evento con la hora de finalización del segundo tramo
		LocalDateTime fechaHoraFin2Evento = horaFin2 != null ? LocalDateTime.of(eventoDto.getFecha(), horaFin2) : null;

		if (fechaHoraIni1Evento != null && fechaHoraIni1Evento.isAfter(fechaHoraActual)) {
			// Si la hora del evento aún no ha llegado al primer tramo

			// Calculamos la diferencia
			eventoDto.setEstado(this.calcularDiferencia(fechaHoraActual, fechaHoraIni1Evento));
		} else {
			// Si la hora del evento es mayor o igual a la hora de inicio del primer tramo

			if (fechaHoraFin1Evento != null && fechaHoraFin1Evento.isAfter(fechaHoraActual)) {
				// Si la hora del evento aún no ha llegado al final del primer tramo

				// El evento está en directo
				eventoDto.setEstado(Constantes.ESTADO_DIRECTO);
			} else {
				// Si la hora del evento es mayor o igual a la hora de finalización del primer
				// tramo

				if (fechaHoraIni2Evento != null) {
					// Si existe segundo tramo

					if (fechaHoraIni2Evento.isAfter(fechaHoraActual)) {
						// Si la hora del evento aún no ha llegado al segundo tramo

						// Calculamos la diferencia
						eventoDto.setEstado(this.calcularDiferencia(fechaHoraActual, fechaHoraIni2Evento));
					} else {
						// Si la hora del evento es mayor o igual a la hora de inicio del segundo tramo

						if (fechaHoraFin2Evento != null && fechaHoraFin2Evento.isBefore(fechaHoraActual)) {
							// Si la hora del evento es mayor a la hora de finalización del segundo tramo

							// El evento está en finalizado
							eventoDto.setEstado(Constantes.ESTADO_FINALIZADO);
						} else {
							// Si la hora del evento es menor o igual a la la hora de finalización del
							// segundo tramo

							// El evento está en directo
							eventoDto.setEstado(Constantes.ESTADO_DIRECTO);
						}
					}
				} else {
					if (fechaHoraFin2Evento != null) {
						// Si no existe segundo tramo pero existe hora de finalización del segundo
						// tramo,
						// quiere decir que el evento finaliza mañana

						// El evento está en directo
						eventoDto.setEstado(Constantes.ESTADO_DIRECTO);
					} else {
						// Para el resto de casos, el evento está finalizado
						eventoDto.setEstado(Constantes.ESTADO_FINALIZADO);
					}
				}
			}
		}
	}

	/**
	 * Calculamos el tiempo de diferencia entre dos fechas, ya sea en años, meses,
	 * semanas, días, horas, minutos o segundos
	 * 
	 * @param fechaHora1 Fecha inicial
	 * @param fechaHora2 Fecha final
	 * @return Tiempo de diferencia entre las dos fechas
	 */
	private String calcularDiferencia(LocalDateTime fechaHora1, LocalDateTime fechaHora2) {
		String en = "En ";

		long anios = ChronoUnit.YEARS.between(fechaHora1, fechaHora2);
		if (anios > 0)
			return en + String.valueOf(anios) + (anios == 1 ? " año" : " años");

		long meses = ChronoUnit.MONTHS.between(fechaHora1, fechaHora2);
		if (meses > 0)
			return en + String.valueOf(meses) + (meses == 1 ? " mes" : " meses");

		long semanas = ChronoUnit.WEEKS.between(fechaHora1, fechaHora2);
		if (semanas > 0)
			return en + String.valueOf(semanas) + (semanas == 1 ? " semana" : " semanas");

		long dias = ChronoUnit.DAYS.between(fechaHora1, fechaHora2);
		if (dias > 0)
			return en + String.valueOf(dias) + (dias == 1 ? " día" : " días");

		long horas = ChronoUnit.HOURS.between(fechaHora1, fechaHora2);
		if (horas > 0)
			return en + String.valueOf(horas) + (horas == 1 ? " hora" : " horas");

		long minutos = ChronoUnit.MINUTES.between(fechaHora1, fechaHora2);
		if (minutos > 0)
			return en + String.valueOf(minutos) + (minutos == 1 ? " minuto" : " minutos");

		long segundos = ChronoUnit.SECONDS.between(fechaHora1, fechaHora2);
		return en + String.valueOf(segundos) + (segundos == 1 ? " segundo" : " segundos");
	}

	/**
	 * Construimos el resultado de búsqueda para los listados pageables
	 * 
	 * @param page  Objeto Page
	 * @param items Listado de resultados
	 * @return Resultado de búsqueda
	 */
	public <T> ResultadoDto construirResultadoBusqueda(Page<T> page, Object items) {
		return new ResultadoDto(//
				page.getTotalElements(), //
				page.getTotalPages(), //
				page.getNumber(), //
				page.isFirst(), //
				page.isLast(), //
				page.hasPrevious(), //
				page.hasNext(), //
				items);
	}

}
