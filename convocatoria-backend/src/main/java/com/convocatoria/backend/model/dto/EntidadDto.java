package com.convocatoria.backend.model.dto;

import java.util.List;

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
public class EntidadDto {

	private Long id;

	@NotBlank(message = "El código es obligatorio")
	@Size(min = 1, max = 50, message = "El código debe tener entre 1 y 50 carácteres")
	private String codigo;

	@Size(min = 1, max = 500, message = "El nombre debe tener entre 1 y 500 carácteres")
	private String nombre;

	@NotBlank(message = "El nombre corto es obligatorio")
	@Size(min = 1, max = 50, message = "El nombre corto debe tener entre 1 y 50 carácteres")
	private String nombreCorto;

	@Size(min = 1, max = 50, message = "El nombre corto auxiliar debe tener entre 1 y 50 carácteres")
	private String nombreCortoAux;

	@NotNull(message = "El tipo de entidad no puede ser nulo")
	private TipoEntidadDto tipoEntidad;

	private CaracterDto caracterPrincipal;

	private List<CaracterDto> caracteres;

	private TipoBandaDto tipoBanda;

	private LugarDto lugar;

	@JsonView(Views.Private.class)
	@Size(min = 1, max = 1000, message = "La nota debe tener entre 1 y 1000 carácteres")
	private String nota;

	@NotNull(message = "Hay que indicar si tiene avatar")
	private Boolean tieneAvatar;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si está visible")
	private Boolean visible;

	@JsonView(Views.Private.class)
	@NotNull(message = "Hay que indicar si se revisa la entidad")
	private Boolean pendienteRevisar;

}
