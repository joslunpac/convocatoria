package com.convocatoria.backend.security.model.dto;

import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.convocatoria.backend.model.dto.AuditoriaDto;
import com.convocatoria.backend.model.dto.Views;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonView(Views.Public.class)
public class UsuarioDto extends AuditoriaDto {

	private Long id;

	@Size(max = 50, message = "El avatar debe tener como máximo 50 carácteres")
	private String avatar;

	@Email
	@NotBlank(message = "El email es obligatorio")
	private String email;

	@NotBlank(message = "El nombre es obligatorio")
	@Size(max = 100, message = "El nombre debe tener como máximo 100 carácteres")
	private String nombre;

	@NotBlank(message = "Los apellidos son obligatorios")
	@Size(max = 500, message = "Los apellidos debe tener como máximo 500 carácteres")
	private String apellidos;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Size(min = 4, max = 40, message = "El password debe tener entre 4 y 40 carácteres")
	private String password;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Size(min = 4, max = 40, message = "El password debe tener entre 4 y 40 carácteres")
	private String nuevoPassword;

	@NotNull(message = "Debe contener al menos un rol")
	private List<RolDto> roles;

}
