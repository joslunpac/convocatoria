package com.convocatoria.backend.exception;

public class MyBadRequestException extends RuntimeException {

	public MyBadRequestException(String message) {
		super(message);
	}

}
