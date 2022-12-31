package com.convocatoria.backend.model.dto;

import com.fasterxml.jackson.annotation.JsonView;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@JsonView(Views.Public.class)
public class ResultadoDto {

	private long totalItems;
	private int totalPaginas;
	private int paginaActual;
	private boolean esPrimera;
	private boolean esUltima;
	private boolean hayAnterior;
	private boolean hayPosterior;
	private Object items;

}
