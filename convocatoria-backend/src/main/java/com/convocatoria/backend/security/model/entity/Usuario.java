package com.convocatoria.backend.security.model.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.convocatoria.backend.model.entity.Auditoria;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario extends Auditoria {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(length = 50)
	private String avatar;

	@NotNull
	@Column(unique = true)
	private String email;

	@NotNull
	@Column(length = 100)
	private String nombre;
	
	@NotNull
	@Column(length = 500)
	private String apellidos;

	@NotNull
	@Column(length = 256)
	private String password;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "usu_rol", joinColumns = @JoinColumn(name = "usu_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "rol_id", referencedColumnName = "id"))
	private List<Rol> roles = new ArrayList<>();

}
