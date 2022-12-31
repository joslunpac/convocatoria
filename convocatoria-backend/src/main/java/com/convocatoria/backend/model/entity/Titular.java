package com.convocatoria.backend.model.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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
@Table(name = "tit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Titular {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Column(length = 100)
	private String nombre;

	@NotNull
	@Column(length = 1)
	private String categoria;

	@NotNull
	@Column(precision = 2, columnDefinition = "integer default 1")
	private int orden;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "ent_id", referencedColumnName = "id")
	private Entidad entidad;

	@ManyToOne
	@JoinColumn(name = "car_id", referencedColumnName = "id")
	private Caracter caracter;

	@NotNull
	@Column(name = "tiene_avatar", columnDefinition = "boolean default false")
	private Boolean tieneAvatar;

	@ManyToMany(mappedBy = "titulares")
	private List<Evento> eventos = new ArrayList<>();

	@ManyToMany(mappedBy = "titulares")
	private List<Usuario> usuarios = new ArrayList<>();

}
