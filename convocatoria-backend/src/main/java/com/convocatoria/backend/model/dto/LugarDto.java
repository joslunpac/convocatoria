package com.convocatoria.backend.model.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonView(Views.Public.class)
public class LugarDto {

	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(min = 1, max = 100, message = "El nombre debe tener entre 1 y 100 carácteres")
	private String nombre;

	@NotBlank(message = "La dirección es obligatoria")
	@Size(min = 1, max = 500, message = "La dirección debe tener entre 1 y 500 carácteres")
	private String direccion;

}
