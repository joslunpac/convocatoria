package com.convocatoria.backend.model.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonView(Views.Public.class)
public class EventoDto extends AuditoriaDto {

	private Long id;

	private EventoDto eventoPadre;

	@NotNull(message = "El tipo de acto o culto no puede ser nulo")
	private TipoActoCultoDto tipoActoCulto;

	@Size(min = 1, max = 500, message = "El tipo debe tener entre 1 y 500 carácteres")
	private String tipo;

	@Min(value = 1, message = "La edición mínima es 1")
	private Integer edicion;

	@Min(value = 1, message = "El aniversario mínimo es 1")
	private Integer aniversario;

	private int dia;

	@NotNull(message = "La entidad organizadora no puede ser nula")
	private EntidadDto entidadOrganizadora;

	private CaracterDto caracter;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@NotNull(message = "La fecha es obligatoria")
	private LocalDate fecha;

	@NotNull(message = "La hora de inicio 1 es obligatoria")
	private LocalTime horaIni1;

	private LocalTime horaFin1;

	private LocalTime horaIni2;

	private LocalTime horaFin2;

	@NotNull(message = "El lugar no puede ser nulo")
	private LugarDto lugar;

	private List<TitularDto> titulares;

	private List<PersonaDto> personas;

	private List<EntidadDto> bandas;

	@Size(min = 1, max = 500, message = "El marco debe tener entre 1 y 500 carácteres")
	private String marco;

	@Size(min = 1, max = 500, message = "El título debe tener entre 1 y 500 carácteres")
	private String titulo;

	@Min(value = 1, message = "La edición del título mínima es 1")
	private Integer tituloEdicion;

	@Size(min = 1, max = 500, message = "El hito debe tener entre 1 y 500 carácteres")
	private String hito;

	@Min(value = 1, message = "El aniversario del hito mínimo es 1")
	private Integer hitoAniversario;

	@Size(min = 1, max = 5000, message = "La información debe tener entre 1 y 5000 carácteres")
	private String informacion;

	@Size(min = 1, max = 5000, message = "El itinerario debe tener entre 1 y 5000 carácteres")
	private String itinerario;

	@JsonView(Views.Private.class)
	@Size(min = 1, max = 1000, message = "La nota debe tener entre 1 y 1000 carácteres")
	private String nota;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si está visible")
	private Boolean visible;

	@NotNull(message = "Hay que indicar si está aplazado")
	private Boolean aplazado;

	@NotNull(message = "Hay que indicar si está suspendido")
	private Boolean suspendido;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si es extraordinario")
	private Boolean extraordinario;

	@NotNull(message = "Hay que indicar si se revisa el evento")
	private Boolean pendienteRevisar;

	@JsonView(Views.Private.class)
	@Size(min = 1, max = 1000, message = "La nota de la revisión debe tener entre 1 y 1000 carácteres")
	private String revisarNota;

	@JsonView(Views.Private.class)
	@Size(min = 1, max = 1, message = "El duplicado debe tener 1 carácter")
	private String duplicado;

	@Size(min = 1, max = 1000, message = "La regla debe tener entre 1 y 1000 carácteres")
	@JsonView(Views.Private.class)
	private String regla;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si es periódico")
	private Boolean periodico;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar el tipo de acto o culto")
	private Boolean revisarTipoActoCulto;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar los días")
	private Boolean revisarDias;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar el lugar")
	private Boolean revisarLugar;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar los titulares")
	private Boolean revisarTitulares;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar las personas")
	private Boolean revisarPersonas;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar las bandas")
	private Boolean revisarBandas;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar la información")
	private Boolean revisarInformacion;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar el itinerario")
	private Boolean revisarItinerario;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si hay que revisar la regla")
	private Boolean revisarRegla;

	private String estado;

	/** Métodos útiles para la fecha y horas del evento */
	public Boolean finalizaMañana() {
		if (this.getHoraIni1() != null && this.getHoraFin1() == null && getHoraIni2() == null
		&& getHoraFin2() != null) {
			return true;
		} else {
			return false;
		}
	}

	public Boolean duraTodoElDia() {
		if (this.getHoraFin1() == null && this.getHoraIni2() == null && this.getHoraFin2() == null) {
			return true;
		} else {
			return false;
		}
	}

	/** Métodos útiles para el aplazamiento del evento */
	public boolean estaAplazado() {
		return this.getAplazado();
	}

	/** Métodos útiles para la suspención del evento */
	public boolean estaSuspendido() {
		return this.getSuspendido();
	}

}
