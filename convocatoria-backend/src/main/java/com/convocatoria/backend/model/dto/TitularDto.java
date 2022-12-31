package com.convocatoria.backend.model.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonView(Views.Public.class)
public class TitularDto {

	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(min = 1, max = 100, message = "El nombre debe tener entre 1 y 100 carácteres")
	private String nombre;

	@NotBlank(message = "La categoría es obligatoria")
	@Size(min = 1, max = 1, message = "La categoría debe tener 1 carácter")
	private String categoria;

	@Min(value = 1, message = "El orden tiene que ser mayor o igual que 1")
	private int orden;

	@NotNull(message = "La entidad no puede ser nula")
	private EntidadDto entidad;

	private CaracterDto caracter;

	@NotNull(message = "Hay que indicar si tiene avatar")
	private Boolean tieneAvatar;

}
