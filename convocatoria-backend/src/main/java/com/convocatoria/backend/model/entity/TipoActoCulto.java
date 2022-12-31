package com.convocatoria.backend.model.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.convocatoria.backend.security.model.entity.Usuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tac")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TipoActoCulto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Column(name = "nombre_singular", length = 100)
	private String nombreSingular;

	@NotNull
	@Column(name = "nombre_plural", length = 100)
	private String nombrePlural;

	@NotNull
	@Column(precision = 3, columnDefinition = "integer default 0")
	private int dias;

	@ManyToMany(mappedBy = "tiposActoCulto")
	private List<Usuario> usuarios = new ArrayList<>();

}
