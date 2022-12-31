package com.convocatoria.backend.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ten")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TipoEntidad {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Column(unique = true, length = 50)
	private String acronimo;

	@NotNull
	@Column(name = "nombre_singular", length = 100)
	private String nombreSingular;

	@NotNull
	@Column(name = "nombre_plural", length = 100)
	private String nombrePlural;

}
