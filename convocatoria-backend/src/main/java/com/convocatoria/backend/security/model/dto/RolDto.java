package com.convocatoria.backend.security.model.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.convocatoria.backend.model.dto.Views;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonView(Views.Public.class)
public class RolDto {

	private Long id;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(min = 1, max = 50, message = "El nombre debe tener entre 1 y 50 carácteres")
	private RolEnum nombre;

}
