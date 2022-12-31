package com.convocatoria.backend.model.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.springframework.util.StringUtils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "eve")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Evento extends Auditoria {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "eve_padre_id", referencedColumnName = "id")
	private Evento eventoPadre;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "tac_id", referencedColumnName = "id")
	private TipoActoCulto tipoActoCulto;

	@Column(length = 500)
	private String tipo;

	@Column
	private Integer edicion;

	@Column
	private Integer aniversario;

	@NotNull
	@Column(precision = 3, columnDefinition = "integer default 0")
	private int dia;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "ent_id", referencedColumnName = "id")
	private Entidad entidadOrganizadora;

	@ManyToOne
	@JoinColumn(name = "car_id", referencedColumnName = "id")
	private Caracter caracter;

	@NotNull
	@Column
	private LocalDate fecha;

	@NotNull
	@Column(name = "hora_ini_1")
	private LocalTime horaIni1;

	@Column(name = "hora_fin_1")
	private LocalTime horaFin1;

	@Column(name = "hora_ini_2")
	private LocalTime horaIni2;

	@Column(name = "hora_fin_2")
	private LocalTime horaFin2;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "lug_id", referencedColumnName = "id")
	private Lugar lugar;

	@ManyToMany
	@JoinTable(name = "tit_eve", joinColumns = @JoinColumn(name = "eve_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "tit_id", referencedColumnName = "id"))
	private List<Titular> titulares = new ArrayList<>();

	@ManyToMany
	@JoinTable(name = "per_eve", joinColumns = @JoinColumn(name = "eve_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "per_id", referencedColumnName = "id"))
	private List<Persona> personas = new ArrayList<>();

	@ManyToMany
	@JoinTable(name = "ban_eve", joinColumns = @JoinColumn(name = "eve_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "ent_id", referencedColumnName = "id"))
	private List<Entidad> bandas = new ArrayList<>();

	@Column(length = 500)
	private String marco;

	@Column(length = 500)
	private String titulo;

	@Column(name = "titulo_sesion")
	private Integer tituloEdicion;

	@Column(length = 500)
	private String hito;

	@Column(name = "hito_aniversario")
	private Integer hitoAniversario;

	@Column(length = 5000)
	private String informacion;

	@Column(length = 5000)
	private String itinerario;

	@Column(length = 1000)
	private String nota;

	@NotNull
	@Column(columnDefinition = "boolean default true")
	private Boolean visible;

	@NotNull
	@Column(columnDefinition = "boolean default false")
	private Boolean aplazado;

	@NotNull
	@Column(columnDefinition = "boolean default false")
	private Boolean suspendido;

	@NotNull
	@Column(columnDefinition = "boolean default false")
	private Boolean extraordinario;

	@NotNull
	@Column(columnDefinition = "boolean default false")
	private Boolean pendienteRevisar;

	@Column(name = "revisar_nota", length = 1000)
	private String revisarNota;

	@Column(length = 1)
	private String duplicado;

	@Column(length = 1000)
	private String regla;

	@NotNull
	@Column(columnDefinition = "boolean default false")
	private Boolean periodico;

	@NotNull
	@Column(name = "revisar_tipo_acto_culto", columnDefinition = "boolean default false")
	private Boolean revisarTipoActoCulto;

	@NotNull
	@Column(name = "revisar_dias", columnDefinition = "boolean default false")
	private Boolean revisarDias;

	@NotNull
	@Column(name = "revisar_lugar", columnDefinition = "boolean default false")
	private Boolean revisarLugar;

	@NotNull
	@Column(name = "revisar_titulares", columnDefinition = "boolean default false")
	private Boolean revisarTitulares;

	@NotNull
	@Column(name = "revisar_personas", columnDefinition = "boolean default false")
	private Boolean revisarPersonas;

	@NotNull
	@Column(name = "revisar_bandas", columnDefinition = "boolean default false")
	private Boolean revisarBandas;

	@NotNull
	@Column(name = "revisar_informacion", columnDefinition = "boolean default false")
	private Boolean revisarInformacion;

	@NotNull
	@Column(name = "revisar_itinerario", columnDefinition = "boolean default false")
	private Boolean revisarItinerario;

	@NotNull
	@Column(name = "revisar_regla", columnDefinition = "boolean default false")
	private Boolean revisarRegla;

	public Evento(Evento evento) {
		this.eventoPadre = evento.getEventoPadre();
		this.tipoActoCulto = evento.getTipoActoCulto();
		this.tipo = evento.getTipo();
		this.edicion = evento.getEdicion();
		this.aniversario = evento.getAniversario();
		this.dia = evento.getDia();
		this.entidadOrganizadora = evento.getEntidadOrganizadora();
		this.caracter = evento.getCaracter();
		this.fecha = evento.getFecha();
		this.horaIni1 = evento.getHoraIni1();
		this.horaFin1 = evento.getHoraFin1();
		this.horaIni2 = evento.getHoraIni2();
		this.horaFin2 = evento.getHoraFin2();
		this.lugar = evento.getLugar();

		if (evento.getTitulares() != null && !evento.getTitulares().isEmpty())
			for (Titular titular : evento.getTitulares()) {
				this.addTitular(titular);
			}

		if (evento.getPersonas() != null && !evento.getPersonas().isEmpty())
			for (Persona persona : evento.getPersonas()) {
				this.addPersona(persona);
			}

		if (evento.getBandas() != null && !evento.getBandas().isEmpty())
			for (Entidad banda : evento.getBandas()) {
				this.addBanda(banda);
			}

		this.marco = evento.getMarco();
		this.titulo = evento.getTitulo();
		this.tituloEdicion = evento.getTituloEdicion();
		this.hito = evento.getHito();
		this.hitoAniversario = evento.getHitoAniversario();
		this.informacion = evento.getInformacion();
		this.itinerario = evento.getItinerario();
		this.nota = evento.getNota();
		this.visible = evento.getVisible();
		this.aplazado = evento.getAplazado();
		this.suspendido = evento.getSuspendido();
		this.extraordinario = evento.getExtraordinario();
		this.pendienteRevisar = evento.getPendienteRevisar();
		this.revisarNota = evento.getRevisarNota();
		this.duplicado = evento.getDuplicado();
		this.regla = evento.getRegla();
		this.periodico = evento.getPeriodico();
		this.revisarTipoActoCulto = evento.getRevisarTipoActoCulto();
		this.revisarDias = evento.getRevisarDias();
		this.revisarLugar = evento.getRevisarLugar();
		this.revisarTitulares = evento.getRevisarTitulares();
		this.revisarPersonas = evento.getRevisarPersonas();
		this.revisarBandas = evento.getRevisarBandas();
		this.revisarInformacion = evento.getRevisarInformacion();
		this.revisarItinerario = evento.getRevisarItinerario();
		this.revisarRegla = evento.getRevisarRegla();
	}

	/** Métodos útiles para el evento padre */
	public boolean esPadre() {
		return this.eventoPadre == null;
	}

	public void marcarComoPadre() {
		this.eventoPadre = null;
	}

	/** Métodos útiles para el tipo de acto o culto del evento */
	public boolean tieneDuracionFija() {
		return this.getTipoActoCulto().getDias() > 0;
	}

	/** Métodos útiles para la edición del evento */
	public boolean tieneEdicion() {
		return this.getEdicion() != null && this.getEdicion() > 0;
	}

	/** Métodos útiles para el aniversario del evento */
	public boolean tieneAniversario() {
		return this.getAniversario() != null && this.getAniversario() > 0;
	}

	/** Métodos útiles para el carácter del evento */
	public boolean tieneCaracter() {
		return this.caracter != null;
	}

	/** Método útiles para los titulares del evento */
	public Boolean tieneTitulares() {
		return this.getTitulares() != null && !this.getTitulares().isEmpty();
	}

	public void addTitular(Titular titular) {
		titulares.add(titular);
		titular.getEventos().add(this);
	}

	public void removeTitular(Titular titular) {
		titulares.remove(titular);
		titular.getEventos().remove(this);
	}

	/** Método útiles para las personas del evento */
	public void addPersona(Persona persona) {
		personas.add(persona);
		persona.getEventos().add(this);
	}

	public void removePersona(Persona persona) {
		personas.remove(persona);
		persona.getEventos().remove(this);
	}

	/** Método útiles para las bandas del evento */
	public void addBanda(Entidad banda) {
		bandas.add(banda);
		banda.getEventos().add(this);
	}

	public void removeBanda(Entidad banda) {
		bandas.remove(banda);
		banda.getEventos().remove(this);
	}

	/** Métodos útiles para las característica propias del evento */
	public void comprobarVisibilidad() {
		if (this.visible && (this.getRevisarTipoActoCulto() ||
				this.getRevisarDias() ||
				this.getRevisarLugar() ||
				this.getRevisarTitulares() ||
				this.getRevisarPersonas()))
			this.visible = false;
	}

	public boolean estaAplazado() {
		return this.getAplazado();
	}

	public boolean esExtraordinario() {
		return this.getExtraordinario();
	}

	public void marcarComoExtraordinario() {
		this.extraordinario = true;
	}

	public boolean tieneHitoOAniversario() {
		return StringUtils.hasText(this.getHito())
				|| (this.hitoAniversario != null && this.hitoAniversario > 0);
	}

	public void eliminarHitoYAniversario() {
		this.hito = null;
		this.hitoAniversario = null;
	}

	public boolean estaPendienteRevisar() {
		return this.getPendienteRevisar();
	}

	public void marcarComoPendienteRevisar() {
		this.pendienteRevisar = true;
	}

	/** Métodos útiles para las característica fijas de futuros eventos */
	public boolean estaDuplicado() {
		return this.getDuplicado() != null && this.getDuplicado().equals("S");
	}

	public void marcarComoNoDuplicado() {
		this.duplicado = "N";
	}

	public void marcarComoDuplicado() {
		this.duplicado = "S";
	}

	public void marcarComoNoDuplicable() {
		this.duplicado = null;
	}

	public boolean tieneRegla() {
		return StringUtils.hasText(this.getRegla());
	}

	public boolean esPeriodico() {
		return this.getPeriodico();
	}

	public void marcarComoNoPeriodico() {
		this.periodico = false;
	}

	public boolean tieneRevisarLugar() {
		return this.getRevisarLugar();
	}

	public boolean tieneRevisarTitulares() {
		return this.getRevisarTitulares();
	}

	public boolean tieneRevisarPersonas() {
		return this.getRevisarPersonas();
	}

	public void desmarcarTodosRevisar() {
		this.pendienteRevisar = false;
		this.revisarNota = null;
		this.revisarTipoActoCulto = false;
		this.revisarDias = false;
		this.revisarLugar = false;
		this.revisarTitulares = false;
		this.revisarPersonas = false;
		this.revisarBandas = false;
		this.revisarInformacion = false;
		this.revisarItinerario = false;
		this.revisarRegla = false;
	}

}
