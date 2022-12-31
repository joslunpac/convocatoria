package com.convocatoria.backend.security.model.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.convocatoria.backend.model.dto.Views;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonView(Views.Public.class)
public class SignupDto {

	@Email
	@NotBlank(message = "El email es obligatorio")
	private String email;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(max = 100, message = "El nombre debe tener como máximo 100 carácteres")
	private String nombre;
	
	@NotBlank(message = "Los apellidos son obligatorios")
	@Size(max = 500, message = "Los apellidos debe tener como máximo 500 carácteres")
	private String apellidos;

	@NotBlank(message = "El password es obligatorio")
	@Size(min = 4, max = 40, message = "El password debe tener entre 4 y 40 carácteres")
	private String password;

}