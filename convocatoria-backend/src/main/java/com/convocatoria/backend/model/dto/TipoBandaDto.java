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
public class TipoBandaDto {

	private Long id;

	@NotBlank(message = "El acrónimo es obligatorio")
	@Size(min = 1, max = 50, message = "El acrónimo debe tener entre 1 y 50 carácteres")
	private String acronimo;

	@NotBlank(message = "El nombre singular es obligatorio")
	@Size(min = 1, max = 100, message = "El nombre singular debe tener entre 1 y 100 carácteres")
	private String nombreSingular;

	@NotBlank(message = "El nombre plural es obligatorio")
	@Size(min = 1, max = 100, message = "El nombre plural debe tener entre 1 y 100 carácteres")
	private String nombrePlural;

}
