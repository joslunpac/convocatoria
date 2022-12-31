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
public class PersonaDto {

	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(min = 1, max = 100, message = "El nombre debe tener entre 1 y 100 carácteres")
	private String nombre;

	@Size(min = 1, max = 100, message = "La profesión debe tener entre 1 y 100 carácteres")
	private String profesion;

	@NotBlank(message = "El género es obligatorio")
	@Size(min = 1, max = 1, message = "El género debe tener 1 carácter")
	private String genero;

}
