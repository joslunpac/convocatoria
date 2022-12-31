package com.convocatoria.backend.model.entity;

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

import com.convocatoria.backend.security.model.entity.Usuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ent")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Entidad {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Column(unique = true, length = 50)
	private String codigo;

	@Column(length = 500)
	private String nombre;

	@NotNull
	@Column(name = "nombre_corto", length = 50)
	private String nombreCorto;

	@Column(name = "nombre_corto_aux", length = 50)
	private String nombreCortoAux;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "ten_id", referencedColumnName = "id")
	private TipoEntidad tipoEntidad;

	@ManyToOne
	@JoinColumn(name = "car_principal_id", referencedColumnName = "id")
	private Caracter caracterPrincipal;

	@ManyToMany
	@JoinTable(name = "ent_car", joinColumns = @JoinColumn(name = "ent_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "car_id", referencedColumnName = "id"))
	private List<Caracter> caracteres = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "tba_id", referencedColumnName = "id")
	private TipoBanda tipoBanda;

	@ManyToOne
	@JoinColumn(name = "lug_id", referencedColumnName = "id")
	private Lugar lugar;

	@Column(length = 1000)
	private String nota;

	@NotNull
	@Column(name = "tiene_avatar", columnDefinition = "boolean default false")
	private Boolean tieneAvatar;

	@NotNull
	@Column(columnDefinition = "boolean default true")
	private Boolean visible;

	@NotNull
	@Column(columnDefinition = "boolean default true")
	private Boolean pendienteRevisar;

	@ManyToMany(mappedBy = "bandas")
	private List<Evento> eventos = new ArrayList<>();

	@ManyToMany(mappedBy = "entidades")
	private List<Usuario> usuarios = new ArrayList<>();

}
