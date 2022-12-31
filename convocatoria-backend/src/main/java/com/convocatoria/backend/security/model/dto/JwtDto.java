package com.convocatoria.backend.security.model.dto;

import java.io.Serializable;

import javax.validation.constraints.NotBlank;

import com.convocatoria.backend.model.dto.Views;
import com.fasterxml.jackson.annotation.JsonView;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonView(Views.Public.class)
public class JwtDto implements Serializable {

    @NotBlank(message = "El token es obligatorio")
    private String token;

}
