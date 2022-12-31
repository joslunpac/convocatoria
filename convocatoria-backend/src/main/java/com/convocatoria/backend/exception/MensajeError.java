package com.convocatoria.backend.exception;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class MensajeError {

	private int status;
	private String error;
	private List<String> message;
	private String path;

}
