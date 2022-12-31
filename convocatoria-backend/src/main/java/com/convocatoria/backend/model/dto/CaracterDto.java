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
public class CaracterDto {

	private Long id;

	@NotBlank(message = "El acrónimo es obligatorio")
	@Size(min = 3, max = 3, message = "El acronimo debe tener 3 carácteres")
	private String acronimo;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(min = 1, max = 50, message = "El nombre debe tener entre 1 y 50 carácteres")
	private String nombre;

}
