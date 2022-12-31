package com.convocatoria.backend.security.model.dto;

import java.io.Serializable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.convocatoria.backend.model.dto.Views;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonView(Views.Public.class)
public class SigninDto implements Serializable {

    @Email
	@NotBlank(message = "El email es obligatorio")
	private String email;

	@NotBlank(message = "El password es obligatorio")
	@Size(min = 4, max = 40, message = "El password debe tener entre 4 y 40 carácteres")
	private String password;
    
}
