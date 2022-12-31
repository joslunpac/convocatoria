package com.convocatoria.backend.exception;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.convocatoria.backend.util.Constantes;

@RestControllerAdvice
public class ControladorExcepciones {

	/**
	 * Captura los errores de validación de los Dtos realizados por la
	 * anotación @Valid
	 */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST) // 400
	@ResponseBody
	public MensajeError dtosExceptions(MethodArgumentNotValidException exception, HttpServletRequest request) {
		List<String> messages = new ArrayList<>();

		exception.getBindingResult().getAllErrors().forEach((error) -> {
			messages.add(error.getDefaultMessage());
		});

		return new MensajeError(HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST.getReasonPhrase(), messages, request.getRequestURI());
	}

	@ExceptionHandler({
		MyBadRequestException.class,
		DuplicateKeyException.class,
		HttpMediaTypeNotSupportedException.class,
		MissingRequestHeaderException.class,
		MissingServletRequestParameterException.class,
		MethodArgumentTypeMismatchException.class,
		IllegalArgumentException.class,
		HttpMessageNotReadableException.class,
	})
	@ResponseStatus(value = HttpStatus.BAD_REQUEST) // 400
	@ResponseBody
	public MensajeError badRequestExceptions(Exception exception, HttpServletRequest request) {
		List<String> messages = new ArrayList<>();
		messages.add(exception.getMessage());
		return new MensajeError(HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST.getReasonPhrase(), messages, request.getRequestURI());
	}
	
	@ExceptionHandler({
		MyUnauthorizedException.class,
		BadCredentialsException.class,
		AuthenticationException.class,
		AccessDeniedException.class
	})
	@ResponseStatus(value = HttpStatus.UNAUTHORIZED) // 401
	public MensajeError unauthorized(Exception exception, HttpServletRequest request) {
		List<String> messages = new ArrayList<>();

		if (exception instanceof BadCredentialsException) {
			messages.add(Constantes.CREDENCIALES_INCORRECTAS);
		} else {
			messages.add(exception.getMessage());
		}

		return new MensajeError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.getReasonPhrase(), messages, request.getRequestURI());
	}

	@ExceptionHandler({
		MyForbiddenException.class
	})
	@ResponseStatus(value = HttpStatus.FORBIDDEN) // 403
	@ResponseBody
	public MensajeError forbiddenExceptions(Exception exception, HttpServletRequest request) {
		List<String> messages = new ArrayList<>();
		messages.add(exception.getMessage());
		return new MensajeError(HttpStatus.FORBIDDEN.value(), HttpStatus.FORBIDDEN.getReasonPhrase(), messages, request.getRequestURI());
	}

	@ExceptionHandler({
		MyNotFoundException.class
	})
	@ResponseStatus(value = HttpStatus.NOT_FOUND) // 404
	@ResponseBody
	public MensajeError notFoundExceptions(Exception exception, HttpServletRequest request) {
		List<String> messages = new ArrayList<>();
		messages.add(exception.getMessage());
		return new MensajeError(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND.getReasonPhrase(), messages, request.getRequestURI());
	}

	@ExceptionHandler({
		MyConflictException.class
	})
	@ResponseStatus(value = HttpStatus.CONFLICT) // 409
	@ResponseBody
	public MensajeError conflictExceptions(Exception exception, HttpServletRequest request) {
		List<String> messages = new ArrayList<>();
		messages.add(exception.getMessage());
		return new MensajeError(HttpStatus.CONFLICT.value(), HttpStatus.CONFLICT.getReasonPhrase(), messages, request.getRequestURI());
	}

	@ExceptionHandler({
		Exception.class
	})
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR) // 500
	@ResponseBody
	public MensajeError otherExceptions(Exception exception, HttpServletRequest request) {
		List<String> messages = new ArrayList<>();
		messages.add(exception.getMessage());
		return new MensajeError(HttpStatus.INTERNAL_SERVER_ERROR.value(), HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(), messages, request.getRequestURI());
	}

}
